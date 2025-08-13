import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  provider: string;
  diseases?: string[];
}

const BASE_URL = 'https://pillink-backend-production.up.railway.app';

class UserService {
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

  // JWT 토큰에서 사용자 정보 추출 (클라이언트 측)
  decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }

  // 현재 로그인한 사용자 정보 가져오기 (API 호출)
  async getCurrentUser(): Promise<UserInfo | null> {
    try {
      const headers = await this.getAuthHeaders();
      
      console.log('🔍 Fetching current user info from API...');
      const response = await fetch(`${BASE_URL}/auth/me`, {
        headers
      });
      
      console.log('📡 User info response status:', response.status);
      
      if (!response.ok) {
        // API 실패 시 토큰에서 정보 추출하여 fallback
        console.warn('API failed, falling back to token decode');
        return this.getCurrentUserFromToken();
      }
      
      const userInfo = await response.json();
      console.log('✅ User info from API:', userInfo);
      
      return {
        id: userInfo.id,
        name: userInfo.name || 'Unknown User',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        role: userInfo.role || 'user',
        provider: userInfo.provider || 'local'
      };
    } catch (error) {
      console.error('❌ Failed to get current user from API:', error);
      // 에러 발생 시 토큰에서 정보 추출
      return this.getCurrentUserFromToken();
    }
  }

  // JWT 토큰에서 사용자 정보 추출 (fallback)
  private async getCurrentUserFromToken(): Promise<UserInfo | null> {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        return null;
      }

      // JWT 토큰에서 사용자 정보 추출
      const decoded = this.decodeToken(token);
      if (decoded) {
        return {
          id: decoded.id,
          name: decoded.name || decoded.username || 'Unknown User',
          email: decoded.email,
          phone: decoded.phone || '',
          role: decoded.role || 'user',
          provider: decoded.provider || 'local'
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to get user from token:', error);
      return null;
    }
  }

  // 사용자 정보 캐싱을 위한 함수
  async getCachedUserInfo(): Promise<UserInfo | null> {
    try {
      const cached = await AsyncStorage.getItem('user_info');
      if (cached) {
        return JSON.parse(cached);
      }
      
      // 캐시가 없으면 새로 가져오기
      const userInfo = await this.getCurrentUser();
      if (userInfo) {
        await AsyncStorage.setItem('user_info', JSON.stringify(userInfo));
      }
      
      return userInfo;
    } catch (error) {
      console.error('Failed to get cached user info:', error);
      return null;
    }
  }

  // 사용자 정보 캐시 삭제 (로그아웃 시)
  async clearUserCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem('user_info');
    } catch (error) {
      console.error('Failed to clear user cache:', error);
    }
  }
}

export default new UserService();