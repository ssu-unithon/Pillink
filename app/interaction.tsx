import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Colors } from '../constants/Colors';
import SearchBar from '../components/SearchBar';
import CircularGauge from '../components/CircularGauge';
import InteractionRiskGroups from '../components/InteractionRiskGroups';
import BottomNavigationBar from '../components/BottomNavigationBar';

export default function InteractionScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{type: string, title: string, description: string} | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<'duplicate' | 'risk' | 'safe' | null>(null);

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

  // 그룹 버튼 클릭 핸들러
  const handleGroupPress = (groupType: 'duplicate' | 'risk' | 'safe') => {
    setSelectedGroup(selectedGroup === groupType ? null : groupType);
  };

  // 모달 열기 함수
  const handleItemPress = (type: string, title: string, description: string) => {
    setSelectedItem({ type, title, description });
    setModalVisible(true);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
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
            <CircularGauge percentage={79} size={180} />
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
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            현재 약물 상호작용 위험 점수가 높습니다.{'\n'}반드시 의사, 약사와 상담하여 약물 변경 또는 사용 중단 여부를 결정하세요.
          </Text>
        </View>

        {/* 선택된 그룹의 상세 정보 */}
        {selectedGroup && (
          <View style={styles.selectedGroupSection}>
            <Text style={styles.selectedGroupTitle}>
              {selectedGroup === 'duplicate' ? '중복 약물' :
               selectedGroup === 'risk' ? '위험한 상호작용' :
               '안전한 조합'}
            </Text>

            {groupData[selectedGroup].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.medicationItem}
                onPress={() => handleItemPress(item.type, item.name,
                  selectedGroup === 'duplicate' ? '동일한 효과를 가진 약물이 중복 처방되었습니다.' :
                  selectedGroup === 'risk' ? '이 약물 조합은 위험한 부작용을 일으킬 수 있습니다.' :
                  '이 약물 조합은 안전하며 서로 효과를 증진시킵니다.'
                )}
              >
                <View style={styles.medicationInfo}>
                  <Text style={styles.medicationName}>{item.name}</Text>
                  <Text style={styles.medicationDescription}>{item.description}</Text>
                </View>
                <View style={[
                  styles.riskBadge,
                  { backgroundColor:
                    selectedGroup === 'duplicate' ? Colors.light.primaryLight :
                    selectedGroup === 'risk' ? Colors.light.dangerLight :
                    Colors.light.secondaryLight
                  }
                ]}>
                  <Text style={[
                    styles.riskBadgeText,
                    { color:
                      selectedGroup === 'duplicate' ? Colors.light.primary :
                      selectedGroup === 'risk' ? Colors.light.danger :
                      Colors.light.secondary
                    }
                  ]}>
                    {item.type}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedItem?.title}</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={[
                styles.modalBadge,
                { backgroundColor:
                  selectedItem?.type === '중복' ? Colors.light.primaryLight :
                  selectedItem?.type === '위험' ? Colors.light.dangerLight :
                  Colors.light.secondaryLight
                }
              ]}>
                <Text style={[
                  styles.modalBadgeText,
                  { color:
                    selectedItem?.type === '중복' ? Colors.light.primary :
                    selectedItem?.type === '위험' ? Colors.light.danger :
                    Colors.light.secondary
                  }
                ]}>
                  {selectedItem?.type}
                </Text>
              </View>

              <Text style={styles.modalDescription}>
                {selectedItem?.description}
              </Text>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.actionButton} onPress={closeModal}>
                  <Text style={styles.actionButtonText}>의사와 상담하기</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={closeModal}>
                  <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>나중에 확인</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <BottomNavigationBar activeIndex={1} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.light.mediumGray,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.light.mediumGray,
    fontWeight: '400',
  },
  gaugeSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  interactionRiskGroupsWrapper: {
    // flex: 1, // 제거
  },
  detailSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
  },
  medicationItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 8,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  medicationDescription: {
    fontSize: 14,
    color: Colors.light.mediumGray,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 20,
    maxWidth: 340,
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: Colors.light.mediumGray,
  },
  modalBody: {
    padding: 20,
  },
  modalBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalDescription: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  modalActions: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  secondaryButtonText: {
    color: Colors.light.text,
  },
  selectedGroupSection: {
    marginBottom: 32,
  },
  selectedGroupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 16,
  },
  warningContainer: {
    backgroundColor: '#FFCCCC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 24,
  },
  warningText: {
    color: '#D8000C',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
