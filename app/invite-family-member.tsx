import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

const InviteFamilyMember = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validatePhone = (phone: string) => {
    // 간단한 휴대폰 번호 유효성 검사 (010-xxxx-xxxx 또는 010xxxxxxxx)
    return /^01[016789]-?\d{3,4}-?\d{4}$/.test(phone);
  };

  const handleInvite = async () => {
    setError('');
    if (!name.trim() || !phone.trim()) {
      setError('이름과 전화번호를 모두 입력해주세요.');
      return;
    }
    if (!validatePhone(phone)) {
      setError('올바른 전화번호 형식을 입력해주세요.');
      return;
    }
    setLoading(true);
    // TODO: 초대 API 연동
    setTimeout(() => {
      setLoading(false);
      Alert.alert('초대 완료', `${name}님을 가족으로 초대했습니다.`);
      router.back();
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Text style={styles.closeButtonText}>닫기</Text>
      </TouchableOpacity>
      <Text style={styles.title}>가족 초대하기</Text>
      <Text style={styles.description}>이름과 전화번호를 입력해 가족을 초대하세요.</Text>
      <TextInput
        style={[styles.input, error && !name.trim() ? styles.inputError : null]}
        placeholder="이름"
        value={name}
        onChangeText={setName}
        returnKeyType="next"
      />
      <TextInput
        style={[styles.input, error && (!phone.trim() || !validatePhone(phone)) ? styles.inputError : null]}
        placeholder="전화번호"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        maxLength={13}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={handleInvite} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>초대하기</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 32,
    color: Colors.text,
    alignSelf: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 24,
    zIndex: 10,
    padding: 8,
  },
  closeButtonText: {
    color: Colors.mediumGray,
    fontSize: 16,
  },
  description: {
    fontSize: 15,
    color: Colors.mediumGray,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 18,
    backgroundColor: '#fafbfc',
  },
  inputError: {
    borderColor: Colors.danger,
    backgroundColor: '#FFF0F0',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 2,
  },
});

export default InviteFamilyMember;
