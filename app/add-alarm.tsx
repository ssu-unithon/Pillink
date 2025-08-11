import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomSwitch from '../components/CustomSwitch';
import { useFamilyData } from '../contexts/FamilyDataContext';

export default function AddAlarmScreen() {
  const [medicine, setMedicine] = useState('');
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [repeat, setRepeat] = useState('안 함');
  const [sound, setSound] = useState('종소리');
  const [snooze, setSnooze] = useState(true);
  const router = useRouter();
  const { updateMedicationEnabled } = useFamilyData();

  const onChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) setTime(selectedDate);
  };

  const handleSave = () => {
    // 예시: 본인 id '1', 실제 앱에서는 로그인/선택된 사용자 id 사용
    updateMedicationEnabled('1', medicine, snooze);
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <MaterialCommunityIcons name="chevron-left" size={32} color="#1877F2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>알림 추가</Text>
        <View style={{ width: 32 }} />
      </View>
      {/* 약 이름 입력 */}
      <Text style={styles.label}>약 이름</Text>
      <TextInput
        style={styles.input}
        placeholder="약 이름을 입력하세요"
        value={medicine}
        onChangeText={setMedicine}
      />
      {/* 알림 시간 설정 */}
      <Text style={styles.label}>알림 시간</Text>
      <TouchableOpacity style={styles.timeInput} onPress={() => setShowPicker(true)}>
        <MaterialCommunityIcons name="clock-outline" size={24} color="#1877F2" />
        <Text style={styles.timeText}>{time.getHours().toString().padStart(2, '0')}:{time.getMinutes().toString().padStart(2, '0')}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={onChange}
        />
      )}
      {/* group 974 스타일의 알림 옵션 */}
      <View style={styles.optionGroupBoxImproved}>
        <View style={styles.optionRowImproved}>
          <Text style={styles.optionLabelImproved}>반복</Text>
          <Text style={styles.optionValueDisabledImproved}>{repeat}</Text>
        </View>
        <View style={styles.dividerImproved} />
        <View style={styles.optionRowImproved}>
          <Text style={styles.optionLabelImproved}>사운드</Text>
          <Text style={styles.optionValueImproved}>{sound}</Text>
        </View>
        <View style={styles.dividerImproved} />
        <View style={styles.optionRowImproved}>
          <Text style={styles.optionLabelImproved}>다시 알림</Text>
          <CustomSwitch
            value={snooze}
            onValueChange={setSnooze}
          />
        </View>
      </View>
      {/* 저장 버튼 */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>저장</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1877F2',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#F7F7F7',
    marginBottom: 8,
  },
  timeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#F7F7F7',
    marginBottom: 8,
    width: 140,
  },
  timeText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#1877F2',
    fontWeight: '600',
  },
  optionGroupBoxImproved: {
    marginTop: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  optionRowImproved: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
  },
  optionLabelImproved: {
    fontSize: 16,
    color: '#222',
    fontWeight: '400',
  },
  optionValueImproved: {
    fontSize: 16,
    color: '#1877F2',
    fontWeight: '500',
  },
  optionValueDisabledImproved: {
    fontSize: 16,
    color: '#B0B0B0',
    fontWeight: '400',
  },
  dividerImproved: {
    height: 1,
    backgroundColor: '#F0F1F3',
    marginLeft: 18,
    marginRight: 18,
  },
  saveButton: {
    marginTop: 32,
    backgroundColor: '#1877F2',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
