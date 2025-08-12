import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Colors } from '@/constants/Colors';
import { defaultMarkedDates } from '@/constants/CalendarData';

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
  // const defaultMarkedDates = {
  //   "2025-08-05": { selected: true, selectedColor: Colors.primary },
  //   "2025-08-06": { marked: true, dotColor: Colors.danger },
  //   "2025-08-07": { marked: true, dotColor: Colors.secondary },
  //   "2025-08-08": { marked: true, dotColor: Colors.warning },
  // };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>복용 캘린더</Text>
        <Text style={styles.sectionSubtitle}>이번 달 복용 현황</Text>
      </View>
      <Calendar
        style={styles.calendar}
        markedDates={markedDates || defaultMarkedDates}
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
