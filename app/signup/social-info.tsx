import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import StepHeader from '@/components/signup/StepHeader';
import ProgressBar from '@/components/signup/ProgressBar';
import PrimaryButton from '@/components/PrimaryButton';
import { Colors } from '@/constants/Colors';

export default function SocialInfo() {
  const router = useRouter();
  const { provider } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 소셜 로그인에서 받은 정보로 초기값 설정
    if (provider === 'kakao') {
      setName('카카오 사용자'); // 실제로는 API에서 받은 데이터
      setEmail('user@kakao.com');
    } else if (provider === 'google') {
      setName('Google 사용자'); // 실제로는 API에서 받은 데이터
      setEmail('user@gmail.com');
    }
  }, [provider]);

  const handleNext = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('알림', '모든 필수 정보를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    // 소셜 정보 저장 로직
    setTimeout(() => {
      setIsLoading(false);
      router.push('/signup/role');
    }, 1000);
  };

  const handleImagePicker = () => {
    // 프로필 이미지 선택 로직
    Alert.alert('프로필 이미지', '이미지 선택 기능을 구현해주세요.');
  };

  return (
    <View style={styles.container}>
      <StepHeader title="소셜 정보 확인" subtitle="소셜 계정 정보를 확인하고 수정해주세요" />
      <ProgressBar progress={20} steps={["소셜", "역할", "약관", "정보", "완료"]} currentStep={0} />

      <ScrollView style={styles.content}>
        {/* 소셜 로그인 공급자 표시 */}
        <View style={styles.providerCard}>
          <View style={styles.providerInfo}>
            <Ionicons 
              name={provider === 'kakao' ? "chatbubble-ellipses" : "logo-google"} 
              size={32} 
              color={provider === 'kakao' ? "#FEE500" : "#EA4335"} 
            />
            <Text style={styles.providerText}>
              {provider === 'kakao' ? '카카오톡' : 'Google'} 계정으로 가입
            </Text>
          </View>
        </View>

        {/* 프로필 이미지 */}
        <View style={styles.section}>
          <Text style={styles.label}>프로필 이미지</Text>
          <TouchableOpacity style={styles.imageContainer} onPress={handleImagePicker}>
            {profileImage ? (
              <View style={styles.profileImage}>
                {/* 실제 이미지가 있다면 여기에 표시 */}
                <Ionicons name="person" size={48} color={Colors.mediumGray} />
              </View>
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="camera" size={32} color={Colors.mediumGray} />
                <Text style={styles.imageText}>사진 추가</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* 이름 */}
        <View style={styles.section}>
          <Text style={styles.label}>이름 *</Text>
          <TextInput
            style={styles.input}
            placeholder="이름을 입력하세요"
            placeholderTextColor={Colors.mediumGray}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        {/* 이메일 */}
        <View style={styles.section}>
          <Text style={styles.label}>이메일 *</Text>
          <TextInput
            style={styles.input}
            placeholder="이메일을 입력하세요"
            placeholderTextColor={Colors.mediumGray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* 안내 메시지 */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>
            소셜 계정에서 가져온 정보입니다.{'\n'}필요한 경우 수정하실 수 있습니다.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <PrimaryButton
          title="다음"
          onPress={handleNext}
          loading={isLoading}
          disabled={isLoading}
          style={styles.nextButton}
        />
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
    paddingVertical: 24,
  },
  providerCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 12,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  imageText: {
    fontSize: 12,
    color: Colors.mediumGray,
    marginTop: 4,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.card,
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
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: Colors.background,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    minHeight: 56,
  },
});