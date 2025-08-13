import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import StepHeader from '@/components/signup/StepHeader';
import ProgressBar from '@/components/signup/ProgressBar';
import PrimaryButton from '@/components/PrimaryButton';
import {Colors} from '@/constants/Colors';

const AnimatedCheckbox = ({ isChecked, onPress, size = 24, style = {} }) => {
  const scaleAnim = useRef(new Animated.Value(isChecked ? 1 : 0.8)).current;
  const opacityAnim = useRef(new Animated.Value(isChecked ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isChecked ? 1.05 : 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: isChecked ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (isChecked) {
        Animated.spring(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }).start();
      }
    });
  }, [isChecked]);

  return (
    <TouchableOpacity onPress={onPress} style={[styles.checkboxContainer, style]}>
      <Animated.View
        style={[
          styles.checkbox,
          {
            transform: [{ scale: scaleAnim }],
            borderColor: isChecked ? Colors.primary : '#9CA3AF',
            backgroundColor: isChecked ? Colors.primary : 'transparent',
          },
        ]}
      >
        {isChecked && (
          <Animated.View style={{ opacity: opacityAnim }}>
            <Ionicons name="checkmark" size={size * 0.7} color="#fff" />
          </Animated.View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function SignupTerms() {
  const router = useRouter();
  const { role } = useLocalSearchParams();
  const [allAgreed, setAllAgreed] = useState(false);
  const [agreed, setAgreed] = useState([false, false, false, false]);

  // 역할 파라미터 검증
  useEffect(() => {
    console.log('📝 Terms screen - received role:', role);
    if (!role) {
      console.warn('⚠️ No role parameter received');
    }
  }, [role]);
  const terms = [
    '개인정보 처리 목적',
    '개인정보처리및보유기간',
    '이용기간',
    '처리하는 개인정보의 항목',
  ];

  const handleAllAgree = () => {
    const newValue = !allAgreed;
    setAllAgreed(newValue);
    setAgreed(agreed.map(() => newValue));
  };
  const handleAgree = idx => {
    const newAgreed = [...agreed];
    newAgreed[idx] = !newAgreed[idx];
    setAgreed(newAgreed);
    setAllAgreed(newAgreed.every(Boolean));
  };

  const handleNext = () => {
    try {
      console.log('🔄 Proceeding to user-info with role:', role);
      if (!allAgreed) {
        Alert.alert('알림', '모든 약관에 동의해야 다음 단계로 진행할 수 있습니다.');
        return;
      }
      const roleParam = role || 'patient'; // 기본값 설정
      router.push(`/signup/user-info?role=${roleParam}`);
    } catch (error) {
      console.error('❌ Navigation error:', error);
      Alert.alert('오류', '다음 단계로 이동하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <StepHeader title="약관동의" subtitle="서비스 이용을 위해 약관에 동의해주세요" />
      <ProgressBar progress={60} steps={["소셜", "역할", "약관", "정보", "완료"]} currentStep={2} />

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.termRow}>
            <AnimatedCheckbox
              isChecked={allAgreed}
              onPress={handleAllAgree}
              size={28}
              style={{ marginRight: 16 }}
            />
            <Text style={[styles.allAgreeText, { color: Colors.primary, fontWeight: 'bold' }]}>전체 약관에 동의합니다</Text>
          </View>
          <View style={styles.divider} />
          {terms.map((t, i) => (
            <View style={styles.termRow} key={i}>
              <AnimatedCheckbox
                isChecked={agreed[i]}
                onPress={() => handleAgree(i)}
                size={24}
                style={{ marginRight: 12 }}
              />
              <Text style={styles.termText}>(필수) {t}</Text>
              <TouchableOpacity style={styles.detailBtn}>
                <Text style={styles.detailBtnText}>상세보기</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <Text style={styles.guideText}>모든 약관에 동의해야 다음 단계로 이동할 수 있습니다.</Text>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <PrimaryButton title="다음" onPress={handleNext} disabled={!allAgreed} style={allAgreed ? styles.nextBtn : styles.nextBtnDisabled} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkBoxBtn: {
    marginRight: 12,
    padding: 4,
  },
  allAgreeText: {
    fontSize: 18,
    color: Colors.primary,
  },
  termText: {
    fontSize: 15,
    color: Colors.text,
    flex: 1,
  },
  detailBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  detailBtnText: {
    color: Colors.mediumGray,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 10,
  },
  guideText: {
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  nextBtn: {
    backgroundColor: Colors.primary,
  },
  nextBtnDisabled: {
    backgroundColor: Colors.lightGray,
  },
  checkboxContainer: {
    padding: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
