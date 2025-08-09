import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import PrimaryButton from '../components/PrimaryButton';
import TextButton from '../components/TextButton';

const { width } = Dimensions.get('window');
const ONBOARDING_COMPLETED_KEY = 'onboarding_completed';

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingData = [
    {
      id: 1,
      title: "안전한 복용을 위한\n스마트 가이드",
      subtitle: "약물 상호작용을 미리 확인하고\n안전하게 복용하세요",
      icon: "💊",
      backgroundColor: Colors.light.primary
    },
    {
      id: 2,
      title: "AI 기반\n맞춤형 건강관리",
      subtitle: "개인의 복용 패턴을 분석하여\n최적의 건강 관리를 제공합니다",
      icon: "🤖",
      backgroundColor: Colors.light.secondary
    },
    {
      id: 3,
      title: "간편한 복용 기록과\n알림 서비스",
      subtitle: "복용 시간을 놓치지 않도록\n스마트하게 관리해드립니다",
      icon: "⏰",
      backgroundColor: Colors.light.warning
    }
  ];

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      router.replace('/'); // replace를 사용하여 온보딩으로 돌아갈 수 없게 함
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/'); // 오류가 발생해도 메인 화면으로 이동
    }
  };

  const handleNext = () => {
    if (currentStep < onboardingData.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding(); // 온보딩 완료 처리
    }
  };

  const handleSkip = () => {
    completeOnboarding(); // 건너뛰기도 온보딩 완료 처리
  };

  const currentData = onboardingData[currentStep];

  return (
    <View style={[styles.container, { backgroundColor: Colors.light.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />

      {/* Skip Button */}
      <View style={styles.header}>
        <TextButton
          title="건너뛰기"
          onPress={handleSkip}
          color={Colors.light.mediumGray}
          fontSize={16}
          fontWeight="500"
        />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: currentData.backgroundColor }]}>
          <Text style={styles.icon}>{currentData.icon}</Text>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: Colors.light.text }]}>{currentData.title}</Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: Colors.light.mediumGray }]}>{currentData.subtitle}</Text>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Page Indicator - 다음 버튼 바로 위로 이동 */}
        <View style={styles.pageIndicator}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index === currentStep ? currentData.backgroundColor : Colors.light.lightGray }
              ]}
            />
          ))}
        </View>

        {/* Next/Get Started Button */}
        <PrimaryButton
          title={currentStep === onboardingData.length - 1 ? '시작하기' : '다음'}
          onPress={handleNext}
          backgroundColor={currentData.backgroundColor}
          width={width - 40}
          style={{ marginBottom: 16 }}
        />

        {/* Previous Button */}
        {currentStep > 0 && (
          <TextButton
            title="이전"
            onPress={() => setCurrentStep(currentStep - 1)}
            color={Colors.light.mediumGray}
            fontSize={16}
            fontWeight="500"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 60,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 60,
  },
  pageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
});
