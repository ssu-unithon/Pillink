// 약물 상호작용 관련 상수들
export interface InteractionData {
  riskScore: number;
  duplicateCount: number;
  dangerousCount: number;
  safeCount: number;
  totalInteractions: number;
}

// 기본 상호작용 데이터
export const INTERACTION_DATA: InteractionData = {
  riskScore: 75, // 위험도 점수 (0-100)
  duplicateCount: 2, // 중복 약물 개수
  dangerousCount: 3, // 위험 상호작용 개수
  safeCount: 8, // 안전 상호작용 개수
  totalInteractions: 13, // 총 상호작용 개수 (중복 + 위험 + 안전)
};

// 위험도 레벨별 색상 및 텍스트
export const getRiskLevel = (score: number) => {
  if (score >= 80) {
    return {
      level: 'high',
      text: '높음',
      color: '#EF4444',
      backgroundColor: '#FEF2F2',
    };
  } else if (score >= 50) {
    return {
      level: 'medium',
      text: '보통',
      color: '#F59E0B',
      backgroundColor: '#FFFBEB',
    };
  } else {
    return {
      level: 'low',
      text: '낮음',
      color: '#10B981',
      backgroundColor: '#ECFDF5',
    };
  }
};

// 상호작용 카테고리별 색상
export const INTERACTION_COLORS = {
  duplicate: {
    primary: '#8B5CF6',
    background: '#F5F3FF',
    light: '#EDE9FE',
  },
  dangerous: {
    primary: '#EF4444',
    background: '#FEF2F2',
    light: '#FEE2E2',
  },
  safe: {
    primary: '#10B981',
    background: '#ECFDF5',
    light: '#D1FAE5',
  },
};

// 가족별 상호작용 데이터 (예시)
export const FAMILY_INTERACTION_DATA: { [key: string]: InteractionData } = {
  '1': { // 오말숙
    riskScore: 75,
    duplicateCount: 2,
    dangerousCount: 3,
    safeCount: 8,
    totalInteractions: 13,
  },
  '2': { // 남지윤
    riskScore: 35,
    duplicateCount: 0,
    dangerousCount: 1,
    safeCount: 4,
    totalInteractions: 5,
  },
  '3': { // 홍준우
    riskScore: 20,
    duplicateCount: 0,
    dangerousCount: 0,
    safeCount: 2,
    totalInteractions: 2,
  },
  '4': { // 이수아
    riskScore: 45,
    duplicateCount: 1,
    dangerousCount: 1,
    safeCount: 3,
    totalInteractions: 5,
  },
};

// 특정 가족 구성원의 상호작용 데이터 조회
export const getInteractionDataByMemberId = (memberId: string): InteractionData => {
  return FAMILY_INTERACTION_DATA[memberId] || INTERACTION_DATA;
};

// 전체 가족의 평균 위험도 점수 계산
export const getFamilyAverageRiskScore = (): number => {
  const scores = Object.values(FAMILY_INTERACTION_DATA).map(data => data.riskScore);
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return Math.round(average);
};

// 전체 가족의 총 위험 상호작용 개수
export const getFamilyTotalDangerousCount = (): number => {
  return Object.values(FAMILY_INTERACTION_DATA).reduce((total, data) => total + data.dangerousCount, 0);
};
