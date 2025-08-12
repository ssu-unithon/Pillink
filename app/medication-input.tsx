import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addMedicationToMember } from '@/constants/FamilyData';

// 약물 데이터베이스 (실제로는 API에서 가져올 데이터)
const MEDICATION_DATABASE = [
  { id: '1', name: '타이레놀', type: '해열진통제', company: '한국얀센' },
  { id: '2', name: '애드빌', type: '해열진통제', company: '한국화이자' },
  { id: '3', name: '게보린', type: '해열진통제', company: '삼진제약' },
  { id: '4', name: '펜잘', type: '해열진통제', company: '동아제약' },
  { id: '5', name: '낙센', type: '소염진통제', company: '한국화이자' },
  { id: '6', name: '부루펜', type: '소염진통제', company: '삼일제약' },
  { id: '7', name: '아스피린', type: '해열진통제', company: '바이엘코리아' },
  { id: '8', name: '이브', type: '해열진통제', company: '에스에스제약' },
  { id: '9', name: '낫센', type: '소염진통제', company: '한국화이자' },
  { id: '10', name: '탁센', type: '소염진통제', company: '한독' },
  { id: '11', name: '인사돌', type: '해열진통제', company: '동아제약' },
  { id: '12', name: '훼스탈', type: '소화제', company: '동아제약' },
  { id: '13', name: '베아제', type: '소화제', company: '한국야쿠르트' },
  { id: '14', name: '신신파스', type: '외용제', company: '동국제약' },
  { id: '15', name: '멘소래담', type: '외용제', company: '동아제약' },
];

interface Medication {
  id: string;
  name: string;
  type: string;
  company: string;
}

export default function MedicationInput() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<Medication[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState('08:00');
  const [dosage, setDosage] = useState('1정');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'as-needed'>('daily');
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

  useEffect(() => {
    // 검색어가 변경될 때 약물 검색
    if (searchText.trim().length > 0) {
      const results = MEDICATION_DATABASE.filter(medication =>
        medication.name.toLowerCase().includes(searchText.toLowerCase()) ||
        medication.type.toLowerCase().includes(searchText.toLowerCase()) ||
        medication.company.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchText]);

  const handleMedicationSelect = (medication: Medication) => {
    setSelectedMedication(medication);
    setSearchText(medication.name);
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
      // FamilyData에 약물 추가
      const success = addMedicationToMember(selectedFamilyId, {
        id: selectedMedication.id,
        name: selectedMedication.name,
        type: selectedMedication.type,
        company: selectedMedication.company,
        dosage: dosage,
        frequency: frequency === 'daily' ? '1일 1회' : frequency === 'weekly' ? '1주 1회' : '필요시',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        notes: notes,
        time: selectedTime
      });

      if (success) {
        Alert.alert('성공', `${selectedMedication.name}이(가) 추가되었습니다.`, [
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
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
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

          {/* 검색 결과 */}
          {searchResults.length > 0 && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>검색 결과 ({searchResults.length}개)</Text>
              {searchResults.map((medication) => (
                <TouchableOpacity
                  key={medication.id}
                  style={styles.medicationItem}
                  onPress={() => handleMedicationSelect(medication)}
                  activeOpacity={0.7}
                >
                  <View style={styles.medicationInfo}>
                    <Text style={styles.medicationName}>{medication.name}</Text>
                    <Text style={styles.medicationDetails}>
                      {medication.type} • {medication.company}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.mediumGray} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* 선택된 약물 */}
        {selectedMedication && (
          <View style={styles.selectedSection}>
            <Text style={styles.sectionTitle}>선택된 약물</Text>
            <View style={styles.selectedMedicationCard}>
              <View style={styles.selectedMedicationInfo}>
                <Text style={styles.selectedMedicationName}>{selectedMedication.name}</Text>
                <Text style={styles.selectedMedicationDetails}>
                  {selectedMedication.type} • {selectedMedication.company}
                </Text>
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
                <View style={styles.dosageSelector}>
                  {['1정', '2정', '1/2정', '1포'].map((dose) => (
                    <TouchableOpacity
                      key={dose}
                      style={[
                        styles.dosageOption,
                        dosage === dose && styles.dosageOptionSelected
                      ]}
                      onPress={() => setDosage(dose)}
                    >
                      <Text style={[
                        styles.dosageOptionText,
                        dosage === dose && styles.dosageOptionTextSelected
                      ]}>
                        {dose}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* 복용 빈도 */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>복용 빈도</Text>
                <View style={styles.frequencySelector}>
                  <TouchableOpacity
                    style={[
                      styles.frequencyOption,
                      frequency === 'daily' && styles.frequencyOptionSelected
                    ]}
                    onPress={() => setFrequency('daily')}
                  >
                    <Text style={[
                      styles.frequencyOptionText,
                      frequency === 'daily' && styles.frequencyOptionTextSelected
                    ]}>
                      매일
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.frequencyOption,
                      frequency === 'as-needed' && styles.frequencyOptionSelected
                    ]}
                    onPress={() => setFrequency('as-needed')}
                  >
                    <Text style={[
                      styles.frequencyOptionText,
                      frequency === 'as-needed' && styles.frequencyOptionTextSelected
                    ]}>
                      필요시
                    </Text>
                  </TouchableOpacity>
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
    padding: 8,
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  medicationDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  selectedSection: {
    marginBottom: 32,
  },
  selectedMedicationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedMedicationInfo: {
    flex: 1,
  },
  selectedMedicationName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  selectedMedicationDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
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
  dosageSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  dosageOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dosageOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dosageOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  dosageOptionTextSelected: {
    color: '#fff',
  },
  frequencySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  frequencyOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  frequencyOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  frequencyOptionTextSelected: {
    color: '#fff',
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
});