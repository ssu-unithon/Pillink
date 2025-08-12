export interface MedicationInfo {
  id: string;
  medicationName: string;
  time: string;
  dosage: string;
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'as-needed';
  notes?: string;
  icon: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  active: boolean;
  phone?: string;
  email?: string;
  medications?: MedicationInfo[];
  diseases?: string[];
  allergies?: string[];
}

// 사용 가능한 질환 목록
export const AVAILABLE_DISEASES = [
  '당뇨병', '고혈압', '무릎관절증', '만성요통',
  '만성위염', '시력감퇴', '만성심질환', '알레르기',
  '전립선 비대증', '치매',
];

// 사용 가능한 알레르기 목록
export const AVAILABLE_ALLERGIES = [
  '게', '대두', '꽃가루', '땅콩',
  '계란', '석류', '벌', '꿀',
  '카페인 민감', 'MSG 민감',
];

// 가족 구성원 데이터
export const FAMILY_DATA: FamilyMember[] = [
  { id: 'invite', type: 'invite' } as any, // 초대하기 특수 항목
  {
    id: '1',
    name: '오말숙',
    active: true,
    phone: '010-1234-5678',
    email: 'omalsook@example.com',
    diseases: ['당뇨병', '고혈압'],
    allergies: ['대두', '꽃가루'],
    medications: [
      {
        id: '1-1',
        medicationName: '혈압약',
        time: '08:00',
        dosage: '1정',
        enabled: true,
        frequency: 'daily',
        notes: '식후 복용',
        icon: 'medical-services'
      },
      {
        id: '1-2',
        medicationName: '당뇨약',
        time: '12:00',
        dosage: '2정',
        enabled: true,
        frequency: 'daily',
        notes: '식전 30분',
        icon: 'medication'
      },
      {
        id: '1-3',
        medicationName: '종합비타민',
        time: '09:00',
        dosage: '1정',
        enabled: true,
        frequency: 'daily',
        notes: '아침 식사 후',
        icon: 'local-pharmacy'
      }
    ]
  },
  {
    id: '2',
    name: '남지윤',
    active: false,
    phone: '010-2345-6789',
    email: 'namjiyoon@example.com',
    diseases: ['만성위염'],
    allergies: ['계란', '땅콩'],
    medications: [
      {
        id: '2-1',
        medicationName: '철분제',
        time: '19:00',
        dosage: '1정',
        enabled: false,
        frequency: 'daily',
        notes: '저녁 식사 후',
        icon: 'health-and-safety'
      },
      {
        id: '2-2',
        medicationName: '비타민 C',
        time: '08:30',
        dosage: '1정',
        enabled: true,
        frequency: 'daily',
        notes: '아침 식사 후',
        icon: 'local-pharmacy'
      }
    ]
  },
  {
    id: '3',
    name: '홍준우',
    active: false,
    phone: '010-3456-7890',
    email: 'hongjunwoo@example.com',
    diseases: [],
    allergies: ['카페인 민감'],
    medications: [
      {
        id: '3-1',
        medicationName: '비타민 D',
        time: '20:00',
        dosage: '1정',
        enabled: false,
        frequency: 'daily',
        notes: '저녁 식사 후',
        icon: 'health-and-safety'
      }
    ]
  },
  {
    id: '4',
    name: '이수아',
    active: false,
    phone: '010-4567-8901',
    email: 'isooa@example.com',
    diseases: ['시력감퇴'],
    allergies: [],
    medications: [
      {
        id: '4-1',
        medicationName: '오메가3',
        time: '21:00',
        dosage: '2정',
        enabled: true,
        frequency: 'daily',
        notes: '저녁 식사 후',
        icon: 'local-pharmacy'
      },
      {
        id: '4-2',
        medicationName: '프로바이오틱스',
        time: '07:30',
        dosage: '1정',
        enabled: false,
        frequency: 'daily',
        notes: '아침 공복',
        icon: 'health-and-safety'
      }
    ]
  },
];

// 특정 가족 구성원 조회 함수
export const getFamilyMemberById = (id: string): FamilyMember | undefined => {
  return FAMILY_DATA.find(member => member.id === id && member.id !== 'invite');
};

// 초대하기 제외한 실제 가족 구성원만 반환
export const getFamilyMembers = (): FamilyMember[] => {
  return FAMILY_DATA.filter(member => member.id !== 'invite');
};

// 특정 가족 구성원의 약물 정보 조회
export const getMedicationsByMemberId = (memberId: string): MedicationInfo[] => {
  const member = getFamilyMemberById(memberId);
  return member?.medications || [];
};

// 모든 가족의 활성화된 약물 알림 수 조회
export const getActiveMedicationAlarmsCount = (): number => {
  return getFamilyMembers().reduce((count, member) => {
    const activeMedications = member.medications?.filter(med => med.enabled) || [];
    return count + activeMedications.length;
  }, 0);
};

// 특정 가족 구성원의 질환 정보 조회
export const getDiseasesByMemberId = (memberId: string): string[] => {
  const member = getFamilyMemberById(memberId);
  return member?.diseases || [];
};

// 특정 가족 구성원의 알레르기 정보 조회
export const getAllergiesByMemberId = (memberId: string): string[] => {
  const member = getFamilyMemberById(memberId);
  return member?.allergies || [];
};

// 특정 가족 구성원의 질환 정보 업데이트
export const updateMemberDiseases = (memberId: string, diseases: string[]): boolean => {
  const memberIndex = FAMILY_DATA.findIndex(member => member.id === memberId);
  if (memberIndex !== -1 && memberIndex !== 0) { // invite 항목 제외
    FAMILY_DATA[memberIndex].diseases = diseases;
    return true;
  }
  return false;
};

// 특정 가족 구성원의 알레르기 정보 업데이트
export const updateMemberAllergies = (memberId: string, allergies: string[]): boolean => {
  const memberIndex = FAMILY_DATA.findIndex(member => member.id === memberId);
  if (memberIndex !== -1 && memberIndex !== 0) { // invite 항목 제외
    FAMILY_DATA[memberIndex].allergies = allergies;
    return true;
  }
  return false;
};

// 특정 가족 구성원에게 약물 추가
export const addMedicationToMember = (memberId: string, medicationData: {
  id: string;
  name: string;
  type: string;
  company: string;
  dosage?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
  time?: string;
}): boolean => {
  const memberIndex = FAMILY_DATA.findIndex(member => member.id === memberId);
  if (memberIndex !== -1 && memberIndex !== 0) { // invite 항목 제외
    const member = FAMILY_DATA[memberIndex];
    
    // 기존 medications 배열이 없으면 생성
    if (!member.medications) {
      member.medications = [];
    }
    
    // 새 약물 정보 생성 (기존 MedicationInfo 인터페이스에 맞춤)
    const newMedication: MedicationInfo = {
      id: `${memberId}-${Date.now()}`, // 고유 ID 생성
      medicationName: medicationData.name,
      time: medicationData.time || '08:00',
      dosage: medicationData.dosage || '1정',
      enabled: true,
      frequency: 'daily',
      notes: medicationData.notes || '',
      icon: 'medication'
    };
    
    // 약물 추가
    member.medications.push(newMedication);
    return true;
  }
  return false;
};

// 특정 가족 구성원의 약물 제거
export const removeMedicationFromMember = (memberId: string, medicationId: string): boolean => {
  const memberIndex = FAMILY_DATA.findIndex(member => member.id === memberId);
  if (memberIndex !== -1 && memberIndex !== 0) { // invite 항목 제외
    const member = FAMILY_DATA[memberIndex];
    if (member.medications) {
      const medicationIndex = member.medications.findIndex(med => med.id === medicationId);
      if (medicationIndex !== -1) {
        member.medications.splice(medicationIndex, 1);
        return true;
      }
    }
  }
  return false;
};

// 특정 가족 구성원의 약물 정보 업데이트
export const updateMedicationInfo = (memberId: string, medicationId: string, updates: Partial<MedicationInfo>): boolean => {
  const memberIndex = FAMILY_DATA.findIndex(member => member.id === memberId);
  if (memberIndex !== -1 && memberIndex !== 0) { // invite 항목 제외
    const member = FAMILY_DATA[memberIndex];
    if (member.medications) {
      const medicationIndex = member.medications.findIndex(med => med.id === medicationId);
      if (medicationIndex !== -1) {
        // 기존 약물 정보와 업데이트된 정보 병합
        member.medications[medicationIndex] = {
          ...member.medications[medicationIndex],
          ...updates
        };
        return true;
      }
    }
  }
  return false;
};
