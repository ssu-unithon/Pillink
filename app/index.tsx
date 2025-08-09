import { Text, View, ScrollView, Image, StyleSheet } from "react-native";
import InteractionRiskGroups from "../components/InteractionRiskGroups";
import CircularGauge from "../components/CircularGauge";
import CalendarComponent from "../components/CalendarComponent";
import { Colors } from "@/constants/Colors";
import BottomNavigationBar from "../components/BottomNavigationBar";
import SearchBar from '../components/SearchBar';

export default function Index() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Status Bar */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PillLink</Text>
          <View style={styles.headerIcons}>
            {/* 알림, 설정 아이콘 등 추가 가능 */}
          </View>
        </View>

        {/* Search Bar */}
        <SearchBar />

        {/* Greeting Text - 더 친근하고 명확하게 */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>
            안녕하세요, <Text style={styles.greetingHighlight}>유은정님!</Text>
          </Text>
          <Text style={styles.greetingSubtext}>
            오늘도 건강한 하루 되세요 ✨
          </Text>
        </View>

        {/* Quick Actions - 빠른 액션 버튼들 */}
        <View style={styles.quickActionsContainer}>
          <View style={styles.quickActionCard}>
            <Text style={styles.quickActionIcon}>💊</Text>
            <Text style={styles.quickActionText}>복용 기록</Text>
          </View>
          <View style={styles.quickActionCard}>
            <Text style={styles.quickActionIcon}>⏰</Text>
            <Text style={styles.quickActionText}>알림 설정</Text>
          </View>
          <View style={styles.quickActionCard}>
            <Text style={styles.quickActionIcon}>📊</Text>
            <Text style={styles.quickActionText}>통계 보기</Text>
          </View>
        </View>

        {/* Calendar Section */}
        <CalendarComponent />

        {/* Interaction Risk Section - 카드 형식 제거 */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>상호작용 안전도</Text>
            <Text style={styles.sectionSubtitle}>현재 복용 중인 약물들의 안전성</Text>
          </View>
          <View style={styles.interactionRiskContent}>
            <View style={styles.circularGaugeContainer}>
              <CircularGauge percentage={79} size={100} />
            </View>
            <View style={styles.interactionRiskGroupsWrapper}>
              <InteractionRiskGroups />
            </View>
          </View>
        </View>

        {/* Health News Section - 카드 디자인으로 개선 */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>건강 뉴스</Text>
            <Text style={styles.sectionSubtitle}>유은정님을 위한 맞춤 정보</Text>
          </View>
          <View style={styles.newsCard}>
            <View style={styles.newsImagePlaceholder}>
              <Text style={styles.newsEmoji}>📰</Text>
            </View>
            <View style={styles.newsContent}>
              <Text style={styles.newsTitle}>겨울철 감기 예방을 위한 영양제 복용법</Text>
              <Text style={styles.newsSubtitle}>면역력 강화를 위한 비타민 D, C 섭취 가이드</Text>
              <Text style={styles.newsDate}>2시간 전</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <BottomNavigationBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  greetingContainer: {
    marginVertical: 16,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  greetingHighlight: {
    color: Colors.light.primary,
    fontWeight: 'bold',
  },
  greetingSubtext: {
    fontSize: 14,
    color: Colors.light.mediumGray,
    fontWeight: '400',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.light.mediumGray,
    fontWeight: '400',
  },
  interactionRiskContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circularGaugeContainer: {
    alignItems: 'center',
    marginRight: 20,
  },
  interactionRiskGroupsWrapper: {
    flex: 1,
  },
  newsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  newsImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Colors.light.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  newsEmoji: {
    fontSize: 24,
  },
  newsContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  newsSubtitle: {
    fontSize: 14,
    color: Colors.light.mediumGray,
    lineHeight: 20,
    marginBottom: 8,
  },
  newsDate: {
    fontSize: 12,
    color: Colors.light.mediumGray,
    fontWeight: '500',
  },
});
