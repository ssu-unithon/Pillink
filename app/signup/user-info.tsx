
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>정보입력</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBar, { width: '70%' }]} />
      </View>

      {/* Input Fields */}
      <View style={styles.section}>
        <Text style={styles.labelActive}>이름</Text>
        <TextInput
          style={styles.input}
          placeholder="이름을 입력하세요"
          placeholderTextColor="#C4C4C4"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.labelActive}>주민등록번호</Text>
        <View style={styles.rrnRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="앞 6자리"
            value={rrn1}
            onChangeText={setRrn1}
            keyboardType="number-pad"
            maxLength={6}
          />
          <Text style={styles.rrnDash}>-</Text>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="뒤 7자리"
            value={rrn2}
            onChangeText={setRrn2}
            keyboardType="number-pad"
            maxLength={7}
            secureTextEntry
          />
        </View>
        <Text style={styles.labelActive}>휴대전화번호</Text>
        <TextInput
          style={styles.input}
          placeholder="ex) 01012345678"
          placeholderTextColor="#C4C4C4"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      {/* Disease Selection */}
      <View style={styles.section}>
        <Text style={styles.title}>가지고 계신 <Text style={styles.blue}>질환</Text>이 있다면 선택해주세요</Text>
        <View style={styles.grid}>
          {DISEASES.map((d, i) => (
            <TouchableOpacity key={i} style={styles.chipBtn}>
              <Text style={styles.chipText}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.subText}>찾는 질환이 없나요?</Text>
      </View>

      {/* Allergy Selection */}
      <View style={styles.section}>
        <Text style={styles.title}>가지고 계신 <Text style={styles.blue}>알러지</Text>가 있다면 선택해주세요</Text>
        <View style={styles.grid}>
          {ALLERGIES.map((a, i) => (
            <TouchableOpacity key={i} style={styles.chipBtn}>
              <Text style={styles.chipText}>{a}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.subText}>찾는 알러지가 없나요?</Text>
      </View>

      {/* Next Button */}
      <TouchableOpacity style={styles.nextBtn} onPress={() => router.push('/signup/complete')}>
        <Text style={styles.nextBtnText}>다음</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#F1F3F6',
    borderRadius: 5,
    marginHorizontal: 20,
    marginBottom: 24,
    marginTop: 0,
  },
  progressBar: {
    width: '70%',
    height: 10,
    backgroundColor: '#1976F7',
    borderRadius: 5,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  labelActive: {
    fontSize: 16,
    color: '#1976F7',
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#C4C4C4',
    fontSize: 18,
    paddingVertical: 10,
    marginBottom: 8,
    color: '#222',
  },
  rrnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rrnDash: {
    fontSize: 22,
    color: '#888',
    marginHorizontal: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    marginTop: 12,
    marginBottom: 16,
  },
  blue: {
    color: '#1976F7',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  chipBtn: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  chipText: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 14,
    color: '#888',
    textDecorationLine: 'underline',
  },
  nextBtn: {
    backgroundColor: '#1976F7',
    borderRadius: 18,
    paddingVertical: 22,
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 40,
    alignItems: 'center',
  },
  nextBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
