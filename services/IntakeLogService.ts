import AsyncStorage from '@react-native-async-storage/async-storage';

export interface IntakeLogEntry {
  id: number;
  month: number;
  date: number;
  alarmId: number;
  createdAt: string;
  updatedAt: string;
}

export interface IntakeLogRequest {
  month: number;
  date: number;
  alarmId: number;
}

const BASE_URL = 'https://pillink-backend-production.up.railway.app';

class IntakeLogService {
  private async getAuthHeaders() {
    const token = await AsyncStorage.getItem('access_token');
    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // GET /intake-log - 복용 기록 조회
  async getIntakeLogs(targetId?: number, month?: number): Promise<IntakeLogEntry[]> {
    try {
      console.log('🔍 Fetching intake logs for targetId:', targetId, 'month:', month);
      const headers = await this.getAuthHeaders();
      
      // 기본값으로 현재 월 사용
      const currentMonth = month || new Date().getMonth() + 1;
      
      // URL 파라미터 구성
      const params = new URLSearchParams();
      params.append('month', currentMonth.toString());
      if (targetId) {
        params.append('targetId', targetId.toString());
      }
      
      const url = `${BASE_URL}/intake-log?${params.toString()}`;
      console.log('📡 Request URL:', url);
      
      const response = await fetch(url, { headers });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`복용 기록 조회 실패 (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Intake logs response:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch intake logs:', error);
      throw error;
    }
  }

  // POST /intake-log/check - 복용 기록 체크
  async checkIntakeLog(request: IntakeLogRequest): Promise<IntakeLogEntry> {
    try {
      console.log('📝 Checking intake log:', request);
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${BASE_URL}/intake-log/check`, {
        method: 'POST',
        headers,
        body: JSON.stringify(request)
      });
      
      console.log('📡 Check response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Check API Error Response:', errorText);
        throw new Error(`복용 기록 체크 실패 (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Check intake log response:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to check intake log:', error);
      throw error;
    }
  }

  // 캘린더 마킹 데이터 생성 함수
  generateCalendarMarkedDates(intakeLogs: IntakeLogEntry[], year: number): { [key: string]: any } {
    const markedDates: { [key: string]: any } = {};
    const dateCountMap: { [key: string]: number } = {};
    
    // 각 날짜별 복용 횟수 계산
    intakeLogs.forEach(log => {
      const dateString = `${year}-${log.month.toString().padStart(2, '0')}-${log.date.toString().padStart(2, '0')}`;
      dateCountMap[dateString] = (dateCountMap[dateString] || 0) + 1;
    });
    
    // 복용 횟수에 따라 마킹 색상 결정
    Object.entries(dateCountMap).forEach(([dateString, count]) => {
      if (count === 1) {
        // 단일 약물 복용: 초록색
        markedDates[dateString] = {
          marked: true,
          dotColor: '#10B981'
        };
      } else if (count > 1) {
        // 다중 약물 복용: 파란색
        markedDates[dateString] = {
          marked: true,
          dotColor: '#4F8EF7'
        };
      }
    });
    
    return markedDates;
  }

  // 특정 월의 복용 기록만 필터링
  filterLogsByMonth(intakeLogs: IntakeLogEntry[], month: number): IntakeLogEntry[] {
    return intakeLogs.filter(log => log.month === month);
  }

  // 오늘 날짜의 복용 기록 확인
  getTodayIntakeLogs(intakeLogs: IntakeLogEntry[]): IntakeLogEntry[] {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDate = today.getDate();
    
    return intakeLogs.filter(log => 
      log.month === currentMonth && log.date === currentDate
    );
  }
}

export default new IntakeLogService();