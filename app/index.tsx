import React, { useEffect, useRef, useState } from 'react';
import { Text, View, ScrollView, StyleSheet, Animated, TouchableOpacity } from "react-native";
import InteractionRiskGroups from "../components/InteractionRiskGroups";
import CircularGauge from "../components/CircularGauge";
import CalendarComponent from "../components/CalendarComponent";
import { Colors } from "@/constants/Colors";
import BottomNavigationBar from "../components/BottomNavigationBar";
import SearchBar from '../components/SearchBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { INTERACTION_DATA } from "@/constants/InteractionData";
import { FAMILY_DATA } from "@/constants/FamilyData";
import FamilyGroup from "@/components/FamilyGroup";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAMILY_INTERACTION_DATA } from "@/constants/InteractionData";
import { USER_NAME } from '@/constants/UserInfo';

// Module-level variable to track if animation has run once per session
let hasAnimatedOnce = false;

// Animated component for staggered entrance
const AnimatedSection = ({ children, index, shouldAnimate }: { children: React.ReactNode, index: number, shouldAnimate: boolean }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        if (shouldAnimate) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                delay: index * 150,
                useNativeDriver: true,
            }).start();
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                delay: index * 150,
                useNativeDriver: true,
            }).start();
        } else {
            fadeAnim.setValue(1);
            slideAnim.setValue(0);
        }
    }, [shouldAnimate, index]);

    return (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {children}
        </Animated.View>
    );
};

export default function Index() {
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 선택된 가족 ID를 AsyncStorage에서 불러오기
  useEffect(() => {
    (async () => {
      const savedId = await AsyncStorage.getItem('selected_family_id');
      if (savedId) setSelectedId(savedId);
      else setSelectedId(FAMILY_DATA[1]?.id || null);
    })();
  }, []);

  // This effect runs only once when the component mounts for the first time in the app session.
  // It sets the flag to true, so subsequent mounts/re-renders won't trigger the animation.
  useEffect(() => {
    if (!hasAnimatedOnce) {
        hasAnimatedOnce = true;
    }
  }, []);

  const onQuickActionPress = (action: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Add navigation logic here based on the action
    console.log(action, 'pressed');
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: insets.top + 10 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <AnimatedSection index={0} shouldAnimate={!hasAnimatedOnce}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>PillLink</Text>
                <View style={styles.headerIcons}>
                    {/* 상단 프로필 아바타 삭제됨 */}
                </View>
            </View>
        </AnimatedSection>

        {/* Search Bar */}
        <AnimatedSection index={1} shouldAnimate={!hasAnimatedOnce}>
            <SearchBar />
        </AnimatedSection>

        {/* Greeting Text */}
        <AnimatedSection index={2} shouldAnimate={!hasAnimatedOnce}>
            <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>
                안녕하세요, <Text style={styles.greetingHighlight}>{USER_NAME}님!</Text>
            </Text>
            <Text style={styles.greetingSubtext}>
                오늘도 건강한 하루 되세요 ✨
            </Text>
            </View>
        </AnimatedSection>

        {/* Quick Actions */}
        <AnimatedSection index={3} shouldAnimate={!hasAnimatedOnce}>
            <View style={styles.quickActionsContainer}>
                <TouchableOpacity style={styles.quickActionCard} onPress={() => onQuickActionPress('History')} activeOpacity={0.8}>
                    <Text style={styles.quickActionIcon}>💊</Text>
                    <Text style={styles.quickActionText}>복용 기록</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionCard} onPress={() => onQuickActionPress('Settings')} activeOpacity={0.8}>
                    <Text style={styles.quickActionIcon}>⏰</Text>
                    <Text style={styles.quickActionText}>알림 설정</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionCard} onPress={() => onQuickActionPress('Stats')} activeOpacity={0.8}>
                    <Text style={styles.quickActionIcon}>📊</Text>
                    <Text style={styles.quickActionText}>통계 보기</Text>
                </TouchableOpacity>
            </View>
        </AnimatedSection>

        {/* Calendar Section */}
        <AnimatedSection index={4} shouldAnimate={!hasAnimatedOnce}>
            <CalendarComponent />
        </AnimatedSection>

        {/* Interaction Risk Section */}
        <AnimatedSection index={5} shouldAnimate={!hasAnimatedOnce}>
            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>상호작용 안전도</Text>
                    <Text style={styles.sectionSubtitle}>현재 복용 중인 약물들의 안전성</Text>
                </View>
                <View style={styles.card}>
                    <View style={styles.interactionRiskContent}>
                        <View style={styles.circularGaugeContainer}>
                        <CircularGauge value={selectedId && FAMILY_INTERACTION_DATA[selectedId] ? FAMILY_INTERACTION_DATA[selectedId].riskScore : INTERACTION_DATA.riskScore} size={100} />
                        </View>
                        <View style={styles.interactionRiskGroupsWrapper}>
                        <InteractionRiskGroups
                          dangerousCount={selectedId && FAMILY_INTERACTION_DATA[selectedId] ? FAMILY_INTERACTION_DATA[selectedId].dangerousCount : INTERACTION_DATA.dangerousCount}
                          safeCount={selectedId && FAMILY_INTERACTION_DATA[selectedId] ? FAMILY_INTERACTION_DATA[selectedId].safeCount : INTERACTION_DATA.safeCount}
                        />
                        </View>
                    </View>
                </View>
            </View>
        </AnimatedSection>

        {/* Health News Section */}
        <AnimatedSection index={6} shouldAnimate={!hasAnimatedOnce}>
            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>건강 뉴스</Text>
                    <Text style={styles.sectionSubtitle}>{USER_NAME}님을 위한 맞춤 정보</Text>
                </View>
                <TouchableOpacity style={styles.card} activeOpacity={0.8}>
                    <View style={styles.newsContentWrapper}>
                        <View style={styles.newsImagePlaceholder}>
                            <Text style={styles.newsEmoji}>📰</Text>
                        </View>
                        <View style={styles.newsContent}>
                            <Text style={styles.newsTitle}>겨울철 감기 예방을 위한 영양제 복용법</Text>
                            <Text style={styles.newsSubtitle}>면역력 강화를 위한 비타민 D, C 섭취 가이드</Text>
                            <Text style={styles.newsDate}>2시간 전</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </AnimatedSection>
      </ScrollView>
      <BottomNavigationBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f7f8fa', // Slightly off-white background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  greetingContainer: {
    marginVertical: 20,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  greetingHighlight: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  greetingSubtext: {
    fontSize: 15,
    color: Colors.mediumGray,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#aab4c1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eef0f3'
  },
  quickActionIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.mediumGray,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#aab4c1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eef0f3'
  },
  interactionRiskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  circularGaugeContainer: {
    alignItems: 'center',
    marginRight: 20,
  },
  interactionRiskGroupsWrapper: {
    flex: 1,
  },
  newsContentWrapper: {
    flexDirection: 'row',
  },
  newsImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  newsEmoji: {
    fontSize: 30,
  },
  newsContent: {
    flex: 1,
    justifyContent: 'center',
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  newsSubtitle: {
    fontSize: 14,
    color: Colors.mediumGray,
    lineHeight: 20,
  },
  newsDate: {
    fontSize: 12,
    color: Colors.mediumGray,
    fontWeight: '500',
    marginTop: 8,
  },
});