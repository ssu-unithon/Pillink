
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SignupComplete() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>가입완료</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBar, { width: '100%' }]} />
      </View>

      {/* Complete Icon & Text */}
      <View style={styles.centerContent}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={80} color="#fff" />
        </View>
        <Text style={styles.nameText}>홍길동님</Text>
        <Text style={styles.completeText}>가입이 완료되었습니다</Text>
      </View>

      {/* 확인 버튼 */}
      <TouchableOpacity style={styles.nextBtn} onPress={() => router.push('/')}>
        <Text style={styles.nextBtnText}>확인</Text>
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
    width: '100%',
    height: 10,
    backgroundColor: '#1976F7',
    borderRadius: 5,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1976F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  nameText: {
    fontSize: 28,
    color: '#1976F7',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  completeText: {
    fontSize: 22,
    color: '#111',
    fontWeight: '500',
    marginBottom: 32,
  },
  nextBtn: {
    backgroundColor: '#1976F7',
    borderRadius: 18,
    paddingVertical: 22,
    marginHorizontal: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  nextBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
