import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import StepHeader from '@/components/signup/StepHeader';
import ProgressBar from '@/components/signup/ProgressBar';
import PrimaryButton from '@/components/PrimaryButton';
import {Colors} from '@/constants/Colors';

export default function SignupTerms() {
  const router = useRouter();
  const [allAgreed, setAllAgreed] = useState(false);
  const [agreed, setAgreed] = useState([false, false, false, false]);
  const terms = [
    '개인정보 처리 목적',
    '개인정보처리및보유기간',
    '이용기간',
    '처리하는 개인정보의 항목',
  ];

  const handleAllAgree = () => {
    const newValue = !allAgreed;
    setAllAgreed(newValue);
    setAgreed(agreed.map(() => newValue));
  };
  const handleAgree = idx => {
    const newAgreed = [...agreed];
    newAgreed[idx] = !newAgreed[idx];
    setAgreed(newAgreed);
    setAllAgreed(newAgreed.every(Boolean));
  };

  return (
    <View style={styles.container}>
      <StepHeader title="약관동의" subtitle="서비스 이용을 위해 약관에 동의해주세요" />
      <ProgressBar progress={35} steps={["역할", "약관", "정보", "완료"]} currentStep={2} />

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.termRow} onPress={handleAllAgree}>
            <Ionicons name={allAgreed ? "checkbox" : "checkbox-outline"} size={28} color={Colors.primary} style={{ marginRight: 16 }} />
            <Text style={[styles.allAgreeText, { color: Colors.primary, fontWeight: 'bold' }]}>전체 약관에 동의합니다</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          {terms.map((t, i) => (
            <View style={styles.termRow} key={i}>
              <TouchableOpacity onPress={() => handleAgree(i)} style={styles.checkBoxBtn}>
                <Ionicons name={agreed[i] ? "checkbox" : "checkbox-outline"} size={24} color={Colors.primary} />
              </TouchableOpacity>
              <Text style={styles.termText}>(필수) {t}</Text>
              <TouchableOpacity style={styles.detailBtn}><Text style={styles.detailBtnText}>상세보기</Text></TouchableOpacity>
            </View>
          ))}
        </View>
        <Text style={styles.guideText}>모든 약관에 동의해야 다음 단계로 이동할 수 있습니다.</Text>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <PrimaryButton title="다음" onPress={() => router.push('/signup/user-info')} disabled={!allAgreed} style={allAgreed ? styles.nextBtn : styles.nextBtnDisabled} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkBoxBtn: {
    marginRight: 12,
    padding: 4,
  },
  allAgreeText: {
    fontSize: 18,
    color: Colors.primary,
  },
  termText: {
    fontSize: 15,
    color: Colors.primary,
    flex: 1,
  },
  detailBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  detailBtnText: {
    color: Colors.mediumGray,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 10,
  },
  guideText: {
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  nextBtn: {
    backgroundColor: Colors.primary,
  },
  nextBtnDisabled: {
    backgroundColor: Colors.lightGray,
  },
});
