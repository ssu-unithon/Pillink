import React, { createContext, useContext, useState } from 'react';
import { FAMILY_DATA } from '@/constants/FamilyData';

// 타입 정의
interface MedicationInfo {
  id: string;
  medicationName: string;
  enabled: boolean;
  [key: string]: any;
}
interface FamilyMember {
  id: string;
  name: string;
  medications?: MedicationInfo[];
  [key: string]: any;
}
interface FamilyDataContextType {
  familyData: FamilyMember[];
  updateMedicationEnabled: (userId: string, medicationName: string, enabled: boolean) => void;
}

const defaultContext: FamilyDataContextType = {
  familyData: FAMILY_DATA,
  updateMedicationEnabled: () => {},
};

const FamilyDataContext = createContext<FamilyDataContextType>(defaultContext);

export const FamilyDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [familyData, setFamilyData] = useState(FAMILY_DATA);

  // 약물 알림 설정(스위치) 변경 함수
  const updateMedicationEnabled = (userId: string, medicationName: string, enabled: boolean) => {
    setFamilyData(prev => prev.map(user => {
      if (user.id !== userId) return user;
      return {
        ...user,
        medications: user.medications?.map(med =>
          med.medicationName === medicationName ? { ...med, enabled } : med
        )
      };
    }));
  };

  return (
    <FamilyDataContext.Provider value={{ familyData, updateMedicationEnabled }}>
      {children}
    </FamilyDataContext.Provider>
  );
};

export const useFamilyData = () => useContext(FamilyDataContext);
export { FamilyDataContextType };
