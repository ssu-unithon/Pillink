import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import SearchBar from '../components/SearchBar';
import CircularGauge from '../components/CircularGauge';
import InteractionRiskGroups from '../components/InteractionRiskGroups';
import InteractionWarning from '../components/InteractionWarning';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { INTERACTION_DATA } from '@/constants/InteractionData';

export default function InteractionScreen() {
  const [selectedGroup, setSelectedGroup] = useState<'duplicate' | 'risk' | 'safe' | null>(null);

  // 그룹 버튼 클릭 핸들러 (모달 없이 단순 선택만)
  const handleGroupPress = (groupType: 'duplicate' | 'risk' | 'safe') => {
    const newSelection = selectedGroup === groupType ? null : groupType;
    setSelectedGroup(newSelection);
  };

  // 각 그룹별 데이터
  const groupData = {
    duplicate: [
      { name: '아스피린 + 와파린', description: '혈액 응고 방지 효과 중복', type: '중복' },
    ],
    risk: [
      { name: '메트포르민 + 알코올', description: '저혈당 위험 증가', type: '위험' },
    ],
    safe: [
      { name: '비타민 D + 칼슘', description: '뼈 건강 증진 효과', type: '안전' },
    ],
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar - 최상단으로 이동 */}
        <SearchBar placeholder="약물명을 검색하세요" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>오말순님의 약물 복용 리포트</Text>
          <Text style={styles.headerSubtitle}>복용 중인 약물들의 상호작용을 확인하세요</Text>
        </View>

        {/* 상호작용 안전도 */}
        <View style={styles.sectionContainer}>
          <View style={styles.gaugeSection}>
            <CircularGauge value={INTERACTION_DATA.riskScore} size={180} />
          </View>
          <View style={styles.interactionRiskGroupsWrapper}>
            <InteractionRiskGroups
              interactable={true}
              onGroupPress={handleGroupPress}
              selectedGroup={selectedGroup}
            />
          </View>
        </View>

        {/* 경고 문구 */}
        <InteractionWarning />

        {/* 선택된 그룹의 상세 정보 표시 */}
        {selectedGroup && (
          <View style={styles.detailContainer}>
            <Text style={styles.detailTitle}>
              {selectedGroup === 'duplicate' && '중복 성분'}
              {selectedGroup === 'risk' && '위험 상호작용'}
              {selectedGroup === 'safe' && '안전 상호작용'}
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
    paddingTop: 20,
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
