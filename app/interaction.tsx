import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import SearchBar from '../components/SearchBar';
import CircularGauge from '../components/CircularGauge';
import InteractionRiskGroups from '../components/InteractionRiskGroups';
import InteractionWarning from '../components/InteractionWarning';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { FAMILY_DATA } from '@/constants/FamilyData';
import { INTERACTION_DATA, FAMILY_INTERACTION_DATA } from '@/constants/InteractionData';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function InteractionScreen() {
  const [selectedGroup, setSelectedGroup] = useState<'risk' | 'safe' | null>(null);
  // 구성원 선택 상태 추가 (기본값: 첫 번째 실제 구성원)
  const familyMembers = FAMILY_DATA.filter(m => m.id !== 'invite');
  const [selectedMemberId, setSelectedMemberId] = useState(familyMembers[0]?.id || '1');
  const router = useRouter();

  // AsyncStorage에서 선택된 가족 id를 불러와서 사용
  useEffect(() => {
    (async () => {
      const storedId = await AsyncStorage.getItem('selected_family_id');
      if (storedId && storedId !== selectedMemberId) {
        setSelectedMemberId(storedId);
      }
    })();
  }, []);

  // 그룹 버튼 클릭 핸들러
  const handleGroupPress = (groupType: 'risk' | 'safe') => {
    const newSelection = selectedGroup === groupType ? null : groupType;
    setSelectedGroup(newSelection);
  };

  // 선택된 구성원의 상호작용 데이터
  const memberData = FAMILY_INTERACTION_DATA[selectedMemberId] || FAMILY_INTERACTION_DATA['1'];

  // 기존 요소에서 위험/안전 데이터만 연결 (선택된 구성원의 데이터 사용)
  const groupData = {
    risk: [
      { name: '위험/주의 상호작용', description: `위험: ${memberData.dangerousCount}건`, type: '위험' },
    ],
    safe: [
      { name: '안전 상호작용', description: `안전: ${memberData.safeCount}건`, type: '안전' },
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
          <Text style={styles.headerTitle}>{familyMembers.find(m => m.id === selectedMemberId)?.name || ''}님의 약물 복용 리포트</Text>
          <Text style={styles.headerSubtitle}>복용 중인 약물들의 상호작용을 확인하세요</Text>
        </View>
        {/* 상호작용 안전도 */}
        <View style={styles.sectionContainer}>
          <View style={styles.gaugeSection}>
            <CircularGauge value={memberData.riskScore} size={180} />
          </View>
          <View style={styles.interactionRiskGroupsWrapper}>
            <InteractionRiskGroups
              interactable={true}
              onGroupPress={handleGroupPress}
              selectedGroup={selectedGroup}
              dangerousCount={memberData.dangerousCount}
              safeCount={memberData.safeCount}
            />
          </View>
        </View>
        {/* 경고 문구 */}
        <InteractionWarning riskScore={memberData.riskScore} />
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
});
