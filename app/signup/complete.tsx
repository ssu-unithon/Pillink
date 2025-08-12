import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import StepHeader from '@/components/signup/StepHeader';
import ProgressBar from '@/components/signup/ProgressBar';
import PrimaryButton from '@/components/PrimaryButton';
import {Colors} from '@/constants/Colors';

export default function SignupComplete() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StepHeader title="가입완료" subtitle="환영합니다! 회원가입이 성공적으로 완료되었습니다" />
      <ProgressBar progress={100} steps={["소셜", "역할", "약관", "정보", "완료"]} currentStep={4} />

      <View style={styles.content}>
        <View style={styles.centerContent}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={80} color="#fff" />
            <View style={styles.confetti} />
          </View>
          <Text style={styles.nameText}>환영합니다!</Text>
          <Text style={styles.completeText}>가입이 완료되었습니다</Text>
        </View>
        <PrimaryButton title="홈으로 이동" onPress={() => router.push('/')} style={styles.homeBtn} />
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  confetti: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: Colors.secondary,
    opacity: 0.3,
  },
  nameText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  completeText: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 24,
  },
  homeBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    minHeight: 48,
  },
});
