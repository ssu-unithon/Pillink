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
}

// 가족 구성원 데이터
export const FAMILY_DATA: FamilyMember[] = [
  { id: 'invite', type: 'invite' } as any, // 초대하기 특수 항목
  {
    id: '1',
    name: '오말숙',
    active: true,
    phone: '010-1234-5678',
    email: 'omalsook@example.com',
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
