import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";
import { DevModeProvider } from "@/contexts/DevModeContext";
import { FamilyDataProvider } from '@/contexts/FamilyDataContext';

const ONBOARDING_COMPLETED_KEY = "onboarding_completed";

function RootLayoutNav() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  const checkOnboardingStatus = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
      const shouldShowOnboarding = onboardingCompleted !== "true";
      setShowOnboarding(shouldShowOnboarding);

      // 인증 토큰 확인 및 기본 로그인
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        // 토큰이 없으면 test1 계정으로 기본 로그인 시도 (실제로는 email 필드 사용)
        const loginAttempts = [
          { email: 'test1', password: '1234' }
        ];
        
        for (const credentials of loginAttempts) {
          try {
            console.log('Trying login with:', credentials.phone);
            const response = await fetch('https://pillink-backend-production.up.railway.app/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(credentials)
            });

            if (response.ok) {
              const data = await response.json();
              await AsyncStorage.setItem('access_token', data.accessToken);
              console.log('Default login successful with:', credentials.phone);
              break; // 성공하면 루프 종료
            } else {
              const errorText = await response.text();
              console.log('Login attempt failed for', credentials.phone, ':', response.status, response.statusText);
              console.log('Error response:', errorText);
            }
          } catch (error) {
            console.error('Login attempt error for', credentials.phone, ':', error);
          }
        }
      }

      // 온보딩 상태에 따라 네비게이션
      if (shouldShowOnboarding && segments[0] !== "onboarding") {
        router.replace("/onboarding");
      } else if (!shouldShowOnboarding && segments[0] === "onboarding") {
        router.replace("/");
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      setShowOnboarding(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.background,
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{
      headerShown: false,
      animation: "none",
      presentation: "card",
      animationDuration: 0,
      gestureEnabled: false
    }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="index" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="interaction" />
      <Stack.Screen name="myinfo" />
      <Stack.Screen name="family/[id]" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <DevModeProvider>
      <FamilyDataProvider>
        <RootLayoutNav />
      </FamilyDataProvider>
    </DevModeProvider>
  );
}
