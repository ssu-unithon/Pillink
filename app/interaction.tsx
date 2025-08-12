import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import CircularGauge from '../components/CircularGauge';
import InteractionRiskGroups from '../components/InteractionRiskGroups';
import InteractionWarning from '../components/InteractionWarning';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { FAMILY_DATA } from '@/constants/FamilyData';
import { FAMILY_INTERACTION_DATA } from '@/constants/InteractionData';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatService, { DrugInteractionAnalysis } from '@/services/ChatService';
import FamilyService from '@/services/FamilyService';
import { useFocusEffect } from 'expo-router';

export default function InteractionScreen() {
  const [selectedGroup, setSelectedGroup] = useState<'risk' | 'safe' | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [drugInteractionData, setDrugInteractionData] = useState<DrugInteractionAnalysis | null>(null);
  const [isLoadingRiskData, setIsLoadingRiskData] = useState(false);
  const [riskDataError, setRiskDataError] = useState<string | null>(null);
  const [selectedMemberName, setSelectedMemberName] = useState<string>('사용자');
  const router = useRouter();

  // 선택된 가족 구성원 정보 가져오기
  const fetchFamilyMemberInfo = async (memberId: string) => {
    try {
      console.log('🔍 Fetching family member info for ID:', memberId);
      const token = await AsyncStorage.getItem('access_token');
      if (!token) return;

      const familyResponse = await fetch('https://pillink-backend-production.up.railway.app/family', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (familyResponse.ok) {
        const familyData = await familyResponse.json();
        const member = familyData.users?.find((user: any) => user.id.toString() === memberId);
        
        if (member) {
          console.log('✅ Found member:', member.name);
          setSelectedMemberName(member.name);
        } else {
          console.warn('❌ Member not found with ID:', memberId);
          setSelectedMemberName('사용자');
        }
      }
    } catch (error) {
      console.error('❌ Failed to fetch family member info:', error);
      setSelectedMemberName('사용자');
    }
  };

  // 약물 상호작용 데이터 가져오기
  const fetchDrugInteractionData = async (targetId?: string) => {
    try {
      setIsLoadingRiskData(true);
      setRiskDataError(null);
      console.log('🔍 Fetching drug interaction data for targetId:', targetId);
      
      const targetIdNumber = targetId ? parseInt(targetId) : undefined;
      const analysisData = await ChatService.getDrugInteractionAnalysis(targetIdNumber);
      
      console.log('✅ Drug interaction data received:', analysisData);
      setDrugInteractionData(analysisData);
    } catch (error: any) {
      console.error('❌ Failed to fetch drug interaction data:', error);
      setRiskDataError(error.message || '위험도 정보를 불러올 수 없습니다.');
      
      // 에러 발생 시 기본값 설정
      setDrugInteractionData({
        riskRate: 0,
        count: 0,
        collisionCount: 0,
        collisions: [],
        duplicateCount: 0,
        duplicates: [],
        pairCount: 0,
        warnings: [],
        errors: []
      });
    } finally {
      setIsLoadingRiskData(false);
    }
  };

  // AsyncStorage에서 선택된 가족 id를 불러와서 사용
  useEffect(() => {
    (async () => {
      const storedId = await AsyncStorage.getItem('selected_family_id');
      if (storedId) {
        setSelectedMemberId(storedId);
      }
    })();
  }, []);

  // 화면 포커스될 때마다 데이터 새로고침
  useFocusEffect(
    React.useCallback(() => {
      if (selectedMemberId) {
        console.log('🔄 Interaction screen focused - fetching data for:', selectedMemberId);
        fetchFamilyMemberInfo(selectedMemberId);
        fetchDrugInteractionData(selectedMemberId);
      }
    }, [selectedMemberId])
  );

  // 그룹 버튼 클릭 핸들러
  const handleGroupPress = (groupType: 'risk' | 'safe') => {
    const newSelection = selectedGroup === groupType ? null : groupType;
    setSelectedGroup(newSelection);
  };

  // API 데이터 기반 그룹 데이터
  const groupData = {
    risk: [
      { 
        name: '위험/주의 상호작용', 
        description: `위험: ${drugInteractionData ? drugInteractionData.collisionCount : 0}건`, 
        type: '위험' 
      },
    ],
    safe: [
      { 
        name: '안전 상호작용', 
        description: `안전: ${drugInteractionData ? (drugInteractionData.count - drugInteractionData.collisionCount) : 0}건`, 
        type: '안전' 
      },
    ],
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: Platform.OS === 'ios' ? 48 : 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{selectedMemberName}님의 약물 복용 리포트</Text>
          <Text style={styles.headerSubtitle}>복용 중인 약물들의 상호작용을 확인하세요</Text>
        </View>
        {/* 상호작용 안전도 */}
        <View style={styles.sectionContainer}>
          <View style={styles.gaugeSection}>
            {isLoadingRiskData ? (
              <View style={styles.loadingGauge}>
                <Text style={styles.loadingText}>분석 중...</Text>
              </View>
            ) : (
              <CircularGauge 
                value={drugInteractionData ? drugInteractionData.riskRate : 0} 
                size={180} 
                title={riskDataError ? "오류" : undefined}
              />
            )}
            {riskDataError && (
              <Text style={styles.errorText}>{riskDataError}</Text>
            )}
          </View>
          <View style={styles.interactionRiskGroupsWrapper}>
            <InteractionRiskGroups
              interactable={true}
              onGroupPress={handleGroupPress}
              selectedGroup={selectedGroup}
              dangerousCount={drugInteractionData ? drugInteractionData.collisionCount : 0}
              safeCount={drugInteractionData ? (drugInteractionData.count - drugInteractionData.collisionCount) : 0}
            />
            {drugInteractionData && drugInteractionData.duplicateCount > 0 && (
              <Text style={styles.warningText}>
                중복 성분 {drugInteractionData.duplicateCount}개 발견: {drugInteractionData.duplicates.join(', ')}
              </Text>
            )}
          </View>
        </View>
        {/* 경고 문구 */}
        <InteractionWarning riskScore={drugInteractionData ? drugInteractionData.riskRate : 0} />
        {/* 선택된 그룹의 상세 정보 표시 */}
        {selectedGroup && (
          <View style={styles.detailContainer}>
            <Text style={styles.detailTitle}>
              {selectedGroup === 'risk' && '위험/주의 상호작용 상세'}
              {selectedGroup === 'safe' && '안전 상호작용 상세'}
            </Text>
            {groupData[selectedGroup].map((item, index) => (
              <View key={index} style={styles.detailItem}>
                <Text style={styles.detailItemName}>{item.name}</Text>
                <Text style={styles.detailItemDescription}>{item.description}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <BottomNavigationBar activeIndex={1} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    // paddingTop 제거 (상단 여백은 contentContainerStyle에서 처리)
  },
  memberSelectorWrapper: {
    marginBottom: 18,
    marginTop: 4,
  },
  memberSelectorScroll: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  memberButton: {
    backgroundColor: '#F2F4F7',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  memberButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  memberButtonText: {
    color: Colors.text,
    fontWeight: '600',
    fontSize: 16,
  },
  memberButtonTextSelected: {
    color: '#fff',
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.mediumGray,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  gaugeSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  gaugeLabel: {
    textAlign: 'center',
    color: Colors.mediumGray,
    fontSize: 15,
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  interactionRiskGroupsWrapper: {
    marginTop: 10,
  },
  detailContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  detailItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  detailItemDescription: {
    fontSize: 14,
    color: Colors.mediumGray,
  },
  loadingGauge: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: Colors.mediumGray,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 8,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  warningText: {
    fontSize: 12,
    color: '#F59E0B',
    marginTop: 8,
    fontWeight: '500',
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 6,
    textAlign: 'center',
  },
});
