import React from 'react';
import { View, StyleSheet, TouchableOpacity, Haptics } from 'react-native';
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
    // 햅틱 피드백 추가
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // 햅틱 피드백이 지원되지 않는 환경에서는 무시
    }

    if (onTabPress) onTabPress(idx);

    // 라우팅 로직
    switch (idx) {
      case 0:
        router.push('/');
        break;
      case 1:
        // router.push('/medications');
        break;
      case 2:
        // router.push('/add');
        break;
      case 3:
        // router.push('/chat');
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
              color={isActive ? Colors.light.primary : '#999'}
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
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 12,
    paddingBottom: 20, // 16에서 20으로 증가
    paddingTop: 12, // 8에서 12로 증가
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10, // 8에서 10으로 증가
    paddingHorizontal: 8,
    borderRadius: 20,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: 'rgba(37, 99, 235, 0.12)', // 투명도 조금 증가
    transform: [{ scale: 1.02 }], // 선택된 탭 살짝 확대
  },
  icon: {
    marginBottom: 6, // 아이콘과 점 사이 간격 증가
  },
  activeIcon: {
    // 추가 스타일 없음
  },
  centerCircleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8, // 좌우 패딩 추가하여 다른 탭과 일관성
  },
  centerCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#007AFF', // iOS 스타일 파란색
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    position: 'absolute',
    top: -50, // -40에서 -24로 조정하여 적절한 높이로
  },
  centerCircleActive: {
    backgroundColor: '#0051D0', // 더 진한 파란색
    transform: [{ scale: 1.05 }],
    shadowOpacity: 0.4,
  },
});