import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import StepHeader from '@/components/signup/StepHeader';
import ProgressBar from '@/components/signup/ProgressBar';
import { Colors } from '@/constants/Colors';

export default function SignupRole() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StepHeader title="역할 선택" subtitle="사용할 서비스를 선택해주세요" />
      <ProgressBar progress={40} steps={["소셜", "역할", "약관", "정보", "완료"]} currentStep={1} />

      <View style={styles.content}>
        {/* Role Selection */}
        <View style={styles.sectionCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="people" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.title}>시작할 서비스를 선택해주세요</Text>
          <Text style={styles.description}>
            가족 구성원 관리 방식에 따라{'\n'}맞춤형 기능을 제공합니다
          </Text>
          <View style={styles.roleBtnRow}>
            <TouchableOpacity 
              style={styles.roleCard} 
              onPress={() => router.push('/signup/terms?role=guardian')}
            >
              <View style={styles.roleIconContainer}>
                <Ionicons name="shield-checkmark" size={32} color={Colors.primary} />
              </View>
              <Text style={styles.roleTitle}>보호자</Text>
              <Text style={styles.roleDescription}>가족 구성원의{'\n'}약물 관리</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.roleCard} 
              onPress={() => router.push('/signup/terms?role=patient')}
            >
              <View style={styles.roleIconContainer}>
                <Ionicons name="person" size={32} color={Colors.primary} />
              </View>
              <Text style={styles.roleTitle}>보호 대상자</Text>
              <Text style={styles.roleDescription}>개인 약물{'\n'}복용 관리</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 안내 정보 */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>
            선택한 역할은 나중에 설정에서 변경할 수 있습니다
          </Text>
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
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  roleBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    width: '100%',
  },
  roleCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 140,
    justifyContent: 'center',
  },
  roleIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  roleDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    marginTop: 8,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },
});