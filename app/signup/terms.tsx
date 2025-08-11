
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SignupTerms() {
  const router = useRouter();
  const [allAgreed, setAllAgreed] = useState(false);

  const terms = [
    '개인정보 처리 목적',
    '개인정보처리및보유기간',
    '이용기간',
    '처리하는 개인정보의 항목',
  ];

  const handleAllAgree = () => {
    setAllAgreed(!allAgreed);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>약관동의</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBar, { width: '35%' }]} />
      </View>

      {/* Card */}
      <View style={styles.card}>
        <TouchableOpacity style={styles.termRow} onPress={handleAllAgree}>
          <Ionicons name={allAgreed ? "checkbox" : "checkbox-outline"} size={24} color="#1976F7" style={{ marginRight: 12 }} />
          <Text style={styles.allAgreeText}><Text style={{ fontWeight: 'bold' }}>전체 동의합니다.</Text></Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        {terms.map((t, i) => (
          <View style={styles.termRow} key={i}>
            <Ionicons name="checkmark" size={20} color="#1976F7" style={{ marginRight: 8 }} />
            <Text style={styles.termText}>(필수) {t}</Text>
          </View>
        ))}
      </View>

      {/* Next Button */}
      <TouchableOpacity style={[styles.nextBtn, { backgroundColor: allAgreed ? '#1976F7' : '#ddd' }]} disabled={!allAgreed} onPress={() => router.push('/signup/user-info')}>
        <Text style={styles.nextBtnText}>다음</Text>
      </TouchableOpacity>
    </View>
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
    marginBottom: 36,
    marginTop: 0,
  },
  progressBar: {
    width: '35%',
    height: 10,
    backgroundColor: '#1976F7',
    borderRadius: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginHorizontal: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 32,
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  allAgreeText: {
    fontSize: 18,
    color: '#222',
  },
  termText: {
    fontSize: 16,
    color: '#222',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  nextBtn: {
    borderRadius: 18,
    paddingVertical: 22,
    marginHorizontal: 20,
    marginTop: 24,
    alignItems: 'center',
  },
  nextBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
