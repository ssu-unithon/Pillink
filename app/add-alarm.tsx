import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import CustomSwitch from '@/components/CustomSwitch';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  getMedicationsByMemberId,
  MedicationInfo,
  addMedicationToMember,
  updateMedicationForMember
} from '@/constants/FamilyData';

export default function AddAlarmScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { medicationId, familyId } = params;

  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('daily'); // daily, weekly, as-needed
  const [time, setTime] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const isEditMode = !!medicationId;

  useEffect(() => {
    if (isEditMode && familyId) {
      const existingMedications = getMedicationsByMemberId(familyId as string);
      const existingMedication = existingMedications.find(med => med.id === medicationId);
      if (existingMedication) {
        setMedicationName(existingMedication.medicationName);
        setDosage(existingMedication.dosage);
        setFrequency(existingMedication.frequency);
        setTime(new Date(`2000-01-01T${existingMedication.time}:00`)); // Dummy date for time parsing
        setNotes(existingMedication.notes || '');
        setEnabled(existingMedication.enabled);
      }
    }
  }, [isEditMode, medicationId, familyId]);

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentDate);
  };

  const formatTimeDisplay = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const handleSave = () => {
    if (!medicationName.trim() || !dosage.trim()) {
      Alert.alert('필수 정보 누락', '약물 이름과 복용량을 입력해주세요.');
      return;
    }

    const newMedication: MedicationInfo = {
      id: isEditMode ? (medicationId as string) : Date.now().toString(),
      medicationName,
      dosage,
      frequency,
      time: formatTimeDisplay(time),
      notes,
      enabled,
      icon: 'pill', // Default icon
    };

    if (familyId) {
      if (isEditMode) {
        updateMedicationForMember(familyId as string, newMedication);
        Alert.alert('약물 수정 완료', '약물 정보가 성공적으로 수정되었습니다.');
      } else {
        addMedicationToMember(familyId as string, newMedication);
        Alert.alert('약물 추가 완료', '새로운 약물이 성공적으로 추가되었습니다.');
      }
      router.back();
    } else {
      Alert.alert('오류', '가족 ID를 찾을 수 없습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{isEditMode ? '약물 수정' : '약물 추가'}</Text>
          <View style={{ width: 40, height: 40 }} />
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <Text style={styles.label}>약물 이름</Text>
          <TextInput
            style={styles.input}
            placeholder="예: 타이레놀"
            placeholderTextColor={Colors.mediumGray}
            value={medicationName}
            onChangeText={setMedicationName}
          />

          <Text style={styles.label}>복용량</Text>
          <TextInput
            style={styles.input}
            placeholder="예: 500mg, 1정"
            placeholderTextColor={Colors.mediumGray}
            value={dosage}
            onChangeText={setDosage}
          />

          <Text style={styles.label}>복용 주기</Text>
          <View style={styles.frequencyContainer}>
            <TouchableOpacity
              style={[styles.frequencyButton, frequency === 'daily' && styles.frequencyButtonActive]}
              onPress={() => setFrequency('daily')}
            >
              <Text style={[styles.frequencyButtonText, frequency === 'daily' && styles.frequencyButtonTextActive]}>매일</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.frequencyButton, frequency === 'weekly' && styles.frequencyButtonActive]}
              onPress={() => setFrequency('weekly')}
            >
              <Text style={[styles.frequencyButtonText, frequency === 'weekly' && styles.frequencyButtonTextActive]}>주간</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.frequencyButton, frequency === 'as-needed' && styles.frequencyButtonActive]}
              onPress={() => setFrequency('as-needed')}
            >
              <Text style={[styles.frequencyButtonText, frequency === 'as-needed' && styles.frequencyButtonTextActive]}>필요시</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>복용 시간</Text>
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.timePickerButton}>
            <Text style={styles.timePickerButtonText}>{formatTimeDisplay(time)}</Text>
            <Ionicons name="time-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              testID="timePicker"
              value={time}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={handleTimeChange}
            />
          )}

          <Text style={styles.label}>메모 (선택 사항)</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="추가 정보나 주의사항을 입력하세요"
            placeholderTextColor={Colors.mediumGray}
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          <View style={styles.toggleRow}>
            <Text style={styles.label}>알림 활성화</Text>
            <CustomSwitch value={enabled} onValueChange={setEnabled} />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{isEditMode ? '약물 수정' : '약물 추가'}</Text>
      </TouchableOpacity>
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
    paddingBottom: 100,
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  formSection: {
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  frequencyButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  frequencyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  frequencyButtonTextActive: {
    color: '#fff',
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  timePickerButtonText: {
    fontSize: 16,
    color: Colors.text,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
