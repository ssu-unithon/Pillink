import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import StepHeader from '@/components/signup/StepHeader';
import ProgressBar from '@/components/signup/ProgressBar';
import PrimaryButton from '@/components/PrimaryButton';
import { Colors } from '@/constants/Colors';

const DISEASES = [
  '당뇨병', '고혈압', '무릎관절증', '만성요통',
  '만성위염', '시력감퇴', '만성심질환', '알레르기',
  '전립선 비대증', '치매',
];

const ALLERGIES = [
  '게', '대두', '꽃가루', '땅콩',
  '계란', '석류', '벌', '꿀',
  '카페인 민감', 'MSG 민감',
];

export default function SignupUserInfo() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [rrn1, setRrn1] = useState('');
  const [rrn2, setRrn2] = useState('');
  const [phone, setPhone] = useState('');
  const [nameError, setNameError] = useState('');
  const [rrnError, setRrnError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

  const validateName = () => {
    if (name.trim() === '') {
      setNameError('이름을 입력해주세요.');
      return false;
    } else {
      setNameError('');
      return true;
    }
  };

  const validateRrn = () => {
    if (rrn1.trim().length !== 6 || rrn2.trim().length !== 1) {
      setRrnError('주민등록번호를 올바르게 입력해주세요.');
      return false;
    } else {
      setRrnError('');
      return true;
    }
  };

  const validatePhone = () => {
    const phoneRegex = /^010\d{8}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError('휴대전화번호를 올바르게 입력해주세요.');
      return false;
    } else {
      setPhoneError('');
      return true;
    }
  };

  const handleNext = () => {
    const isNameValid = validateName();
    const isRrnValid = validateRrn();
    const isPhoneValid = validatePhone();

    if (isNameValid && isRrnValid && isPhoneValid) {
      router.push('/signup/complete');
    }
  };

  const toggleDisease = (disease: string) => {
    setSelectedDiseases(prev => 
      prev.includes(disease) ? prev.filter(d => d !== disease) : [...prev, disease]
    );
  };

  const toggleAllergy = (allergy: string) => {
    setSelectedAllergies(prev =>
      prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy]
    );
  };

  return (
    <View style={styles.container}>
      <StepHeader title="정보입력" />
      <ProgressBar progress={70} />

      <ScrollView style={styles.content}>
        {/* Input Fields */}
        <View style={styles.section}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            style={[styles.input, nameError ? styles.inputError : null]}
            placeholder="이름을 입력하세요"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
            onBlur={validateName}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          <Text style={styles.label}>주민등록번호</Text>
          <View style={styles.rrnRow}>
            <TextInput
              style={[styles.input, styles.rrnInput, rrnError ? styles.inputError : null]}
              placeholder="앞 6자리"
              placeholderTextColor="#9CA3AF"
              value={rrn1}
              onChangeText={setRrn1}
              keyboardType="number-pad"
              maxLength={6}
              onBlur={validateRrn}
            />
            <Text style={styles.rrnDash}>-</Text>
            <TextInput
              style={[styles.input, styles.rrnInput, rrnError ? styles.inputError : null]}
              placeholder="뒤 1자리"
              placeholderTextColor="#9CA3AF"
              value={rrn2}
              onChangeText={setRrn2}
              keyboardType="number-pad"
              maxLength={1}
              secureTextEntry
              onBlur={validateRrn}
            />
          </View>
          {rrnError ? <Text style={styles.errorText}>{rrnError}</Text> : null}

          <Text style={styles.label}>휴대전화번호</Text>
          <TextInput
            style={[styles.input, phoneError ? styles.inputError : null]}
            placeholder="ex) 01012345678"
            placeholderTextColor="#9CA3AF"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            onBlur={validatePhone}
          />
          {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
        </View>

        {/* Disease Selection */}
        <View style={styles.section}>
          <Text style={styles.title}>가지고 계신 <Text style={styles.highlight}>질환</Text>이 있다면 선택해주세요</Text>
          <View style={styles.chipContainer}>
            {DISEASES.map((d, i) => (
              <TouchableOpacity key={i} onPress={() => toggleDisease(d)} style={[styles.chip, selectedDiseases.includes(d) && styles.chipSelected]}>
                <Text style={[styles.chipText, selectedDiseases.includes(d) && styles.chipTextSelected]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.linkText}>찾는 질환이 없나요?</Text>
        </View>

        {/* Allergy Selection */}
        <View style={styles.section}>
          <Text style={styles.title}>가지고 계신 <Text style={styles.highlight}>알러지</Text>가 있다면 선택해주세요</Text>
          <View style={styles.chipContainer}>
            {ALLERGIES.map((a, i) => (
              <TouchableOpacity key={i} onPress={() => toggleAllergy(a)} style={[styles.chip, selectedAllergies.includes(a) && styles.chipSelected]}>
                <Text style={[styles.chipText, selectedAllergies.includes(a) && styles.chipTextSelected]}>{a}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.linkText}>찾는 알러지가 없나요?</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <PrimaryButton title="다음" onPress={handleNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 4,
  },
  inputError: {
    borderColor: 'red',
  },
  rrnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rrnInput: {
    flex: 1,
  },
  rrnDash: {
    fontSize: 18,
    color: '#9CA3AF',
    marginHorizontal: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 16,
  },
  highlight: {
    color: '#6366F1',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 12,
    marginBottom: 12,
  },
  chipSelected: {
    backgroundColor: '#6366F1',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  chipTextSelected: {
    color: '#fff',
  },
  linkText: {
    fontSize: 14,
    color: '#6B7280',
    textDecorationLine: 'underline',
    textAlign: 'right',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});
