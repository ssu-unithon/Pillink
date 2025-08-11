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

  // AsyncStorage 변경을 감지하기 위한 interval
  useEffect(() => {
    const interval = setInterval(checkOnboardingStatus, 1000);
    return () => clearInterval(interval);
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
