import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import PrimaryButton from '../components/PrimaryButton';
import TextButton from '../components/TextButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const ONBOARDING_COMPLETED_KEY = 'onboarding_completed';

const onboardingData = [
  {
    id: 1,
    title: "안전한 복용을 위한\n스마트 가이드",
    subtitle: "약물 상호작용을 미리 확인하고\n안전하게 복용하세요",
    icon: "💊",
    backgroundColor: Colors.light.primaryLight,
    buttonColor: Colors.light.primary,
  },
  {
    id: 2,
    title: "AI 기반\n맞춤형 건강관리",
    subtitle: "개인의 복용 패턴을 분석하여\n최적의 건강 관리를 제공합니다",
    icon: "🤖",
    backgroundColor: Colors.light.secondaryLight,
    buttonColor: Colors.light.secondary,
  },
  {
    id: 3,
    title: "간편한 복용 기록과\n알림 서비스",
    subtitle: "복용 시간을 놓치지 않도록\n스마트하게 관리해드립니다",
    icon: "⏰",
    backgroundColor: Colors.light.dangerLight,
    buttonColor: Colors.light.danger,
  }
];

const OnboardingItem = ({ item }: { item: typeof onboardingData[0] }) => {
    return (
        <View style={styles.itemContainer}>
            <View style={[styles.iconContainer, { backgroundColor: item.backgroundColor }]}>
                <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
        </View>
    );
};

const Paginator = ({ data, currentIndex }: { data: any[], currentIndex: number }) => {
    return (
        <View style={styles.pageIndicator}>
            {data.map((item, i) => {
                return <View key={i.toString()} style={[styles.dot, { backgroundColor: i === currentIndex ? item.buttonColor : Colors.light.lightGray }]} />;
            })}
        </View>
    );
};

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      router.replace('/');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/');
    }
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
        slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
        completeOnboarding();
    }
  };

  const getItemLayout = (_: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  const currentItem = onboardingData[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { top: insets.top + 10 }]}>
        <TextButton
          title="건너뛰기"
          onPress={completeOnboarding}
          color={Colors.light.mediumGray}
          fontSize={16}
        />
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={onboardingData}
        renderItem={({ item }) => <OnboardingItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
        getItemLayout={getItemLayout}
      />

      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 20 }]}>
        <Paginator data={onboardingData} currentIndex={currentIndex} />
        <PrimaryButton
          title={currentIndex === onboardingData.length - 1 ? '시작하기' : '다음'}
          onPress={handleNext}
          backgroundColor={currentItem.buttonColor}
          width={width - 60}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    top: 50, // Adjusted for safe area
  },
  itemContainer: {
    width: width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 120,
  },
  iconContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  icon: {
    fontSize: 70,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    color: Colors.light.mediumGray,
  },
  pageIndicator: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingTop: 20, // Use paddingTop instead of paddingVertical
    alignItems: 'center',
  },
});