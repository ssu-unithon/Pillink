import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Colors } from '@/constants/Colors';
import { defaultMarkedDates } from '@/constants/CalendarData';
import IntakeLogService, { IntakeLogEntry } from '@/services/IntakeLogService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

// 한국어 로케일 설정
LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ],
  monthNamesShort: [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘'
};
LocaleConfig.defaultLocale = 'ko';

interface CalendarComponentProps {
  markedDates?: any;
  onDayPress?: (day: any) => void;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  markedDates,
  onDayPress
}) => {
  const [intakeLogMarkedDates, setIntakeLogMarkedDates] = useState<{ [key: string]: any }>({});
  const [isLoadingIntakeLogs, setIsLoadingIntakeLogs] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // 복용 기록 가져오기
  const fetchIntakeLogs = async () => {
    try {
      setIsLoadingIntakeLogs(true);
      
      // 선택된 가족 구성원 ID 가져오기
      const storedId = await AsyncStorage.getItem('selected_family_id');
      setSelectedMemberId(storedId);
      
      const targetId = storedId ? parseInt(storedId) : undefined;
      console.log('🔍 Fetching intake logs for member:', targetId);
      
      console.log('📅 Fetching intake logs for month:', currentMonth, 'year:', currentYear);
      
      const intakeLogs = await IntakeLogService.getIntakeLogs(targetId, currentMonth);
      
      // 현재 연도의 마킹 데이터 생성
      const calendarMarkedDates = IntakeLogService.generateCalendarMarkedDates(intakeLogs, currentYear);
      
      console.log('📅 Generated calendar marked dates:', calendarMarkedDates);
      setIntakeLogMarkedDates(calendarMarkedDates);
      
    } catch (error) {
      console.error('❌ Failed to fetch intake logs for calendar:', error);
      // 에러 발생 시 빈 객체로 설정
      setIntakeLogMarkedDates({});
    } finally {
      setIsLoadingIntakeLogs(false);
    }
  };

  // 화면 포커스될 때마다 복용 기록 새로고침
  useFocusEffect(
    React.useCallback(() => {
      console.log('🔄 Calendar component focused - fetching intake logs');
      fetchIntakeLogs();
    }, [])
  );

  // 월 변경 핸들러
  const handleMonthChange = (month: any) => {
    const newMonth = month.month;
    const newYear = month.year;
    
    console.log('📅 Calendar month changed to:', newMonth, newYear);
    
    if (newMonth !== currentMonth || newYear !== currentYear) {
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
      
      // 새로운 월의 복용 기록 가져오기
      fetchIntakeLogsForMonth(newMonth, newYear);
    }
  };

  // 특정 월의 복용 기록 가져오기
  const fetchIntakeLogsForMonth = async (month: number, year: number) => {
    try {
      setIsLoadingIntakeLogs(true);
      const storedId = await AsyncStorage.getItem('selected_family_id');
      const targetId = storedId ? parseInt(storedId) : undefined;
      
      console.log('📅 Fetching intake logs for month:', month, 'year:', year);
      
      const intakeLogs = await IntakeLogService.getIntakeLogs(targetId, month);
      const calendarMarkedDates = IntakeLogService.generateCalendarMarkedDates(intakeLogs, year);
      
      setIntakeLogMarkedDates(calendarMarkedDates);
    } catch (error) {
      console.error('❌ Failed to fetch intake logs for month:', error);
      setIntakeLogMarkedDates({});
    } finally {
      setIsLoadingIntakeLogs(false);
    }
  };

  // 기본 마킹과 복용 기록 마킹을 합치기
  const combinedMarkedDates = {
    ...defaultMarkedDates,
    ...intakeLogMarkedDates,
    ...markedDates // props로 전달된 마킹이 최우선
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>복용 캘린더</Text>
        <Text style={styles.sectionSubtitle}>이번 달 복용 현황</Text>
      </View>
      <Calendar
        style={styles.calendar}
        markedDates={combinedMarkedDates}
        theme={{
          todayTextColor: Colors.primary,
          arrowColor: Colors.primary,
          selectedDayBackgroundColor: Colors.primary,
          selectedDayTextColor: Colors.background,
          monthTextColor: Colors.text,
          textDayFontWeight: '500',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '600',
        }}
        firstDay={1}
        monthFormat={'yyyy년 M월'}
        onDayPress={onDayPress}
        onMonthChange={handleMonthChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.mediumGray,
    fontWeight: '400',
  },
  calendar: {
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
});

export default CalendarComponent;
