import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import BottomNavigationBar from '../../components/BottomNavigationBar';
import CustomSwitch from '@/components/CustomSwitch';
import { FamilyAvatar } from '@/components/FamilyGroup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlarmService from '@/services/AlarmService';
import {
  getFamilyMemberById,
  getMedicationsByMemberId,
  getDiseasesByMemberId,
  getAllergiesByMemberId,
  updateMemberDiseases,
  updateMemberAllergies,
  updateMedicationInfo,
  AVAILABLE_DISEASES,
  AVAILABLE_ALLERGIES,
  MedicationInfo
} from '@/constants/FamilyData';

export default function FamilyAlarmScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const familyMember = getFamilyMemberById(id as string);
  const [alarms, setAlarms] = useState<MedicationInfo[]>([]);
  const [isEditingDiseases, setIsEditingDiseases] = useState(false);
  const [isEditingAllergies, setIsEditingAllergies] = useState(false);
  const [diseases, setDiseases] = useState<string[]>(
    getDiseasesByMemberId(id as string)
  );
  const [allergies, setAllergies] = useState<string[]>(
    getAllergiesByMemberId(id as string)
  );

  // API에서 데이터 가져오기
  const fetchMedicationData = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) return;

      // 병렬로 약물과 알림 데이터 가져오기
      const [pillResponse, alarmResponse] = await Promise.all([
        fetch(`https://pillink-backend-production.up.railway.app/pill?targetId=${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        AlarmService.getAlarms(parseInt(id as string))
      ]);

      if (pillResponse.ok) {
        const pillData = await pillResponse.json();
        const alarmData = alarmResponse;
        
        // 약물과 알림 데이터를 합쳐서 MedicationInfo 형식으로 변환
        const medicationList: MedicationInfo[] = pillData.map((pill: any) => {
          // 해당 약물에 대응하는 알림 찾기 (약물 이름으로 매칭)
          const relatedAlarm = alarmData.find((alarm: any) => alarm.name === pill.name);
          
          return {
            id: pill.id.toString(),
            medicationName: pill.name,
            time: relatedAlarm ? AlarmService.formatTime(relatedAlarm.hour, relatedAlarm.minute) : '08:00',
            dosage: `${pill.count}정`,
            enabled: pill.is_pined,
            frequency: 'daily' as const,
            notes: '',
            icon: 'medication',
            itemSeq: pill.itemSeq,
            itemImage: null
          };
        });
        
        setAlarms(medicationList);
      }
    } catch (error) {
      console.error('Failed to fetch medications and alarms:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // 페이지가 포커스될 때마다 데이터 업데이트
      console.log('Refreshing medication data for familyId:', id);
      fetchMedicationData();
      setDiseases(getDiseasesByMemberId(id as string));
      setAllergies(getAllergiesByMemberId(id as string));
    }, [id])
  );

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

  const toggleAlarm = async (alarmId: string) => {
    const alarm = alarms.find(a => a.id === alarmId);
    if (!alarm) return;

    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        Alert.alert('인증 오류', '로그인이 필요합니다.');
        return;
      }

      // API를 통해 pill 상태 업데이트 (is_pined toggle)
      const response = await fetch('https://pillink-backend-production.up.railway.app/pill', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pillId: parseInt(alarmId),
          is_pined: !alarm.enabled
        })
      });

      if (response.ok) {
        // 로컬 상태 업데이트
        setAlarms(prev =>
          prev.map(item =>
            item.id === alarmId
              ? { ...item, enabled: !item.enabled }
              : item
          )
        );
      } else {
        throw new Error('약물 상태 업데이트 실패');
      }
    } catch (error) {
      console.error('Failed to toggle alarm:', error);
      Alert.alert('오류', '약물 정보 업데이트에 실패했습니다.');
    }
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return '매일';
      case 'weekly': return '주간';
      case 'as-needed': return '필요시';
      default: return '매일';
    }
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
    const success = updateMemberDiseases(id as string, diseases);
    if (success) {
      setIsEditingDiseases(false);
      // 알림 제거
    } else {
      Alert.alert('저장 실패', '질환 정보 저장 중 오류가 발생했습니다.');
    }
  };

  const saveAllergies = () => {
    const success = updateMemberAllergies(id as string, allergies);
    if (success) {
      setIsEditingAllergies(false);
      // 알림 제거
    } else {
      Alert.alert('저장 실패', '알레르기 정보 저장 중 오류가 발생했습니다.');
    }
  };

  const renderMedicationAlarm = (alarm: MedicationInfo) => (
    <TouchableOpacity
      key={alarm.id}
      style={styles.alarmCard}
      onPress={() => router.push(`/add-alarm?medicationId=${alarm.id}&familyId=${id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.alarmContent}>
        <View style={styles.medicationImageContainer}>
          {alarm.itemImage ? (
            <Image
              source={{ uri: alarm.itemImage }}
              style={[styles.medicationImage, { opacity: alarm.enabled ? 1 : 0.5 }]}
              resizeMode="contain"
              onError={() => console.log('약물 이미지 로드 실패:', alarm.itemImage)}
            />
          ) : (
            <View style={[styles.medicationImagePlaceholder, { opacity: alarm.enabled ? 1 : 0.5 }]}>
              <MaterialIcons
                name="medical-services"
                size={24}
                color={alarm.enabled ? Colors.primary : '#9CA3AF'}
              />
            </View>
          )}
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
          <CustomSwitch
            value={alarm.enabled}
            onValueChange={() => toggleAlarm(alarm.id)}
          />
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
          </View>
          {alarms.length > 0 ? (
            alarms.map(renderMedicationAlarm)
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="medication" size={48} color="#E5E7EB" />
              <Text style={styles.emptyText}>등록된 약물이 없습니다</Text>
              <Text style={styles.emptySubtext}>약물 직접 입력에서 약물을 추가해보세요</Text>
            </View>
          )}
        </View>

        {/* 질환 정보 섹션 */}
        <View style={styles.medicalSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>질환 정보</Text>
            <TouchableOpacity 
              onPress={() => isEditingDiseases ? saveDiseases() : setIsEditingDiseases(true)}
              style={styles.actionButton}
              activeOpacity={0.6}
            >
              <Ionicons 
                name={isEditingDiseases ? "checkmark" : "pencil"} 
                size={16} 
                color={Colors.primary} 
              />
              <Text style={styles.editButtonText}>
                {isEditingDiseases ? "완료" : "수정"}
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
              style={styles.actionButton}
              activeOpacity={0.6}
            >
              <Ionicons 
                name={isEditingAllergies ? "checkmark" : "pencil"} 
                size={16} 
                color={Colors.primary} 
              />
              <Text style={styles.editButtonText}>
                {isEditingAllergies ? "완료" : "수정"}
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
  alarmContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    overflow: 'hidden',
  },
  medicationImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#AABFE7',
  },
  medicationImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#AABFE7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 60,
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: 'transparent',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 4,
  },
  saveButton: {
    backgroundColor: 'transparent',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
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