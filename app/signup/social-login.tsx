import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import StepHeader from '@/components/signup/StepHeader';
import ProgressBar from '@/components/signup/ProgressBar';
import PrimaryButton from '@/components/PrimaryButton';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function SocialLogin() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StepHeader title="회원가입" subtitle="간편하게 시작하세요" />
      <ProgressBar progress={16} steps={["소셜", "역할", "약관", "정보", "완료"]} currentStep={0} />

      <View style={styles.content}>
        {/* 소셜 로그인 섹션 */}
        <View style={styles.sectionCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="person-add" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.title}>간편 가입하기</Text>
          <Text style={styles.description}>
            소셜 계정으로 빠르고 안전하게{'\n'}가입할 수 있습니다
          </Text>
          
          <View style={styles.socialButtons}>
            <TouchableOpacity style={[styles.socialButton, styles.kakaoButton]}>
              <Ionicons name="chatbubble-ellipses" size={24} color="#3C1E1E" />
              <Text style={styles.kakaoButtonText}>카카오톡으로 계속하기</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
              <Ionicons name="logo-google" size={24} color="#EA4335" />
              <Text style={styles.googleButtonText}>Google로 계속하기</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 구분선 */}
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>또는</Text>
          <View style={styles.divider} />
        </View>

        {/* 역할 선택으로 이동 */}
        <View style={styles.sectionCard}>
          <Text style={styles.alternativeTitle}>역할을 선택하여 시작하기</Text>
          <Text style={styles.alternativeDescription}>
            보호자 또는 보호 대상자 역할을 선택하고{'\n'}단계별로 가입을 진행할 수 있습니다
          </Text>
          
          <PrimaryButton 
            title="역할 선택하기" 
            onPress={() => router.push('/signup')} 
            style={styles.roleButton}
          />
        </View>

        {/* 안내 정보 */}
        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>
            안전한 데이터 보호와 개인정보 보안을{'\n'}위해 최선을 다하고 있습니다
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
    fontSize: 24,
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
  socialButtons: {
    width: '100%',
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    minHeight: 56,
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  kakaoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3C1E1E',
    marginLeft: 12,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DADCE0',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3C4043',
    marginLeft: 12,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: Colors.mediumGray,
    fontSize: 14,
    fontWeight: '500',
  },
  alternativeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  alternativeDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  roleButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
    width: '100%',
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
    textAlign: 'center',
  },
});