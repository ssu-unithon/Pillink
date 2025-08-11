
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Signup() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>회원가입</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View style={styles.progressBar} />
      </View>

      {/* Social Login */}
      <Text style={styles.title}>로그인할 방식을 선택해주세요</Text>
      <TouchableOpacity style={styles.kakaoBtn}>
        <Ionicons name="chatbubble" size={24} color="#3C1E1E" />
        <Text style={styles.kakaoText}>카카오톡으로 로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.googleBtn}>
        <Ionicons name="logo-google" size={24} color="#222" />
        <Text style={styles.googleText}>Google로 로그인</Text>
      </TouchableOpacity>

      {/* Role Selection */}
      <Text style={styles.title}>시작할 서비스를 선택해주세요</Text>
      <TouchableOpacity style={styles.roleBtn} onPress={() => router.push('/signup/terms')}>
        <Text style={styles.roleBtnText}>보호자</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.roleBtn} onPress={() => router.push('/signup/terms')}>
        <Text style={styles.roleBtnText}>보호 대상자</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 0,
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
    width: '25%',
    height: 10,
    backgroundColor: '#1976F7',
    borderRadius: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
    marginTop: 24,
    marginBottom: 24,
    alignSelf: 'center',
  },
  kakaoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE500',
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginHorizontal: 20,
    marginBottom: 16,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  kakaoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3C1E1E',
    marginLeft: 8,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginHorizontal: 20,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 32,
  },
  googleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 8,
  },
  roleBtn: {
    backgroundColor: '#1976F7',
    borderRadius: 18,
    paddingVertical: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  roleBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
