import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
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

export default function FamilyAlarmScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const familyMember = getFamilyMemberById(id as string);
  const [alarms, setAlarms] = useState<MedicationInfo[]>(
    getMedicationsByMemberId(id as string)
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

  const renderMedicationAlarm = (alarm: MedicationInfo) => (
    <TouchableOpacity
      key={alarm.id}
      style={styles.alarmCard}
      onPress={() => router.push(`/family/${id}/medication`)}
      activeOpacity={0.7}
    >
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
          <Text style={styles.title}>복용 알림 설정</Text>
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
            <Text style={styles.memberRelation}>{familyMember.relation} • 복용 알림</Text>
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
          <Text style={styles.sectionTitle}>복용 중인 약물</Text>
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
  alarmsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
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
  },
  alarmContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
});
