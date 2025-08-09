import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // 상단 헤더 완전히 숨김
        animation: "none", // 애니메이션 없음
        presentation: "card", // 카드 스타일로 설정
        animationDuration: 0, // 애니메이션 지속시간 0
        gestureEnabled: false, // 스와이프 제스처 비활성화
      }}
    />
  );
}
