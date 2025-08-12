import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import PrimaryButton from '@/components/PrimaryButton';
import FamilyService from '@/services/FamilyService';

const InviteFamilyMember = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
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
    try {
      // API를 통한 가족 초대
      await FamilyService.inviteToFamily(phone);
      Alert.alert('초대 완료', `${name}님을 가족으로 초대했습니다.`);
      router.back();
    } catch (error) {
      console.error('Failed to invite family member:', error);
      setError('초대에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>가족 초대하기</Text>
        <View style={{ width: 40, height: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 설명 섹션 */}
        <View style={styles.descriptionSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="people" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.title}>새 가족 구성원 초대</Text>
          <Text style={styles.description}>
            이름과 전화번호를 입력하면{'\n'}초대 메시지를 보내드립니다
          </Text>
        </View>

        {/* 입력 폼 섹션 */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>이름</Text>
            <TextInput
              style={[
                styles.input, 
                focusedField === 'name' && styles.inputFocused,
                error && !name.trim() ? styles.inputError : null
              ]}
              placeholder="가족 구성원의 이름을 입력하세요"
              placeholderTextColor={Colors.mediumGray}
              value={name}
              onChangeText={setName}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>전화번호</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'phone' && styles.inputFocused,
                error && (!phone.trim() || !validatePhone(phone)) ? styles.inputError : null
              ]}
              placeholder="010-0000-0000"
              placeholderTextColor={Colors.mediumGray}
              value={phone}
              onChangeText={setPhone}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
              keyboardType="phone-pad"
              maxLength={13}
            />
          </View>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>
              초대받은 분이 앱을 설치하고 가입하면{'\n'}자동으로 가족 그룹에 추가됩니다
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomContainer}>
        <PrimaryButton
          title="초대 보내기"
          onPress={handleInvite}
          loading={loading}
          disabled={loading}
          style={styles.inviteButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  descriptionSection: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
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
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  formSection: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.card,
  },
  inputFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
    shadowColor: Colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: Colors.danger,
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    marginBottom: 16,
    marginLeft: 4,
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
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  inviteButton: {
    backgroundColor: Colors.primary,
    minHeight: 54,
  },
});

export default InviteFamilyMember;
