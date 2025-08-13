import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FamilyUser {
  id: number;
  name: string;
  phone: string;
  password: string;
  provider: string;
  role: string;
  family?: any;
  owned_pills?: any[];
}

export interface FamilyGroup {
  id: number;
  name: string;
  users: FamilyUser[];
  manager: FamilyUser;
}

const BASE_URL = 'https://pillink-backend-production.up.railway.app';

class FamilyService {
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

  // 그룹 조회 - GET /family
  async getFamily(): Promise<FamilyGroup> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${BASE_URL}/family`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error('가족 그룹 조회 API 호출 실패');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch family:', error);
      throw error;
    }
  }

  // 그룹 초대 - GET /family/invite?targetPhone=
  async inviteToFamily(targetPhone: string): Promise<FamilyGroup> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${BASE_URL}/family/invite?targetPhone=${encodeURIComponent(targetPhone)}`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error('가족 초대 API 호출 실패');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to invite family member:', error);
      throw error;
    }
  }

  // 그룹 탈퇴 - GET /family/leave
  async leaveFamily(): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${BASE_URL}/family/leave`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error('가족 탈퇴 API 호출 실패');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to leave family:', error);
      throw error;
    }
  }

  // 그룹 생성 - POST /family
  async createFamily(name: string): Promise<FamilyGroup> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${BASE_URL}/family`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name })
      });
      
      if (!response.ok) {
        throw new Error('가족 생성 API 호출 실패');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to create family:', error);
      throw error;
    }
  }
}

export default new FamilyService();