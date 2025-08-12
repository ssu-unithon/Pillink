import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import CustomSwitch from '@/components/CustomSwitch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlarmService from '@/services/AlarmService';

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

  // API에서 기존 약물 정보 가져오기
  const fetchExistingMedication = async () => {
    if (!isEditMode || !familyId || !medicationId) return;
    
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) return;
      
      // 약물 및 알림 정보 가져오기
      const [pillResponse, alarmData] = await Promise.all([
        fetch(`https://pillink-backend-production.up.railway.app/pill?targetId=${familyId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        AlarmService.getAlarms(parseInt(familyId as string))
      ]);
      
      if (pillResponse.ok) {
        const pillData = await pillResponse.json();
        const existingPill = pillData.find((pill: any) => pill.id.toString() === medicationId);
        
        if (existingPill) {
          setMedicationName(existingPill.name);
          setCount(existingPill.count.toString());
          setEnabled(existingPill.is_pined);
          
          // 알림 시간 설정
          const relatedAlarm = alarmData.find((alarm: any) => alarm.name === existingPill.name);
          if (relatedAlarm) {
            setSelectedTime(AlarmService.formatTime(relatedAlarm.hour, relatedAlarm.minute));
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch existing medication:', error);
    }
  };
  
  useEffect(() => {
    fetchExistingMedication();
  }, [isEditMode, medicationId, familyId]);


  const handleDelete = async () => {
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
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('access_token');
              if (!token) {
                Alert.alert('인증 오류', '로그인이 필요합니다.');
                return;
              }

              // API를 통한 약물 삭제
              const pillResponse = await fetch(`https://pillink-backend-production.up.railway.app/pill/${medicationId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });

              if (pillResponse.ok) {
                // 관련 알림도 삭제 (알림 ID를 아는 경우)
                try {
                  const alarmData = await AlarmService.getAlarms(parseInt(familyId as string));
                  const relatedAlarm = alarmData.find((alarm: any) => alarm.name === medicationName);
                  if (relatedAlarm) {
                    // 알림 삭제 API가 있다면 여기서 호출
                    console.log('관련 알림 삭제 필요:', relatedAlarm.id);
                  }
                } catch (alarmError) {
                  console.warn('알림 삭제 실패:', alarmError);
                }
                
                Alert.alert('삭제 완료', '약물이 성공적으로 삭제되었습니다.', [
                  {
                    text: '확인',
                    onPress: () => router.back()
                  }
                ]);
              } else {
                throw new Error('약물 삭제 API 호출 실패');
              }
            } catch (error) {
              console.error('Failed to delete medication:', error);
              Alert.alert('오류', '약물 삭제에 실패했습니다.');
            }
          }
        }
      ]
    );
  };

  const handleSave = async () => {
    console.log('🚀 handleSave 함수 시작');
    console.log('📋 Current state:', { 
      medicationName, 
      count, 
      selectedTime, 
      familyId, 
      medicationId, 
      isEditMode,
      enabled 
    });

    console.log('🔍 필수 정보 검증:', {
      'medicationName.trim()': medicationName?.trim(),
      'count.trim()': count?.trim(),
      'medicationName 길이': medicationName?.trim()?.length,
      'count 길이': count?.trim()?.length
    });

    if (!medicationName.trim() || !count.trim()) {
      console.log('❌ 필수 정보 누락 - 상세:', {
        medicationName: medicationName,
        count: count,
        medicationNameTrimmed: medicationName?.trim(),
        countTrimmed: count?.trim()
      });
      Alert.alert('필수 정보 누락', '약물 이름과 복용량을 입력해주세요.');
      return;
    }

    if (!familyId) {
      console.log('❌ 가족 ID 없음');
      Alert.alert('오류', '가족 ID를 찾을 수 없습니다.');
      return;
    }

    try {
      console.log('🔐 토큰 확인 중...');
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        console.log('❌ 토큰 없음');
        Alert.alert('인증 오류', '로그인이 필요합니다.');
        return;
      }
      console.log('✅ 토큰 확인됨');

      if (isEditMode) {
        console.log('✏️ 수정 모드 - API 요청 시작');
        // 약물 수정 - PATCH API 호출
        const requestBody = {
          pillId: parseInt(medicationId as string),
          count: parseInt(count),
          is_pined: enabled
        };
        console.log('📤 약물 수정 요청:', requestBody);

        const response = await fetch('https://pillink-backend-production.up.railway.app/pill', {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        console.log('📡 약물 수정 응답 상태:', response.status);

        if (response.ok) {
          console.log('✅ 약물 수정 성공');
          // 알림 시간 업데이트 - 실제 알림 ID 찾기
          const { hour, minute } = AlarmService.parseTime(selectedTime);
          
          try {
            // 해당 가족 구성원의 알림 목록 가져와서 매칭되는 알림 ID 찾기
            const alarmData = await AlarmService.getAlarms(parseInt(familyId as string));
            const relatedAlarm = alarmData.find((alarm: any) => alarm.name === medicationName);
            
            if (relatedAlarm) {
              console.log('Found related alarm for update:', relatedAlarm.id);
              await AlarmService.updateAlarm({
                alarmId: relatedAlarm.id,
                hour,
                minute
              });
              console.log('✅ Alarm time updated successfully');
            } else {
              console.warn('⚠️ No related alarm found for medication:', medicationName);
            }
          } catch (alarmError) {
            console.warn('❌ 알림 업데이트 실패:', alarmError);
            // 약물 업데이트는 성공했으므로 경고만 표시
          }
          
          Alert.alert('약물 수정 완료', '약물 정보가 성공적으로 수정되었습니다.');
        } else {
          const errorText = await response.text();
          console.log('❌ 약물 수정 실패:', response.status, errorText);
          throw new Error(`약물 수정 API 호출 실패: ${response.status} ${errorText}`);
        }
      } else {
        console.log('➕ 추가 모드 - 약물 직접 입력 화면으로 안내');
        // 약물 추가 - POST API 호출 (이 경우는 medication-input에서 처리되므로 기본적으로 비활성화)
        Alert.alert('안내', '약물 추가는 약물 직접 입력 화면에서 진행해주세요.');
        router.back();
        return;
      }
      
      console.log('🔙 화면 돌아가기');
      router.back();
    } catch (error) {
      console.error('❌ 약물 저장 중 오류 발생:', error);
      Alert.alert('오류', '약물 저장 중 오류가 발생했습니다.');
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
