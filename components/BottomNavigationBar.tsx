import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';

// 더 직관적인 아이콘들로 변경
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

  const handleTabPress = async (idx: number) => {
    if (onTabPress) onTabPress(idx);

    // 라우팅 로직
    switch (idx) {
      case 0:
        router.push('/');
        break;
      case 1:
        router.push('/interaction'); // 약물 상호작용 페이지로 이동
        break;
      case 2:
        // router.push('/add');
        break;
      case 3:
        router.push('/chat'); // AI 챗봇 화면으로 이동
        break;
      case 4:
        router.push('/myinfo');
        break;
    }
  };

  return (
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
                accessibilityLabel={`${labels[idx]} 탭`}
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name={icon}
                  size={32}
                  color={'#fff'}
                />
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
    </View>
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
});