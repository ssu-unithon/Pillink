import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import PrimaryButton from '@/components/PrimaryButton';
import FamilyService from '@/services/FamilyService';

const CreateFamily = () => {
  const [familyName, setFamilyName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();

  const validateFamilyName = (name: string) => {
    return name.trim().length >= 2 && name.trim().length <= 20;
  };

  const handleCreateFamily = async () => {
    setError('');
    
    if (!familyName.trim()) {
      setError('가족 그룹 이름을 입력해주세요.');
      return;
    }
    
    if (!validateFamilyName(familyName)) {
      setError('가족 그룹 이름은 2자 이상 20자 이하로 입력해주세요.');
      return;
    }
    
    setLoading(true);
    try {
      console.log('🔄 Creating family group:', familyName.trim());
      
      // API를 통한 가족 그룹 생성
      const result = await FamilyService.createFamily(familyName.trim());
      console.log('✅ Family group created successfully:', result);
      
      // 성공적으로 생성된 경우
      Alert.alert(
        '가족 그룹 생성 완료', 
        `'${familyName.trim()}' 그룹이 생성되었습니다.\n\n이제 가족 구성원을 초대할 수 있습니다.`,
        [
          {
            text: '확인',
            onPress: () => router.replace('/myinfo') // replace로 뒤로가기 방지
          }
        ]
      );
    } catch (error: any) {
      console.error('❌ Failed to create family group:', error);
      
      // 에러 메시지 세분화
      let errorMessage = '가족 그룹 생성에 실패했습니다. 다시 시도해주세요.';
      
      if (error.message?.includes('400')) {
        errorMessage = '이미 가족 그룹에 속해 있거나 유효하지 않은 이름입니다.';
      } else if (error.message?.includes('409')) {
        errorMessage = '이미 같은 이름의 가족 그룹이 존재합니다.';
      } else if (error.message?.includes('403')) {
        errorMessage = '가족 그룹 생성 권한이 없습니다.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>가족 그룹 생성</Text>
        <View style={{ width: 40, height: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 설명 섹션 */}
        <View style={styles.descriptionSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="people" size={64} color={Colors.primary} />
          </View>
          <Text style={styles.title}>새 가족 그룹 만들기</Text>
          <Text style={styles.description}>
            가족 구성원들과 함께 약물을 관리할 수 있는{'\n'}가족 그룹을 생성합니다
          </Text>
        </View>

        {/* 입력 폼 섹션 */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>가족 그룹 이름</Text>
            <TextInput
              style={[
                styles.input, 
                focusedField === 'familyName' && styles.inputFocused,
                error && !familyName.trim() ? styles.inputError : null
              ]}
              placeholder="예: 김씨네 가족, 우리 가족"
              placeholderTextColor={Colors.mediumGray}
              value={familyName}
              onChangeText={setFamilyName}
              onFocus={() => setFocusedField('familyName')}
              onBlur={() => setFocusedField(null)}
              returnKeyType="done"
              onSubmitEditing={handleCreateFamily}
              maxLength={20}
            />
            <Text style={styles.charCount}>{familyName.length}/20</Text>
          </View>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoText}>
                • 가족 그룹을 생성하면 관리자가 됩니다{'\n'}
                • 다른 가족 구성원을 초대할 수 있습니다{'\n'}
                • 서로의 약물 복용을 관리하고 알림을 받을 수 있습니다
              </Text>
            </View>
          </View>
        </View>

        {/* 예시 그룹명 섹션 */}
        <View style={styles.exampleSection}>
          <Text style={styles.exampleTitle}>추천 그룹명</Text>
          <View style={styles.exampleChips}>
            {['우리 가족', '김씨네 집안', '행복한 가정', '건강 가족'].map((example) => (
              <TouchableOpacity
                key={example}
                style={styles.exampleChip}
                onPress={() => setFamilyName(example)}
                activeOpacity={0.7}
              >
                <Text style={styles.exampleChipText}>{example}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomContainer}>
        <PrimaryButton
          title="가족 그룹 생성"
          onPress={handleCreateFamily}
          loading={loading}
          disabled={loading || !familyName.trim()}
          style={[
            styles.createButton,
            (!familyName.trim() || loading) && styles.createButtonDisabled
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  descriptionSection: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  formSection: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
    position: 'relative',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.card,
    paddingRight: 50,
  },
  inputFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
    shadowColor: Colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: Colors.danger,
    backgroundColor: '#FFF5F5',
  },
  charCount: {
    position: 'absolute',
    right: 16,
    top: 40,
    fontSize: 12,
    color: Colors.mediumGray,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    marginBottom: 16,
    marginLeft: 4,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    marginTop: 8,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  exampleSection: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  exampleChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exampleChip: {
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exampleChipText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  createButton: {
    backgroundColor: Colors.primary,
    minHeight: 54,
  },
  createButtonDisabled: {
    backgroundColor: Colors.lightGray,
  },
});

export default CreateFamily;