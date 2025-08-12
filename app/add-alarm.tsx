import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import CustomSwitch from '@/components/CustomSwitch';
import {
  getMedicationsByMemberId,
  MedicationInfo,
  addMedicationToMember,
  updateMedicationInfo,
  removeMedicationFromMember
} from '@/constants/FamilyData';

export default function AddAlarmScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { medicationId, familyId } = params;

  const [medicationName, setMedicationName] = useState('');
  const [count, setCount] = useState('1');
  const [selectedTime, setSelectedTime] = useState('08:00');
  const [notes, setNotes] = useState('');
  const [enabled, setEnabled] = useState(true);

  const isEditMode = !!medicationId;

  useEffect(() => {
    if (isEditMode && familyId) {
      const existingMedications = getMedicationsByMemberId(familyId as string);
      const existingMedication = existingMedications.find(med => med.id === medicationId);
      if (existingMedication) {
        setMedicationName(existingMedication.medicationName);
        setCount(existingMedication.dosage?.replace('정', '') || '1');
        setSelectedTime(existingMedication.time);
        setNotes(existingMedication.notes || '');
        setEnabled(existingMedication.enabled);
      }
    }
  }, [isEditMode, medicationId, familyId]);


  const handleDelete = () => {
    if (!isEditMode) {
      console.log('Not in edit mode, cannot delete');
      return;
    }

    console.log('Attempting to delete medication:', { familyId, medicationId });

    Alert.alert(
      '약물 삭제',
      '이 약물을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          style: 'destructive',
          onPress: () => {
            console.log('Confirmed deletion, calling removeMedicationFromMember with:', { familyId, medicationId });
            const success = removeMedicationFromMember(familyId as string, medicationId as string);
            console.log('Deletion result:', success);
            
            if (success) {
              Alert.alert('삭제 완료', '약물이 성공적으로 삭제되었습니다.', [
                {
                  text: '확인',
                  onPress: () => router.back()
                }
              ]);
            } else {
              Alert.alert('오류', '약물 삭제에 실패했습니다.');
            }
          }
        }
      ]
    );
  };

  const handleSave = () => {
    if (!medicationName.trim() || !count.trim()) {
      Alert.alert('필수 정보 누락', '약물 이름과 복용량을 입력해주세요.');
      return;
    }

    if (familyId) {
      if (isEditMode) {
        const success = updateMedicationInfo(familyId as string, medicationId as string, {
          medicationName,
          dosage: `${count}정`,
          time: selectedTime,
          notes,
          enabled
        });
        if (success) {
          Alert.alert('약물 수정 완료', '약물 정보가 성공적으로 수정되었습니다.');
        } else {
          Alert.alert('오류', '약물 수정에 실패했습니다.');
        }
      } else {
        const medicationData = {
          id: Date.now().toString(),
          name: medicationName,
          type: '일반의약품',
          company: '',
          dosage: `${count}정`,
          time: selectedTime,
          notes
        };
        const success = addMedicationToMember(familyId as string, medicationData);
        if (success) {
          Alert.alert('약물 추가 완료', '새로운 약물이 성공적으로 추가되었습니다.');
        } else {
          Alert.alert('오류', '약물 추가에 실패했습니다.');
        }
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

          <Text style={styles.label}>복용 시간</Text>
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

      <View style={styles.bottomButtons}>
        {isEditMode && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>약물 삭제</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.saveButton, isEditMode && styles.saveButtonHalf]} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{isEditMode ? '약물 수정' : '약물 추가'}</Text>
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
  countInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 16,
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
  timeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  timeOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  bottomButtons: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 24,
    gap: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  saveButtonHalf: {
    flex: 1,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: Colors.danger,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  deleteButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
