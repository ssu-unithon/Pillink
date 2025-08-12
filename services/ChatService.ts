import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ChatMessage {
  id: number;
  content: string;
  sender_type: 'user' | 'ai';
  createdAt: string;
}

export interface DrugInteractionAnalysis {
  collisionCount: number;
  collisions: string[];
  count: number;
  duplicateCount: number;
  duplicates: string[];
  errors: string[];
  pairCount: number;
  riskRate: number;
  warnings: {
    ingredient: string;
    reason: string;
    type: string;
  }[];
}

const BASE_URL = 'https://pillink-backend-production.up.railway.app';

class ChatService {
  private async getAuthHeaders() {
    const token = await AsyncStorage.getItem('access_token');
    if (!token) {
      console.warn('🔐 No access token found in AsyncStorage');
      throw new Error('로그인이 필요합니다. 설정에서 로그인해주세요.');
    }
    
    console.log('🔐 Access token found:', token.substring(0, 20) + '...', 'length:', token.length);
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    console.log('🔐 Generated headers:', {
      'Authorization': `Bearer ${token.substring(0, 20)}...`,
      'Content-Type': headers['Content-Type']
    });
    
    return headers;
  }

  // 채팅 기록 조회 - GET /chat/history
  async getChatHistory(): Promise<ChatMessage[]> {
    try {
      console.log('🔄 Fetching chat history...');
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${BASE_URL}/chat/histroy`, { // API에서 오타 그대로 사용
        headers
      });
      
      console.log('📡 Chat history response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Chat history API error:', response.status, errorText);
        throw new Error(`채팅 기록 조회 실패 (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Chat history loaded:', data.length, 'messages');
      return data;
    } catch (error: any) {
      console.error('❌ Failed to fetch chat history:', error);
      if (error.name === 'TypeError' && error.message.includes('Network request failed')) {
        throw new Error('네트워크 연결을 확인해주세요.');
      }
      throw error;
    }
  }

  // 채팅 AI 전송 - POST /chat
  async sendMessage(content: string): Promise<ChatMessage> {
    try {
      // 입력 검증
      if (!content || content.trim().length === 0) {
        throw new Error('메시지 내용이 비어있습니다.');
      }
      
      const trimmedContent = content.trim();
      console.log('🔄 Sending message to chat API:', { 
        content: trimmedContent,
        length: trimmedContent.length,
        type: typeof trimmedContent
      });
      
      const headers = await this.getAuthHeaders();
      
      // 요청 바디 확인 (정제된 내용 사용)
      const requestBody = JSON.stringify({ content: trimmedContent });
      console.log('📤 Request body:', requestBody);
      console.log('📤 Request headers:', headers);
      
      const response = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers,
        body: requestBody
      });
      
      console.log('📡 Chat API response status:', response.status);
      console.log('📡 Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Chat API error:', response.status, '–', errorText);
        
        // 400 에러의 경우 더 자세한 처리
        if (response.status === 400) {
          console.error('🔍 Bad Request - 요청 형식 확인 필요');
          console.error('🔍 Request URL:', `${BASE_URL}/chat`);
          console.error('🔍 Request Body:', requestBody);
          console.error('🔍 Request Headers:', JSON.stringify(headers, null, 2));
        }
        
        throw new Error(`메시지 전송 실패 (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Chat API response received:', data);
      return data;
    } catch (error: any) {
      console.error('❌ Failed to send message:', error);
      if (error.name === 'TypeError' && error.message.includes('Network request failed')) {
        throw new Error('네트워크 연결을 확인해주세요.');
      }
      throw error;
    }
  }

  // 약물 상호작용 분석 - GET /chat/risk
  async getDrugInteractionAnalysis(targetId?: number): Promise<DrugInteractionAnalysis> {
    try {
      const headers = await this.getAuthHeaders();
      const url = targetId 
        ? `${BASE_URL}/chat/risk?targetId=${targetId}`
        : `${BASE_URL}/chat/risk`;
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error('약물 상호작용 분석 API 호출 실패');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch drug interaction analysis:', error);
      throw error;
    }
  }

  // 메시지 시간 포맷팅 유틸리티
  formatMessageTime(createdAt: string): string {
    const date = new Date(createdAt);
    const now = new Date();
    
    // 오늘인지 확인
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
  }

  // 위험도 레벨 계산
  getRiskLevel(riskRate: number): { level: string; color: string; text: string } {
    if (riskRate >= 70) {
      return { level: 'high', color: '#EF4444', text: '위험' };
    } else if (riskRate >= 40) {
      return { level: 'medium', color: '#F59E0B', text: '주의' };
    } else {
      return { level: 'low', color: '#10B981', text: '안전' };
    }
  }
}

export default new ChatService();