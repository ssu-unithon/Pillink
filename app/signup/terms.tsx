import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import StepHeader from '@/components/signup/StepHeader';
import ProgressBar from '@/components/signup/ProgressBar';
import PrimaryButton from '@/components/PrimaryButton';
import {Colors} from '@/constants/Colors';

const AnimatedCheckbox = ({ isChecked, onPress, size = 24, style = {} }) => {
  const scaleAnim = useRef(new Animated.Value(isChecked ? 1 : 0.8)).current;
  const colorAnim = useRef(new Animated.Value(isChecked ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isChecked ? 1.1 : 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(colorAnim, {
        toValue: isChecked ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
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

  const animatedColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(156, 163, 175, 1)', Colors.primary],
  });

  return (
    <TouchableOpacity onPress={onPress} style={[styles.checkboxContainer, style]}>
      <Animated.View
        style={[
          styles.checkbox,
          {
            transform: [{ scale: scaleAnim }],
            borderColor: animatedColor,
            backgroundColor: isChecked ? Colors.primary : 'transparent',
          },
        ]}
      >
        {isChecked && (
          <Animated.View style={{ opacity: colorAnim }}>
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
        <PrimaryButton title="다음" onPress={() => router.push(`/signup/user-info?role=${role}`)} disabled={!allAgreed} style={allAgreed ? styles.nextBtn : styles.nextBtnDisabled} />
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
