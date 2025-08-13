import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AlarmData {
  id: number;
  hour: number;
  minute: number;
  is_enabled: boolean;
  name?: string;
  count?: number;
}

export interface CreateAlarmRequest {
  targetId: number;
  hour: number;
  minute: number;
  is_enabled: boolean;
  name: string;
  count: number;
  itemSeq?: string;
  image_url?: string;
}

export interface UpdateAlarmRequest {
  alarmId: number;
  hour: number;
  minute: number;
}

const BASE_URL = 'https://pillink-backend-production.up.railway.app';

class AlarmService {
  private async getAuthHeaders() {
    const token = await AsyncStorage.getItem('access_token');
    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // 알림 조회 - GET /alarm
  async getAlarms(targetId?: number): Promise<AlarmData[]> {
    try {
      const headers = await this.getAuthHeaders();
      const url = targetId 
        ? `${BASE_URL}/alarm?targetId=${targetId}`
        : `${BASE_URL}/alarm`;
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error('알림 조회 API 호출 실패');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch alarms:', error);
      throw error;
    }
  }

  // 알림 생성 - POST /alarm
  async createAlarm(request: CreateAlarmRequest): Promise<AlarmData> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${BASE_URL}/alarm`, {
        method: 'POST',
        headers,
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        throw new Error('알림 생성 API 호출 실패');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to create alarm:', error);
      throw error;
    }
  }

  // 알림 수정 - PATCH /alarm
  async updateAlarm(request: UpdateAlarmRequest): Promise<AlarmData> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${BASE_URL}/alarm`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        throw new Error('알림 수정 API 호출 실패');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to update alarm:', error);
      throw error;
    }
  }

  // 시간을 hour, minute으로 분리하는 유틸리티 함수
  parseTime(timeString: string): { hour: number; minute: number } {
    const [hourStr, minuteStr] = timeString.split(':');
    return {
      hour: parseInt(hourStr, 10),
      minute: parseInt(minuteStr, 10)
    };
  }

  // hour, minute을 시간 문자열로 변환하는 유틸리티 함수
  formatTime(hour: number, minute: number): string {
    const hourStr = hour.toString().padStart(2, '0');
    const minuteStr = minute.toString().padStart(2, '0');
    return `${hourStr}:${minuteStr}`;
  }
}

export default new AlarmService();