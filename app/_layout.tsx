import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";

const ONBOARDING_COMPLETED_KEY = "onboarding_completed";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem(
        ONBOARDING_COMPLETED_KEY
      );
      setShowOnboarding(onboardingCompleted !== "true");
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      setShowOnboarding(true); // 오류 시 온보딩 표시
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.light.background,
        }}
      >
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false, // 상단 헤더 완전히 숨김
        animation: "none", // 애니메이션 없음
        presentation: "card", // 카드 스타일로 설정
        animationDuration: 0, // 애니메이션 지속시간 0
        gestureEnabled: false, // 스와이프 제스처 비활성화
      }}
    >
      {showOnboarding ? (
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
            gestureEnabled: false, // 온보딩에서는 제스처로 뒤로가기 방지
          }}
        />
      ) : (
        <>
          <Stack.Screen name="index" />
          <Stack.Screen name="chat" />
          <Stack.Screen name="interaction" />
          <Stack.Screen name="myinfo" />
        </>
      )}
    </Stack>
  );
}
