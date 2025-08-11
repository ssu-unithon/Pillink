import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import BottomNavigationBar from '../components/BottomNavigationBar';
import FamilyGroup, { FamilyAvatar } from '../components/FamilyGroup';
import { FAMILY_DATA } from '@/constants/FamilyData';
import { useDeveloperMode } from '@/contexts/DevModeContext';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

function OverlappingAvatars({ data }: { data: any[] }) {
  const familyMembers = data.filter(item => item.id !== 'invite');
  const totalWidth = (familyMembers.length - 1) * 28 + 48; // 겹침 간격 * (개수-1) + 마지막 아바타 너비

  return (
    <View style={[styles.avatarsRow, { width: totalWidth }]}>
      {familyMembers.map((item, idx) => (
        <FamilyAvatar
          key={item.id}
          name={item.name}
          active={item.active}
          style={{ left: idx * 28, zIndex: familyMembers.length - idx, position: 'absolute' }}
        />
      ))}
    </View>
  );
}

export default function MyInfoScreen() {
  const { isDeveloperMode, toggleDeveloperMode } = useDeveloperMode();
  const router = useRouter();

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
    router.push('/add-alarm');
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

        <OverlappingAvatars data={FAMILY_DATA} />
        <View style={styles.familyGroupWrapper}>
          <FamilyGroup data={FAMILY_DATA} showAvatars={true} />
        </View>

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
});