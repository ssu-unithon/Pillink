import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addMedicationToMember } from '@/constants/FamilyData';

// 임시 로컬 약물 데이터베이스
const LOCAL_MEDICATION_DATABASE: Medication[] = [
  {
    itemSeq: '202005623',
    itemName: '어린이타이레놀산160밀리그램(아세트아미노펜)',
    entpName: '한국존슨앤드존슨판매(유)',
    efcyQesitm: '이 약은 감기로 인한 발열 및 동통(통증), 두통, 신경통, 근육통, 월경통, 염좌통(삔 통증), 치통, 관절통, 류마티양 동통(통증)에 사용합니다.',
    itemImage: null
  },
  {
    itemSeq: '202106092',
    itemName: '타이레놀정500밀리그람(아세트아미노펜)',
    entpName: '한국존슨앤드존슨판매(유)',
    efcyQesitm: '이 약은 감기로 인한 발열 및 동통(통증), 두통, 신경통, 근육통, 월경통, 염좌통(삔 통증), 치통, 관절통, 류마티양 동통(통증)에 사용합니다.',
    itemImage: 'https://nedrug.mfds.go.kr/pbp/cmn/itemImageDownload/1OKRXo9l4D5'
  },
  {
    itemSeq: '198800001',
    itemName: '부루펜정400밀리그램(이부프로펜)',
    entpName: '삼일제약(주)',
    efcyQesitm: '류마티스성 관절염, 골관절염(퇴행성 관절질환), 통풍성 관절염, 강직성 척추염의 염증 및 동통',
    itemImage: null
  },
  {
    itemSeq: '198800002', 
    itemName: '낙센정275밀리그램(낙신)',
    entpName: '한국화이자제약(주)',
    efcyQesitm: '류마티스성 관절염, 골관절염, 강직성 척추염, 건선성 관절염 등의 염증성 질환',
    itemImage: null
  },
  {
    itemSeq: '198800003',
    itemName: '게보린정(아세트아미노펜)',
    entpName: '삼진제약(주)',
    efcyQesitm: '해열, 두통, 치통, 생리통, 관절통, 신경통, 근육통의 진통',
    itemImage: null
  }
];

interface Medication {
  itemSeq: string;
  itemName: string;
  entpName: string;
  efcyQesitm: string;
  itemImage: string | null;
}

export default function MedicationInput() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<Medication[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState('08:00');
  const [count, setCount] = useState('1');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // 선택된 가족 구성원 ID 가져오기
    const getSelectedFamily = async () => {
      try {
        const savedId = await AsyncStorage.getItem('selected_family_id');
        setSelectedFamilyId(savedId);
      } catch (error) {
        console.error('Failed to get selected family:', error);
      }
    };
    getSelectedFamily();
  }, []);

  const searchMedications = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      // 로컬 데이터베이스에서 검색
      const results = LOCAL_MEDICATION_DATABASE.filter(medication =>
        medication.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medication.entpName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medication.efcyQesitm.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // 실제 API 호출처럼 약간의 지연 시뮬레이션
      setTimeout(() => {
        setSearchResults(results);
        setIsLoading(false);
      }, 300);
    } catch (error) {
      console.error('약물 검색 오류:', error);
      Alert.alert('오류', '약물 검색 중 오류가 발생했습니다.');
      setSearchResults([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 검색어가 변경될 때 약물 검색
    const timer = setTimeout(() => {
      searchMedications(searchText);
    }, 300); // 300ms 디바운스

    return () => clearTimeout(timer);
  }, [searchText]);

  const handleMedicationSelect = (medication: Medication) => {
    setSelectedMedication(medication);
    setSearchText(medication.itemName);
    setSearchResults([]);
  };

  const handleAddMedication = async () => {
    if (!selectedMedication) {
      Alert.alert('알림', '약물을 선택해주세요.');
      return;
    }

    if (!selectedFamilyId) {
      Alert.alert('알림', '가족 구성원을 먼저 선택해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      // 로컬 FamilyData에 약물 추가
      const medicationData = {
        id: Date.now().toString(),
        name: selectedMedication.itemName,
        type: '일반의약품',
        company: selectedMedication.entpName,
        dosage: `${count}정`,
        time: selectedTime,
        notes,
        itemSeq: selectedMedication.itemSeq,
        itemImage: selectedMedication.itemImage
      };
      
      console.log('Adding medication to familyId:', selectedFamilyId, medicationData);
      const success = addMedicationToMember(selectedFamilyId, medicationData);
      console.log('Local medication add success:', success);
      
      if (success) {
        Alert.alert('성공', `${selectedMedication.itemName}이(가) 추가되었습니다.`, [
          {
            text: '확인',
            onPress: () => router.back()
          }
        ]);
      } else {
        Alert.alert('오류', '약물 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to add medication:', error);
      Alert.alert('오류', '약물 추가 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>약물 직접 입력</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        {/* 검색 섹션 */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>약물 검색</Text>
          <Text style={styles.sectionDescription}>
            약물 이름, 성분, 제조사로 검색할 수 있습니다
          </Text>
          
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={Colors.mediumGray} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="약물명을 입력하세요 (예: 타이레놀)"
              placeholderTextColor={Colors.mediumGray}
              value={searchText}
              onChangeText={setSearchText}
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
          </View>

          {/* 로딩 상태 */}
          {isLoading && searchText.trim().length > 0 && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>검색 중...</Text>
            </View>
          )}

          {/* 검색 결과 */}
          {!isLoading && searchResults.length > 0 && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>검색 결과 ({searchResults.length}개)</Text>
              {searchResults.map((medication) => (
                <TouchableOpacity
                  key={medication.itemSeq}
                  style={styles.medicationItem}
                  onPress={() => handleMedicationSelect(medication)}
                  activeOpacity={0.7}
                >
                  <View style={styles.medicationImageContainer}>
                    {medication.itemImage ? (
                      <Image
                        source={{ uri: medication.itemImage }}
                        style={styles.medicationImage}
                        resizeMode="contain"
                        onError={() => console.log('이미지 로드 실패:', medication.itemImage)}
                      />
                    ) : (
                      <View style={styles.medicationImagePlaceholder}>
                        <Ionicons name="medical" size={28} color={Colors.mediumGray} />
                      </View>
                    )}
                  </View>
                  <View style={styles.medicationInfo}>
                    <Text style={styles.medicationName} numberOfLines={2}>
                      {medication.itemName}
                    </Text>
                    <Text style={styles.medicationDetails} numberOfLines={1}>
                      {medication.entpName}
                    </Text>
                    {medication.efcyQesitm && (
                      <Text style={styles.medicationDescription} numberOfLines={2}>
                        {medication.efcyQesitm.replace(/\n/g, ' ').trim()}
                      </Text>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.mediumGray} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* 검색 결과 없음 */}
          {!isLoading && searchText.trim().length > 0 && searchResults.length === 0 && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>검색 결과가 없습니다.</Text>
            </View>
          )}
        </View>

        {/* 선택된 약물 */}
        {selectedMedication && (
          <View style={styles.selectedSection}>
            <Text style={styles.sectionTitle}>선택된 약물</Text>
            <View style={styles.selectedMedicationCard}>
              <View style={styles.selectedMedicationImageContainer}>
                {selectedMedication.itemImage ? (
                  <Image
                    source={{ uri: selectedMedication.itemImage }}
                    style={styles.selectedMedicationImage}
                    resizeMode="contain"
                    onError={() => console.log('선택된 약물 이미지 로드 실패:', selectedMedication.itemImage)}
                  />
                ) : (
                  <View style={styles.selectedMedicationImagePlaceholder}>
                    <Ionicons name="medical" size={36} color={Colors.mediumGray} />
                  </View>
                )}
              </View>
              <View style={styles.selectedMedicationInfo}>
                <Text style={styles.selectedMedicationName} numberOfLines={2}>
                  {selectedMedication.itemName}
                </Text>
                <Text style={styles.selectedMedicationDetails} numberOfLines={1}>
                  {selectedMedication.entpName}
                </Text>
                {selectedMedication.efcyQesitm && (
                  <Text style={styles.selectedMedicationDescription} numberOfLines={3}>
                    {selectedMedication.efcyQesitm.replace(/\n/g, ' ').trim()}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => setSelectedMedication(null)}
                style={styles.removeButton}
              >
                <Ionicons name="close" size={20} color={Colors.mediumGray} />
              </TouchableOpacity>
            </View>

            {/* 복용 설정 */}
            <View style={styles.dosageSection}>
              <Text style={styles.sectionTitle}>복용 설정</Text>
              
              {/* 복용 시간 */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>복용 시간</Text>
                <View style={styles.timeSelector}>
                  {['08:00', '12:00', '18:00', '22:00'].map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeOption,
                        selectedTime === time && styles.timeOptionSelected
                      ]}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Text style={[
                        styles.timeOptionText,
                        selectedTime === time && styles.timeOptionTextSelected
                      ]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* 복용량 */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>복용량</Text>
                <View style={styles.countInputContainer}>
                  <TextInput
                    style={styles.countInput}
                    value={count}
                    onChangeText={setCount}
                    keyboardType="numeric"
                    placeholder="1"
                    placeholderTextColor={Colors.mediumGray}
                  />
                  <Text style={styles.countUnit}>정</Text>
                </View>
              </View>

              {/* 메모 */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>메모 (선택사항)</Text>
                <TextInput
                  style={styles.notesInput}
                  placeholder="예: 식후 30분, 물과 함께 복용"
                  placeholderTextColor={Colors.mediumGray}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  maxLength={100}
                />
              </View>
            </View>
          </View>
        )}

        {/* 안내 메시지 */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>
            {selectedFamilyId 
              ? '선택된 가족 구성원의 약물로 추가됩니다.'
              : '프로필에서 가족 구성원을 먼저 선택해주세요.'
            }
          </Text>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.addButton,
            (!selectedMedication || !selectedFamilyId || isLoading) && styles.addButtonDisabled
          ]}
          onPress={handleAddMedication}
          disabled={!selectedMedication || !selectedFamilyId || isLoading}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.addButtonText,
            (!selectedMedication || !selectedFamilyId || isLoading) && styles.addButtonTextDisabled
          ]}>
            {isLoading ? '추가 중...' : '약물 추가'}
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 12,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  searchSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    height: 56,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    height: '100%',
  },
  resultsContainer: {
    marginTop: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  medicationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 16,
  },
  medicationImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  medicationInfo: {
    flex: 1,
    paddingTop: 2,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
    lineHeight: 22,
  },
  medicationDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  medicationDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  selectedSection: {
    marginBottom: 32,
  },
  selectedMedicationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 16,
  },
  selectedMedicationImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedMedicationInfo: {
    flex: 1,
    paddingTop: 2,
  },
  selectedMedicationName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
    lineHeight: 24,
  },
  selectedMedicationDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  selectedMedicationDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  removeButton: {
    padding: 8,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    marginBottom: 32,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  addButtonDisabled: {
    backgroundColor: Colors.lightGray,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  addButtonTextDisabled: {
    color: Colors.mediumGray,
  },
  dosageSection: {
    marginTop: 24,
  },
  settingRow: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  timeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  timeOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  timeOptionTextSelected: {
    color: '#fff',
  },
  countInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    height: 50,
  },
  countInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },
  countUnit: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.card,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  loadingContainer: {
    marginTop: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  noResultsContainer: {
    marginTop: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  noResultsText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  medicationImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#AABFE7',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  medicationImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedMedicationImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#AABFE7',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedMedicationImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
});