import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import BottomNavigationBar from '../../components/BottomNavigationBar';
import CustomSwitch from '@/components/CustomSwitch';
import { FamilyAvatar } from '@/components/FamilyGroup';
import {
  getFamilyMemberById,
  getMedicationsByMemberId,
  MedicationInfo
} from '@/constants/FamilyData';

const AVAILABLE_DISEASES = [
  '당뇨병', '고혈압', '무릎관절증', '만성요통',
  '만성위염', '시력감퇴', '만성심질환', '알레르기',
  '전립선 비대증', '치매',
];

const AVAILABLE_ALLERGIES = [
  '게', '대두', '꽃가루', '땅콩',
  '계란', '석류', '벌', '꿀',
  '카페인 민감', 'MSG 민감',
];

export default function FamilyAlarmScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const familyMember = getFamilyMemberById(id as string);
  const [alarms, setAlarms] = useState<MedicationInfo[]>(
    getMedicationsByMemberId(id as string)
  );
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [isEditingDiseases, setIsEditingDiseases] = useState(false);
  const [isEditingAllergies, setIsEditingAllergies] = useState(false);
  const [diseases, setDiseases] = useState<string[]>(['당뇨병', '고혈압']); // Mock data
  const [allergies, setAllergies] = useState<string[]>(['대두', '꽃가루']); // Mock data

  if (!familyMember) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.errorText}>가족 정보를 찾을 수 없습니다.</Text>
        </View>
        <BottomNavigationBar activeIndex={4} />
      </View>
    );
  }

  const toggleAlarm = (alarmId: string) => {
    setAlarms(prev =>
      prev.map(alarm =>
        alarm.id === alarmId
          ? { ...alarm, enabled: !alarm.enabled }
          : alarm
      )
    );
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return '매일';
      case 'weekly': return '주간';
      case 'as-needed': return '필요시';
      default: return '매일';
    }
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode(prev => !prev);
    setSelectedMedications([]); // Clear selection when toggling mode
  };

  const toggleMedicationSelection = (medicationId: string) => {
    setSelectedMedications(prev =>
      prev.includes(medicationId)
        ? prev.filter(id => id !== medicationId)
        : [...prev, medicationId]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedMedications.length === 0) {
      Alert.alert('선택된 약물 없음', '삭제할 약물을 선택해주세요.');
      return;
    }
    Alert.alert(
      '약물 삭제',
      `선택된 약물 ${selectedMedications.length}개를 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제', onPress: () => {
            setAlarms(prev => prev.filter(alarm => !selectedMedications.includes(alarm.id)));
            setIsDeleteMode(false);
            setSelectedMedications([]);
            Alert.alert('삭제 완료', '선택된 약물이 삭제되었습니다.');
          }, style: 'destructive' },
      ]
    );
  };

  const toggleDisease = (disease: string) => {
    setDiseases(prev => 
      prev.includes(disease) 
        ? prev.filter(d => d !== disease)
        : [...prev, disease]
    );
  };

  const toggleAllergy = (allergy: string) => {
    setAllergies(prev =>
      prev.includes(allergy)
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const saveDiseases = () => {
    setIsEditingDiseases(false);
    // TODO: API 호출로 실제 저장
  };

  const saveAllergies = () => {
    setIsEditingAllergies(false);
    // TODO: API 호출로 실제 저장
  };

  const renderMedicationAlarm = (alarm: MedicationInfo) => (
    <TouchableOpacity
      key={alarm.id}
      style={styles.alarmCard}
      onPress={() => isDeleteMode ? toggleMedicationSelection(alarm.id) : router.push(`/add-alarm?medicationId=${alarm.id}&familyId=${id}`)}
      activeOpacity={0.7}
    >
      {isDeleteMode && (
        <Ionicons
          name={selectedMedications.includes(alarm.id) ? "checkbox-outline" : "square-outline"}
          size={24}
          color={Colors.primary}
          style={styles.checkboxIcon}
        />
      )}
      <View style={styles.alarmContent}>
        <View style={styles.alarmIcon}>
          <MaterialIcons
            name={alarm.icon as any}
            size={24}
            color={alarm.enabled ? Colors.primary : '#9CA3AF'}
          />
        </View>
        <View style={styles.alarmInfo}>
          <Text style={[styles.alarmTitle, { color: alarm.enabled ? '#1F2937' : '#9CA3AF' }]}>
            {alarm.medicationName}
          </Text>
          <Text style={styles.alarmDescription}>
            {alarm.dosage} • {getFrequencyText(alarm.frequency)}
          </Text>
          <Text style={styles.alarmTime}>{alarm.time}</Text>
          {alarm.notes && (
            <Text style={styles.notesText}>{alarm.notes}</Text>
          )}
        </View>
        <View style={styles.rightSection}>
          {!isDeleteMode && (
            <CustomSwitch
              value={alarm.enabled}
              onValueChange={() => toggleAlarm(alarm.id)}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.title}>설정</Text>
          <View style={{ width: 40, height: 40 }} />
        </View>

        {/* 프로필 섹션 */}
        <View style={styles.profileSection}>
          <FamilyAvatar
            name={familyMember.name}
            active={familyMember.active}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.memberName}>{familyMember.name}</Text>
          </View>
        </View>

        {/* 알림 통계 */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{alarms.filter(a => a.enabled).length}</Text>
            <Text style={styles.statLabel}>활성 알림</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{alarms.length}</Text>
            <Text style={styles.statLabel}>전체 약물</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{alarms.filter(a => a.enabled && a.frequency === 'daily').length}</Text>
            <Text style={styles.statLabel}>오늘 복용</Text>
          </View>
        </View>

        {/* 약물 알림 목록 */}
        <View style={styles.alarmsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>복용 중인 약물</Text>
            <View style={styles.sectionActions}>
              {!isDeleteMode ? (
                <>
                  <TouchableOpacity onPress={() => router.push(`/add-alarm?familyId=${id}`)} style={[styles.actionButton, styles.addButton]}>
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>추가</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={toggleDeleteMode} style={[styles.actionButton, styles.deleteButton]}>
                    <Ionicons name="trash-outline" size={20} color={Colors.danger} />
                    <Text style={styles.deleteButtonText}>삭제</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={toggleDeleteMode} style={[styles.actionButton, styles.cancelButton]}>
                  <Ionicons name="close" size={20} color={Colors.mediumGray} />
                  <Text style={styles.cancelButtonText}>취소</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {isDeleteMode && selectedMedications.length > 0 && (
            <TouchableOpacity onPress={handleDeleteSelected} style={styles.deleteConfirmButton}>
              <Text style={styles.deleteConfirmButtonText}>선택된 약물 삭제 ({selectedMedications.length})</Text>
            </TouchableOpacity>
          )}
          {alarms.length > 0 ? (
            alarms.map(renderMedicationAlarm)
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="medication" size={48} color="#E5E7EB" />
              <Text style={styles.emptyText}>등록된 약물이 없습니다</Text>
              <Text style={styles.emptySubtext}>+ 버튼을 눌러 약물을 추가해보세요</Text>
            </View>
          )}
        </View>

        {/* 질환 정보 섹션 */}
        <View style={styles.medicalSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>질환 정보</Text>
            <TouchableOpacity 
              onPress={() => isEditingDiseases ? saveDiseases() : setIsEditingDiseases(true)}
              style={[styles.actionButton, isEditingDiseases ? styles.saveButton : styles.editButton]}
            >
              <Ionicons 
                name={isEditingDiseases ? "checkmark" : "create-outline"} 
                size={20} 
                color={isEditingDiseases ? "#fff" : Colors.primary} 
              />
              <Text style={isEditingDiseases ? styles.saveButtonText : styles.editButtonText}>
                {isEditingDiseases ? "저장" : "수정"}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.healthInfoCard}>
            {isEditingDiseases ? (
              <View style={styles.chipEditContainer}>
                {AVAILABLE_DISEASES.map((disease, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => toggleDisease(disease)}
                    style={[
                      styles.chip,
                      diseases.includes(disease) && styles.chipSelected
                    ]}
                  >
                    <Text style={[
                      styles.chipText,
                      diseases.includes(disease) && styles.chipTextSelected
                    ]}>
                      {disease}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.healthInfoDisplay}>
                {diseases.length > 0 ? (
                  <View style={styles.chipContainer}>
                    {diseases.map((disease, index) => (
                      <View key={index} style={[styles.chip, styles.chipReadOnly]}>
                        <Text style={styles.chipReadOnlyText}>{disease}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.emptyHealthText}>등록된 질환이 없습니다</Text>
                )}
              </View>
            )}
          </View>
        </View>

        {/* 알레르기 정보 섹션 */}
        <View style={styles.medicalSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>알레르기 정보</Text>
            <TouchableOpacity 
              onPress={() => isEditingAllergies ? saveAllergies() : setIsEditingAllergies(true)}
              style={[styles.actionButton, isEditingAllergies ? styles.saveButton : styles.editButton]}
            >
              <Ionicons 
                name={isEditingAllergies ? "checkmark" : "create-outline"} 
                size={20} 
                color={isEditingAllergies ? "#fff" : Colors.primary} 
              />
              <Text style={isEditingAllergies ? styles.saveButtonText : styles.editButtonText}>
                {isEditingAllergies ? "저장" : "수정"}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.healthInfoCard}>
            {isEditingAllergies ? (
              <View style={styles.chipEditContainer}>
                {AVAILABLE_ALLERGIES.map((allergy, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => toggleAllergy(allergy)}
                    style={[
                      styles.chip,
                      allergies.includes(allergy) && styles.chipSelected
                    ]}
                  >
                    <Text style={[
                      styles.chipText,
                      allergies.includes(allergy) && styles.chipTextSelected
                    ]}>
                      {allergy}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.healthInfoDisplay}>
                {allergies.length > 0 ? (
                  <View style={styles.chipContainer}>
                    {allergies.map((allergy, index) => (
                      <View key={index} style={[styles.chip, styles.chipReadOnly]}>
                        <Text style={styles.chipReadOnlyText}>{allergy}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.emptyHealthText}>등록된 알레르기가 없습니다</Text>
                )}
              </View>
            )}
          </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  memberRelation: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4285F4',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  medicalSection: {
    marginBottom: 24,
  },
  alarmsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  addButton: {
    backgroundColor: Colors.primary,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 4,
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.danger,
    marginLeft: 4,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.mediumGray,
    marginLeft: 4,
  },
  deleteConfirmButton: {
    backgroundColor: Colors.danger,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteConfirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  alarmCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  checkboxIcon: {
    marginRight: 12,
  },
  alarmContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alarmIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  alarmInfo: {
    flex: 1,
  },
  alarmTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  alarmDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  alarmTime: {
    fontSize: 14,
    color: '#4285F4',
    fontWeight: '500',
    marginBottom: 2,
  },
  notesText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  rightSection: {
    alignItems: 'center',
  },
  switch: {
    marginBottom: 0,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 48,
  },
  editButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 4,
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 4,
  },
  healthInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  healthInfoDisplay: {
    minHeight: 60,
    justifyContent: 'center',
  },
  chipEditContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    minHeight: 36,
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  chipReadOnly: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  chipReadOnlyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
  },
  emptyHealthText: {
    fontSize: 14,
    color: Colors.mediumGray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});