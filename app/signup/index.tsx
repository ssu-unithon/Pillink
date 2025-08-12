import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function SocialLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleKakaoLogin = async () => {
    setIsLoading(true);
    // 카카오 로그인 로직 구현
    setTimeout(() => {
      setIsLoading(false);
      // 신규 사용자라면 소셜 정보 입력으로, 기존 사용자라면 메인화면으로
      router.push('/signup/social-info?provider=kakao');
    }, 1000);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // 구글 로그인 로직 구현
    setTimeout(() => {
      setIsLoading(false);
      // 신규 사용자라면 소셜 정보 입력으로, 기존 사용자라면 메인화면으로
      router.push('/signup/social-info?provider=google');
    }, 1000);
  };

  const handleSignup = () => {
    router.push('/signup/role');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="medical" size={64} color={Colors.primary} />
        </View>
        <Text style={styles.appName}>PillLink</Text>
        <Text style={styles.subtitle}>가족의 건강을 함께 관리하세요</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.loginCard}>

          
          <View style={styles.socialButtons}>
            <TouchableOpacity 
              style={[styles.socialButton, styles.kakaoButton]}
              onPress={handleKakaoLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Ionicons name="chatbubble-ellipses" size={24} color="#3C1E1E" />
              <Text style={styles.kakaoButtonText}>카카오톡으로 로그인</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.socialButton, styles.googleButton]}
              onPress={handleGoogleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-google" size={24} color="#EA4335" />
              <Text style={styles.googleButtonText}>Google로 로그인</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>또는</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity 
            style={styles.signupButton}
            onPress={handleSignup}
            activeOpacity={0.8}
          >
            <Ionicons name="person-add-outline" size={20} color={Colors.primary} />
            <Text style={styles.signupButtonText}>새 계정 만들기</Text>
          </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  loginCard: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 40,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  loginDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  socialButtons: {
    gap: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    minHeight: 64,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  kakaoButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3C1E1E',
    marginLeft: 12,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#DADCE0',
  },
  googleButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3C4043',
    marginLeft: 12,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: 20,
    color: Colors.mediumGray,
    fontSize: 16,
    fontWeight: '500',
  },
  signupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
    minHeight: 56,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 8,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#F0F8FF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    marginTop: 32,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 16,
    flex: 1,
    lineHeight: 20,
    textAlign: 'center',
  },
});
