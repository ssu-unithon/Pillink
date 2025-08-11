import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import StepHeader from '@/components/signup/StepHeader';
import ProgressBar from '@/components/signup/ProgressBar';
import PrimaryButton from '@/components/PrimaryButton';
import { Colors } from '@/constants/Colors';

export default function Signup() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StepHeader title="회원가입" subtitle="역할을 선택하고 간편하게 시작하세요" />
      <ProgressBar progress={25} steps={["역할", "약관", "정보", "완료"]} currentStep={1} />

      <View style={styles.content}>
        {/* Role Selection */}
        <View style={styles.sectionCard}>
          <Text style={styles.title}>시작할 서비스를 선택해주세요</Text>
          <View style={styles.roleBtnRow}>
            <PrimaryButton title="보호자" onPress={() => router.push('/signup/terms')} style={styles.roleBtn} icon="person" />
            <PrimaryButton title="보호 대상자" onPress={() => router.push('/signup/terms')} style={styles.roleBtn} icon="people" />
          </View>
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>또는</Text>
          <View style={styles.divider} />
        </View>

        {/* Social Login */}
        <View style={styles.sectionCard}>
          <Text style={styles.socialTitle}>아래 방법으로 간편하게 가입할 수 있습니다</Text>
          <PrimaryButton title="카카오톡으로 로그인" style={styles.socialBtnKakao} icon="chatbubble-ellipses" />
          <PrimaryButton title="Google로 로그인" style={styles.socialBtnGoogle} icon="logo-google" />
        </View>
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
    paddingVertical: 32,
    justifyContent: 'center',
  },
  sectionCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 28,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  roleBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  roleBtn: {
    flex: 1,
    marginHorizontal: 4,
    minHeight: 48,
    backgroundColor: Colors.primary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: 12,
    color: Colors.mediumGray,
    fontSize: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 18,
    textAlign: 'center',
  },
  socialTitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 18,
    textAlign: 'center',
  },
  socialBtnKakao: {
    backgroundColor: '#FEE500',
    marginBottom: 12,
  },
  socialBtnGoogle: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
