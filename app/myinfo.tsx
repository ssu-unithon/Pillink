import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import BottomNavigationBar from '../components/BottomNavigationBar';
import FamilyGroup, { FamilyAvatar } from '../components/FamilyGroup';
import FamilyService, { FamilyGroup as FamilyGroupType } from '@/services/FamilyService';
import { useDeveloperMode } from '@/contexts/DevModeContext';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from 'expo-router';
import UserService, { UserInfo } from '@/services/UserService';

function OverlappingAvatars({ data, selectedId }: { data: any[]; selectedId: string | null }) {
  const familyMembers = data.filter(item => item.id !== 'invite' && item.id !== 'create-family');
  
  if (familyMembers.length === 0) {
    return null;
  }
  
  const totalWidth = (familyMembers.length - 1) * 28 + 48; // 겹침 간격 * (개수-1) + 마지막 아바타 너비

  return (
    <View style={[styles.avatarsRow, { width: totalWidth }]}>
      {familyMembers.map((item, idx) => (
        <FamilyAvatar
          key={item.id}
          name={item.name}
          active={selectedId === item.id}
          style={{ left: idx * 28, zIndex: familyMembers.length - idx, position: 'absolute' }}
        />
      ))}
    </View>
  );
}

export default function MyInfoScreen() {
  const { isDeveloperMode, toggleDeveloperMode } = useDeveloperMode();
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [familyData, setFamilyData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // API에서 가족 데이터 가져오기
  const fetchFamilyData = async () => {
    try {
      setIsLoading(true);
      
      // 토큰 확인
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        console.log('No access token found, showing create group option');
        setFamilyData([{ id: 'create-family', type: 'create-family' }]);
        return;
      }
      
      const familyGroup = await FamilyService.getFamily();
      
      // API 데이터를 기존 FamilyGroup 컴포넌트 형식에 맞게 변환
      const convertedData = [
        { id: 'invite', type: 'invite' }, // 초대하기 버튼
        ...familyGroup.users.map(user => ({
          id: user.id.toString(),
          name: user.name,
          active: true, // 모든 사용자를 활성 상태로 설정
          phone: user.phone,
          email: user.phone, // phone을 email로 사용
          medications: [],
          diseases: [],
          allergies: []
        }))
      ];
      
      setFamilyData(convertedData);
    } catch (error: any) {
      console.error('Failed to fetch family data:', error);
      
      // 404 오류인 경우 가족 그룹이 없다는 뜻
      if (error.message?.includes('404') || error.message?.includes('가족 그룹 조회 API 호출 실패')) {
        console.log('No family group found, showing create group option');
        setFamilyData([{ id: 'create-family', type: 'create-family' }]);
      } else {
        // 다른 오류의 경우 초대 버튼만 표시
        setFamilyData([{ id: 'invite', type: 'invite' }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const savedId = await AsyncStorage.getItem('selected_family_id');
      setSelectedId(savedId || null);
    })();
  }, []);

  // 화면에 포커스될 때마다 가족 데이터 새로고침
  useFocusEffect(
    React.useCallback(() => {
      console.log('🔄 MyInfo screen focused - refreshing family data');
      fetchFamilyData();
    }, [])
  );

  const handleDeveloperModeToggle = () => {
    console.log('INFO: 개발자 모드:', isDeveloperMode);
    toggleDeveloperMode();
  };

  const handleOnboardingNavigation = async () => {
    try {
      await AsyncStorage.setItem('onboarding_completed', 'false');
      router.push('/onboarding');
    } catch (error) {
      console.error('Failed to navigate to onboarding:', error);
    }
  };

  const handleAddAlarmNavigation = () => {
    router.push('/alarm');
  };

  const handleSignupNavigation = () => {
    router.push('/signup');
  };

  // 테스트 계정으로 로그인
  const handleTestLogin = async (testAccount: string) => {
    try {
      const response = await fetch('https://pillink-backend-production.up.railway.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: testAccount,  // 실제 백엔드에서는 email 필드 사용 (test1, test2, test3, test4)
          password: '1234'
        })
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem('access_token', data.accessToken);
        Alert.alert('로그인 성공', `${testAccount} 계정으로 로그인되었습니다.`);
        // 가족 데이터 새로고침
        fetchFamilyData();
      } else {
        const errorText = await response.text();
        console.log('Login failed for', testAccount, ':', response.status, response.statusText);
        console.log('Error response:', errorText);
        throw new Error(`로그인 실패: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('로그인 실패', '테스트 계정 로그인에 실패했습니다.');
    }
  };

  const handleSelectFamily = async (id: string) => {
    setSelectedId(id);
    await AsyncStorage.setItem('selected_family_id', id);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>내 정보</Text>
        <Text style={styles.subtitle}>프로필 및 설정</Text>

        {!isLoading && (
          <>
            <OverlappingAvatars data={familyData} selectedId={selectedId} />
            <View style={styles.familyGroupWrapper}>
              <FamilyGroup
                data={familyData}
                showAvatars={true}
                onSelectMember={handleSelectFamily}
                selectedId={selectedId}
              />
            </View>
          </>
        )}
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>가족 정보를 불러오는 중...</Text>
          </View>
        )}

        {/* 개발자 모드 섹션 */}
        <View style={styles.developerSection}>
          <TouchableOpacity
            style={styles.developerModeButton}
            onPress={handleDeveloperModeToggle}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="developer-mode"
              size={24}
              color={isDeveloperMode ? '#4285F4' : '#9CA3AF'}
            />
            <Text style={[
              styles.developerModeText,
              { color: isDeveloperMode ? '#4285F4' : '#9CA3AF' }
            ]}>
              개발자 모드 {isDeveloperMode ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>

          {isDeveloperMode && (
            <>
              <TouchableOpacity
                style={styles.onboardingButton}
                onPress={handleOnboardingNavigation}
                activeOpacity={0.7}
              >
                <MaterialIcons name="school" size={24} color="#F59E0B" />
                <Text style={styles.onboardingButtonText}>온보딩 화면 보기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.onboardingButton, { marginTop: 8, backgroundColor: '#E0F2FE', borderColor: '#38BDF8' }]}
                onPress={handleAddAlarmNavigation}
                activeOpacity={0.7}
              >
                <MaterialIcons name="alarm-add" size={24} color="#38BDF8" />
                <Text style={[styles.onboardingButtonText, { color: '#38BDF8' }]}>알람 추가 화면</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.onboardingButton, { marginTop: 8, backgroundColor: '#FDF2F8', borderColor: '#EC4899' }]}
                onPress={handleSignupNavigation}
                activeOpacity={0.7}
              >
                <MaterialIcons name="person-add" size={24} color="#EC4899" />
                <Text style={[styles.onboardingButtonText, { color: '#EC4899' }]}>회원가입 창</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.onboardingButton, { marginTop: 8, backgroundColor: '#F0FDF4', borderColor: '#10B981' }]}
                onPress={() => router.push('/medication-reminder')}
                activeOpacity={0.7}
              >
                <MaterialIcons name="notifications-active" size={24} color="#10B981" />
                <Text style={[styles.onboardingButtonText, { color: '#10B981' }]}>약물 복용 알림</Text>
              </TouchableOpacity>
              
              {/* 테스트 계정 로그인 버튼들 */}
              <View style={styles.testAccountsContainer}>
                <Text style={styles.testAccountsTitle}>테스트 계정 로그인</Text>
                {['test1', 'test2', 'test3', 'test4', 'test5'].map((account) => (
                  <TouchableOpacity
                    key={account}
                    style={[styles.testAccountButton]}
                    onPress={() => handleTestLogin(account)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="login" size={20} color="#10B981" />
                    <Text style={styles.testAccountButtonText}>{account} 로그인</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
      <BottomNavigationBar activeIndex={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 100,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.mediumGray,
  },
  familyGroupWrapper: {
    marginTop: 40,
    marginBottom: 24,
    alignItems: 'center',
    width: '100%',
  },
  avatarsRow: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 8,
    height: 44,
    position: 'relative',
    alignSelf: 'center',
  },
  avatarCount: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 8,
    zIndex: 0,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarCountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    width: '90%',
  },
  userAvatar: {
    marginRight: 0,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
  developerSection: {
    marginTop: 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    width: '90%',
    marginBottom: 20,
  },
  developerModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
  },
  developerModeText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  onboardingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  onboardingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
    marginLeft: 12,
  },
  loadingContainer: {
    marginTop: 40,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.mediumGray,
    textAlign: 'center',
  },
  testAccountsContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  testAccountsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
    marginBottom: 8,
    textAlign: 'center',
  },
  testAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ECFDF5',
    borderRadius: 6,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  testAccountButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10B981',
    marginLeft: 8,
  },
});
