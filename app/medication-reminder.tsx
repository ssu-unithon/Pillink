import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Alert,
  Platform,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlarmService from '@/services/AlarmService';
import * as Haptics from 'expo-haptics';
import { useDeveloperMode } from '@/contexts/DevModeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MedicationReminderData {
  id: number;
  name: string;
  dosage: string;
  time: string;
  image_url?: string;
  count: number;
  itemSeq?: string;
  is_enabled: boolean;
}

export default function MedicationReminderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentMedications, setCurrentMedications] = useState<MedicationReminderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMedicationId, setSelectedMedicationId] = useState<number | null>(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // 애니메이션 시작
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    fetchCurrentAlarms();
  }, []);

  const fetchCurrentAlarms = async () => {
    try {
      setIsLoading(true);
      
      // 선택된 가족 ID 가져오기
      const selectedId = await AsyncStorage.getItem('selected_family_id');
      const targetId = selectedId ? parseInt(selectedId) : undefined;
      
      // 현재 시간 기준으로 복용해야 할 알림들 가져오기
      const alarms = await AlarmService.getAlarms(targetId);
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      
      // 현재 시간 근처의 알림들 필터링 (±1시간)
      const relevantAlarms = alarms.filter(alarm => {
        const alarmTime = alarm.hour * 60 + alarm.minute;
        const currentTimeMinutes = currentHour * 60 + currentMinute;
        const timeDiff = Math.abs(alarmTime - currentTimeMinutes);
        
        return alarm.is_enabled && (timeDiff <= 60 || timeDiff >= 1380); // 1시간 이내 또는 23시간 이후(다음날 1시간 전)
      });

      const medications: MedicationReminderData[] = relevantAlarms.map(alarm => ({
        id: alarm.id,
        name: alarm.name || '약물',
        dosage: `${alarm.count || 1}정`,
        time: AlarmService.formatTime(alarm.hour, alarm.minute),
        image_url: alarm.detail?.itemImage || undefined,
        count: alarm.count || 1,
        itemSeq: alarm.itemSeq,
        is_enabled: alarm.is_enabled
      }));

      setCurrentMedications(medications);
    } catch (error) {
      console.error('Failed to fetch current alarms:', error);
      Alert.alert('오류', '알림 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMedicationTaken = async (medicationId: number) => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // 복용 확인 로직 (필요시 API 호출)
      const today = new Date();
      const month = today.getMonth() + 1;
      const date = today.getDate();
      
      // 복용 기록 API 호출 (예시)
      // await fetch('/intake-log/check', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     month,
      //     date,
      //     alarmId: medicationId
      //   })
      // });

      // 복용 완료 표시
      setSelectedMedicationId(medicationId);
      
      setTimeout(() => {
        setCurrentMedications(prev => 
          prev.filter(med => med.id !== medicationId)
        );
        setSelectedMedicationId(null);
      }, 1500);

    } catch (error) {
      console.error('Failed to mark medication as taken:', error);
      Alert.alert('오류', '복용 기록에 실패했습니다.');
    }
  };

  const handleSkipMedication = (medicationId: number) => {
    Alert.alert(
      '복용 건너뛰기',
      '이 약물의 복용을 건너뛰시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '건너뛰기',
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setCurrentMedications(prev => 
              prev.filter(med => med.id !== medicationId)
            );
          }
        }
      ]
    );
  };

  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '좋은 아침이에요! ☀️';
    if (hour < 18) return '좋은 오후에요! 🌤️';
    return '좋은 저녁이에요! 🌙';
  };

  const renderMedicationCard = (medication: MedicationReminderData, index: number) => {
    const isCompleted = selectedMedicationId === medication.id;
    
    return (
      <Animated.View
        key={medication.id}
        style={[
          styles.medicationCard,
          isCompleted && styles.completedCard,
          {
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, index * 10],
                })
              }
            ]
          }
        ]}
      >
        <View style={styles.medicationContent}>
          <View style={styles.medicationImageContainer}>
            {medication.image_url ? (
              <Image
                source={{ uri: medication.image_url }}
                style={styles.medicationImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.medicationImagePlaceholder}>
                <MaterialIcons name="medication" size={32} color={Colors.primary} />
              </View>
            )}
          </View>
          
          <View style={styles.medicationInfo}>
            <Text style={styles.medicationName}>{medication.name}</Text>
            <Text style={styles.medicationDosage}>{medication.dosage}</Text>
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={16} color={Colors.mediumGray} />
              <Text style={styles.medicationTime}>{medication.time}</Text>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            {isCompleted ? (
              <View style={styles.completedButton}>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text style={styles.completedText}>복용 완료</Text>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={() => handleSkipMedication(medication.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close-outline" size={20} color={Colors.mediumGray} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.takeButton}
                  onPress={() => handleMedicationTaken(medication.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="checkmark" size={20} color="#fff" />
                  <Text style={styles.takeButtonText}>복용</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>복용 알림</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.greetingSection, { opacity: fadeAnim }]}>
          <Text style={styles.greetingText}>{getCurrentTimeGreeting()}</Text>
          <Text style={styles.greetingSubtext}>복용할 시간이 되었습니다</Text>
        </Animated.View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>알림을 불러오는 중...</Text>
          </View>
        ) : currentMedications.length > 0 ? (
          <Animated.View style={[styles.medicationsContainer, { opacity: fadeAnim }]}>
            <Text style={styles.sectionTitle}>
              지금 복용해야 할 약물 ({currentMedications.length}개)
            </Text>
            {currentMedications.map((medication, index) => 
              renderMedicationCard(medication, index)
            )}
          </Animated.View>
        ) : (
          <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
            <MaterialIcons name="medication" size={64} color={Colors.lightGray} />
            <Text style={styles.emptyTitle}>복용할 약물이 없습니다</Text>
            <Text style={styles.emptySubtext}>
              현재 시간에 복용해야 할 약물이 없어요.{'\n'}
              알림 설정을 확인해보세요!
            </Text>
            <TouchableOpacity
              style={styles.addMedicationButton}
              onPress={() => router.push('/medication-input')}
              activeOpacity={0.8}
            >
              <Text style={styles.addMedicationText}>약물 추가하기</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* 하단 도움말 */}
        <Animated.View style={[styles.helpSection, { opacity: fadeAnim }]}>
          <View style={styles.helpCard}>
            <MaterialIcons name="lightbulb-outline" size={20} color={Colors.primary} />
            <Text style={styles.helpText}>
              복용 시간을 놓쳤어도 괜찮아요. 가능한 빨리 복용하고 다음 복용 시간을 지켜주세요.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  greetingSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  greetingSubtext: {
    fontSize: 16,
    color: Colors.mediumGray,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.mediumGray,
  },
  medicationsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  medicationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  completedCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  medicationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationImageContainer: {
    marginRight: 16,
  },
  medicationImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  medicationImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary + '20',
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  medicationDosage: {
    fontSize: 14,
    color: Colors.mediumGray,
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationTime: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  skipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  takeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 4,
  },
  takeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  completedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 4,
  },
  completedText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: Colors.mediumGray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  addMedicationButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  addMedicationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  helpSection: {
    marginTop: 20,
  },
  helpCard: {
    flexDirection: 'row',
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  helpText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginLeft: 12,
  },
});