import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Alert,
  Modal 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import PrimaryButton from '@/components/PrimaryButton';

export default function PrescriptionImport() {
  const router = useRouter();
  const [startDate, setStartDate] = useState('2020년 9월 26일');
  const [endDate, setEndDate] = useState('2021년 9월 26일');
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    // 시뮬레이션: 처방전 데이터 로드
    setTimeout(() => {
      setPrescriptions([
        { id: 1, date: '2021-09-26', hospital: '서울대학교병원' }
      ]);
      setLoading(false);
    }, 1500);
  };

  const handleImageView = () => {
    setShowImageModal(true);
  };

  const handleLatest = () => {
    Alert.alert('최신순 정렬', '최신 처방전 순으로 정렬되었습니다.');
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>처방전 불러오기</Text>
        <View style={{ width: 40, height: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 설명 섹션 */}
        <View style={styles.descriptionSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="document-text" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.mainTitle}>해당 약 정보가</Text>
          <Text style={styles.subtitle}>
            <Text style={styles.highlight}>[개별 복용 약 리스트]</Text>에 추가돼요.
          </Text>
        </View>

        {/* 조회 기간 섹션 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>조회기간</Text>
          <View style={styles.dateSection}>
            <View style={styles.dateRow}>
              <TouchableOpacity style={styles.dateButton}>
                <Text style={styles.dateButtonText}>{startDate}</Text>
                <Ionicons name="chevron-down" size={16} color={Colors.mediumGray} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.dateButton}>
                <Text style={styles.dateButtonText}>{endDate}</Text>
                <Ionicons name="chevron-down" size={16} color={Colors.mediumGray} />
              </TouchableOpacity>
            </View>
            <PrimaryButton
              title="조회하기"
              onPress={handleSearch}
              loading={loading}
              style={styles.searchButton}
            />
          </View>
        </View>

        {/* 조회 결과 섹션 */}
        <View style={styles.sectionCard}>
          <View style={styles.resultHeader}>
            <Text style={styles.sectionTitle}>조회결과</Text>
            <TouchableOpacity onPress={handleLatest} style={styles.sortButton}>
              <Text style={styles.sortButtonText}>최신순</Text>
            </TouchableOpacity>
          </View>

          {prescriptions.length > 0 ? (
            <View style={styles.prescriptionCard}>
              <TouchableOpacity 
                style={styles.prescriptionImageContainer}
                onPress={handleImageView}
              >
                <Image
                  source={require('@/assets/images/prescription.png')}
                  style={styles.prescriptionImage}
                  resizeMode="contain"
                />
                <View style={styles.imageOverlay}>
                  <Ionicons name="eye" size={24} color="#fff" />
                  <Text style={styles.viewText}>자세히 보기</Text>
                </View>
              </TouchableOpacity>
              
              <View style={styles.prescriptionInfo}>
                <Text style={styles.prescriptionDate}>2021년 9월 26일</Text>
                <Text style={styles.prescriptionHospital}>서울대학교병원</Text>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.selectButton}>
                    <Ionicons name="add-circle" size={20} color={Colors.primary} />
                    <Text style={styles.selectButtonText}>선택하기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={48} color="#E5E7EB" />
              <Text style={styles.emptyText}>조회 버튼을 눌러 처방전을 검색하세요</Text>
              <Text style={styles.emptySubtext}>선택한 기간 내의 처방전이 표시됩니다</Text>
            </View>
          )}
        </View>

        {/* 도움말 섹션 */}
        <View style={styles.helpCard}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
          <View style={styles.helpTextContainer}>
            <Text style={styles.helpTitle}>처방전 불러오기 안내</Text>
            <Text style={styles.helpText}>
              • 건강보험심사평가원에서 제공하는 데이터입니다{'\n'}
              • 조회 기간은 최대 1년까지 설정 가능합니다{'\n'}
              • 처방전 선택 후 약물 정보가 자동으로 등록됩니다
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 이미지 확대 모달 */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowImageModal(false)}
          >
            <View style={styles.modalContent}>
              <Image
                source={require('@/assets/images/prescription.png')}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowImageModal(false)}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  descriptionSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  highlight: {
    color: Colors.primary,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  dateSection: {
    gap: 16,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.card,
  },
  dateButtonText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  searchButton: {
    backgroundColor: Colors.primary,
    minHeight: 50,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  sortButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  prescriptionCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  prescriptionImageContainer: {
    position: 'relative',
    height: 300,
    backgroundColor: '#f8f9fa',
  },
  prescriptionImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  prescriptionInfo: {
    padding: 16,
  },
  prescriptionDate: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  prescriptionHospital: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  selectButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.mediumGray,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  helpCard: {
    flexDirection: 'row',
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    marginBottom: 24,
  },
  helpTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  helpText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    position: 'relative',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});