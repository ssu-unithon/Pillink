import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

const icons = [
  'home',
  'pill',
  'plus',
  'message-text',
  'account-circle',
];

const labels = ['홈', '약물관리', '추가', '채팅', '내정보'];

export default function BottomNavigationBar({ activeIndex = 0, onTabPress }: { activeIndex?: number; onTabPress?: (idx: number) => void }) {
  const router = useRouter();
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);
  const [showFloatingButtons, setShowFloatingButtons] = useState(false);
  const floatingAnimation1 = useRef(new Animated.Value(0)).current;
  const floatingAnimation2 = useRef(new Animated.Value(0)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;
  const backgroundAnimation = useRef(new Animated.Value(0)).current;

  const toggleFloatingMenu = () => {
    const isOpening = !isFloatingMenuOpen;
    // 애니메이션만 먼저 실행
    Animated.parallel([
      Animated.timing(floatingAnimation1, {
        toValue: isOpening ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(floatingAnimation2, {
        toValue: isOpening ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnimation, {
        toValue: isOpening ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundAnimation, {
        toValue: isOpening ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 애니메이션이 끝난 후 상태 변경
      setIsFloatingMenuOpen(isOpening);
    });
  };

  React.useEffect(() => {
    if (isFloatingMenuOpen) {
      setShowFloatingButtons(true);
    } else {
      // 200ms 후에 버튼 제거
      const timeout = setTimeout(() => setShowFloatingButtons(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isFloatingMenuOpen]);

  const handleTabPress = async (idx: number) => {
    if (onTabPress) onTabPress(idx);

    // 플로팅 메뉴가 열려있으면 닫기
    if (isFloatingMenuOpen && idx !== 2) {
      toggleFloatingMenu();
    }

    // 현재 활성 탭과 같은 탭을 누르면 아무것도 하지 않음
    if (activeIndex === idx) return;

    // 라우팅 로직
    switch (idx) {
      case 0:
        router.push('/');
        break;
      case 1:
        router.push('/interaction');
        break;
      case 2:
        toggleFloatingMenu();
        break;
      case 3:
        router.push('/chat');
        break;
      case 4:
        router.push('/myinfo');
        break;
    }
  };

  const handleFloatingButtonPress = (action: 'search' | 'link') => {
    toggleFloatingMenu();
    // 여기에 각 버튼별 액션 구현
    if (action === 'search') {
      // 검색 기능 구현
      console.log('검색 버튼 클릭');
    } else if (action === 'link') {
      // 링크 기능 구현
      console.log('링크 버튼 클릭');
    }
  };

  const floatingButton1Style = {
    transform: [
      {
        translateX: floatingAnimation1.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -60], // 왼쪽으로 이동
        }),
      },
      {
        translateY: floatingAnimation1.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -100], // 위로 이동
        }),
      },
      {
        scale: floatingAnimation1.interpolate({
          inputRange: [0, 1],
          outputRange: [0.3, 1],
        }),
      },
    ],
    opacity: floatingAnimation1,
  };

  const floatingButton2Style = {
    transform: [
      {
        translateX: floatingAnimation2.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 60], // 오른쪽으로 이동
        }),
      },
      {
        translateY: floatingAnimation2.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -100], // 위로 이동
        }),
      },
      {
        scale: floatingAnimation2.interpolate({
          inputRange: [0, 1],
          outputRange: [0.3, 1],
        }),
      },
    ],
    opacity: floatingAnimation2,
  };

  const plusRotationStyle = {
    transform: [
      {
        rotate: rotateAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
    ],
  };

  return (
    <>
      {/* 배경 오버레이 */}
      {isFloatingMenuOpen && (
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: backgroundAnimation, // Animated.Value로 페이드 인 효과 적용
            },
          ]}
        >
          <TouchableOpacity style={styles.overlayTouchable} activeOpacity={1} onPress={toggleFloatingMenu} />
        </Animated.View>
      )}

      <View style={styles.container}>
        {icons.map((icon, idx) => {
          const isActive = activeIndex === idx;
          const isCenter = idx === 2;

          if (isCenter) {
            return (
              <View key={idx} style={styles.centerCircleWrapper}>
                <TouchableOpacity
                  style={[styles.centerCircle, isActive && styles.centerCircleActive]}
                  onPress={() => handleTabPress(idx)}
                  activeOpacity={0.8}
                  accessibilityLabel={`${labels[idx]} ���`}
                  accessibilityRole="button"
                >
                  <Animated.View style={plusRotationStyle}>
                    <MaterialCommunityIcons
                      name={icon}
                      size={32}
                      color={'#fff'}
                    />
                  </Animated.View>
                </TouchableOpacity>
              </View>
            );
          }

          return (
            <TouchableOpacity
              key={idx}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => handleTabPress(idx)}
              activeOpacity={0.6}
              accessibilityLabel={`${labels[idx]} 탭`}
              accessibilityRole="button"
            >
              <MaterialCommunityIcons
                name={icon}
                size={26}
                color={isActive ? Colors.navbarTabActive : Colors.navbarTabInactive}
                style={[styles.icon, isActive && styles.activeIcon]}
              />
            </TouchableOpacity>
          );
        })}

        {showFloatingButtons && (
          <>
            {/* 검색 버튼과 라벨 */}
            <Animated.View style={[styles.floatingButtonContainer, styles.floatingButtonZ, floatingButton1Style]}>
              <View style={styles.floatingButtonWrapper}>
                <TouchableOpacity
                  onPress={() => handleFloatingButtonPress('search')}
                  style={[styles.centerCircle]}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons name="magnify" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={styles.floatingButtonLabel}>직접 입력</Text>
            </Animated.View>

            {/* 링크 버튼과 라벨 */}
            <Animated.View style={[styles.floatingButtonContainer, styles.floatingButtonZ, floatingButton2Style]}>
              <View style={styles.floatingButtonWrapper}>
                <TouchableOpacity
                  onPress={() => handleFloatingButtonPress('link')}
                  style={[styles.centerCircle]}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons name="link" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={styles.floatingButtonLabel}>처방전 불러오기</Text>
            </Animated.View>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.navbarBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: Colors.navbarShadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 12,
    paddingBottom: 20,
    paddingTop: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 101, // 네비게이션 바가 오버레이 위에 오도록 설정
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 20,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: Colors.navbarTabActiveBg,
    transform: [{ scale: 1.02 }],
  },
  icon: {
    marginBottom: 6,
  },
  activeIcon: {
    // 추가 스타일 없음
  },
  centerCircleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  centerCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.navbarCenterButton,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.navbarCenterButton,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    position: 'absolute',
    top: -48,
  },
  centerCircleActive: {
    backgroundColor: Colors.navbarCenterButtonActive,
    transform: [{ scale: 1.05 }],
    shadowOpacity: 0.4,
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // 원형 강조
    borderWidth: 0,
    padding: 0,
  },
  floatingButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 99,
  },
  overlayTouchable: {
    flex: 1,
  },
  floatingButtonZ: {
    zIndex: 100,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  floatingButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    // 버튼과 라벨 세로 정렬
  },
  floatingButtonLabel: {
    marginTop: 4,
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});
