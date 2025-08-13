import React, { useEffect, useRef, useState } from 'react';
import { Text, View, ScrollView, StyleSheet, Animated, TouchableOpacity } from "react-native";
import InteractionRiskGroups from "../components/InteractionRiskGroups";
import CircularGauge from "../components/CircularGauge";
import CalendarComponent from "../components/CalendarComponent";
import { Colors } from "@/constants/Colors";
import BottomNavigationBar from "../components/BottomNavigationBar";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { INTERACTION_DATA } from "@/constants/InteractionData";
import { FAMILY_DATA } from "@/constants/FamilyData";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAMILY_INTERACTION_DATA } from "@/constants/InteractionData";
import { getLatestArticles } from "@/constants/SupplementArticles";
import { useRouter } from 'expo-router';
import UserService, { UserInfo } from '@/services/UserService';
import ChatService, { DrugInteractionAnalysis } from '@/services/ChatService';
import { useFocusEffect } from 'expo-router';

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
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('사용자'); // 기본값
  const [drugInteractionData, setDrugInteractionData] = useState<DrugInteractionAnalysis | null>(null);
  const [isLoadingRiskData, setIsLoadingRiskData] = useState(false);
  const [riskDataError, setRiskDataError] = useState<string | null>(null);
  const latestArticles = getLatestArticles(1); // 최신 아티클 1개만 가져오기

  // 사용자 정보 가져오기
  const fetchUserInfo = async () => {
    try {
      console.log('🔍 Fetching current user info...');
      const userInfo = await UserService.getCurrentUser();
      if (userInfo && userInfo.name) {
        console.log('✅ User name loaded:', userInfo.name);
        setUserName(userInfo.name);
      } else {
        console.warn('❌ No user info found');
        setUserName('사용자');
      }
    } catch (error) {
      console.error('❌ Failed to get user name:', error);
      setUserName('사용자');
    }
  };

  // 선택된 가족 ID 불러오기
  useEffect(() => {
    (async () => {
      const savedId = await AsyncStorage.getItem('selected_family_id');
      if (savedId) setSelectedId(savedId);
      else setSelectedId(FAMILY_DATA[1]?.id || null);
    })();
  }, []);

  // 약물 상호작용 데이터 가져오기
  const fetchDrugInteractionData = async (targetId?: string) => {
    try {
      setIsLoadingRiskData(true);
      setRiskDataError(null);
      console.log('🔍 Fetching drug interaction data for targetId:', targetId);
      
      const targetIdNumber = targetId ? parseInt(targetId) : undefined;
      const analysisData = await ChatService.getDrugInteractionAnalysis(targetIdNumber);
      
      console.log('✅ Drug interaction data received:', analysisData);
      setDrugInteractionData(analysisData);
    } catch (error: any) {
      console.error('❌ Failed to fetch drug interaction data:', error);
      setRiskDataError(error.message || '위험도 정보를 불러올 수 없습니다.');
      
      // 에러 발생 시 기본값 설정
      setDrugInteractionData({
        riskRate: 0,
        count: 0,
        collisionCount: 0,
        collisions: [],
        duplicateCount: 0,
        duplicates: [],
        pairCount: 0,
        warnings: [],
        errors: []
      });
    } finally {
      setIsLoadingRiskData(false);
    }
  };

  // 화면 포커스될 때마다 데이터 새로고침
  useFocusEffect(
    React.useCallback(() => {
      console.log('🔄 Home screen focused - refreshing data');
      // 사용자 정보 새로고침
      fetchUserInfo();
      
      // 약물 상호작용 데이터 새로고침
      if (selectedId) {
        console.log('🔄 Fetching drug interaction data for:', selectedId);
        fetchDrugInteractionData(selectedId);
      }
    }, [selectedId])
  );

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

        {/* Greeting Text */}
        <AnimatedSection index={2} shouldAnimate={!hasAnimatedOnce}>
            <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>
                안녕하세요, <Text style={styles.greetingHighlight}>{userName}님!</Text>
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
                        {isLoadingRiskData ? (
                          <View style={styles.loadingGauge}>
                            <Text style={styles.loadingText}>분석 중...</Text>
                          </View>
                        ) : (
                          <CircularGauge 
                            value={drugInteractionData ? drugInteractionData.riskRate : 0} 
                            size={100} 
                            title={riskDataError ? "약물 등록 필요" : undefined}
                          />
                        )}
                        </View>
                        <View style={styles.interactionRiskGroupsWrapper}>
                        <InteractionRiskGroups
                          dangerousCount={drugInteractionData ? drugInteractionData.collisionCount : 0}
                          safeCount={drugInteractionData ? (drugInteractionData.count - drugInteractionData.collisionCount) : 0}
                        />
                        {riskDataError && (
                          <Text style={styles.errorText}>
                            {riskDataError.includes('등록') ? 
                              '약물을 등록하면 상호작용을 분석해드려요' : 
                              riskDataError
                            }
                          </Text>
                        )}
                        {drugInteractionData && drugInteractionData.duplicateCount > 0 && (
                          <Text style={styles.warningText}>
                            중복 성분 {drugInteractionData.duplicateCount}개 발견
                          </Text>
                        )}
                        </View>
                    </View>
                </View>
            </View>
        </AnimatedSection>

        {/* Supplement Recommendations Section */}
        <AnimatedSection index={6} shouldAnimate={!hasAnimatedOnce}>
            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>영양제 추천</Text>
                    <Text style={styles.sectionSubtitle}>{userName}님을 위한 맞춤 건강 정보</Text>
                </View>
                {latestArticles.map((article, index) => (
                    <TouchableOpacity 
                        key={article.id}
                        style={[styles.card, index > 0 && { marginTop: 12 }]} 
                        activeOpacity={0.8}
                        onPress={() => router.push(`/supplement-article/${article.id}`)}
                    >
                        <View style={styles.articleContentWrapper}>
                            <View style={styles.articleImagePlaceholder}>
                                <Text style={styles.articleEmoji}>💊</Text>
                            </View>
                            <View style={styles.articleContent}>
                                <View style={styles.articleCategory}>
                                    <Text style={styles.articleCategoryText}>{article.category}</Text>
                                </View>
                                <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
                                <Text style={styles.articleSubtitle} numberOfLines={2}>{article.subtitle}</Text>
                                <View style={styles.articleMeta}>
                                    <Text style={styles.articleAuthor}>{article.author}</Text>
                                    <Text style={styles.articleDot}>•</Text>
                                    <Text style={styles.articleDate}>{article.publishedAt}</Text>
                                    <Text style={styles.articleDot}>•</Text>
                                    <Text style={styles.articleReadTime}>{article.readTime} 읽기</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
                
                {/* View All Articles Button */}
                <TouchableOpacity 
                    style={styles.viewAllButton} 
                    activeOpacity={0.8}
                    onPress={() => router.push('/supplement-articles')}
                >
                    <Text style={styles.viewAllText}>모든 추천 보기</Text>
                    <Text style={styles.viewAllIcon}>→</Text>
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
  articleContentWrapper: {
    flexDirection: 'row',
  },
  articleImagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  articleEmoji: {
    fontSize: 32,
  },
  articleContent: {
    flex: 1,
    justifyContent: 'center',
  },
  articleCategory: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  articleCategoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
    lineHeight: 22,
  },
  articleSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  articleAuthor: {
    fontSize: 12,
    color: Colors.mediumGray,
    fontWeight: '500',
  },
  articleDot: {
    fontSize: 12,
    color: Colors.mediumGray,
    marginHorizontal: 6,
  },
  articleDate: {
    fontSize: 12,
    color: Colors.mediumGray,
    fontWeight: '500',
  },
  articleReadTime: {
    fontSize: 12,
    color: Colors.mediumGray,
    fontWeight: '500',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  viewAllText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: 8,
  },
  viewAllIcon: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  loadingGauge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 12,
    color: Colors.mediumGray,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 8,
    fontStyle: 'italic',
  },
  warningText: {
    fontSize: 12,
    color: '#F59E0B',
    marginTop: 4,
    fontWeight: '500',
  },
});