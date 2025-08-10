import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { INTERACTION_DATA } from '@/constants/InteractionData';

interface InteractionWarningProps {
  riskScore?: number;
  visible?: boolean;
}

const InteractionWarning: React.FC<InteractionWarningProps> = ({
  riskScore = INTERACTION_DATA.riskScore,
  visible = true
}) => {
  // 위험도에 따른 메시지와 색상 결정
  const getWarningContent = (score: number) => {
    if (score > 66) {
      return {
        title: '현재 약물 상호작용 위험 점수가 높습니다.',
        message: '반드시 의사, 약사와 상담하여 약물 변경 또는 사용 중단 여부를 결정하세요.',
        icon: 'warning',
        backgroundColor: '#FEF2F2',
        borderColor: '#EF4444',
        iconColor: '#EF4444',
        titleColor: '#DC2626',
        messageColor: '#B91C1C'
      };
    } else if (score > 33) {
      return {
        title: '약물 상호작용에 주의가 필요합니다.',
        message: '의사, 약사와 상담하여 약물 변경 또는 사용 중단 여부를 결정하세요.',
        icon: 'info',
        backgroundColor: '#FFFBEB',
        borderColor: '#F59E0B',
        iconColor: '#F59E0B',
        titleColor: '#D97706',
        messageColor: '#B45309'
      };
    } else if (score > 0) {
      return {
        title: '현재 약물 상호작용 위험도가 낮습니다.',
        message: '안전한 수준이지만 새로운 약물 복용 시 의사와 상담하세요.',
        icon: 'check-circle',
        backgroundColor: '#ECFDF5',
        borderColor: '#10B981',
        iconColor: '#10B981',
        titleColor: '#059669',
        messageColor: '#047857'
      };
    } else {
      return {
        title: '현재 약물 상호작용에 문제가 없습니다.',
        message: '완벽히 안전합니다. 새로운 약물 복용 시에만 의사와 상담하세요.',
        icon: 'verified',
        backgroundColor: '#EFF6FF',
        borderColor: '#3B82F6',
        iconColor: '#3B82F6',
        titleColor: '#1D4ED8',
        messageColor: '#1E40AF'
      };
    }
  };

  if (!visible) return null;

  const warningContent = getWarningContent(riskScore);

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: warningContent.backgroundColor,
        borderColor: warningContent.borderColor
      }
    ]}>
      <View style={styles.header}>
        <MaterialIcons
          name={warningContent.icon as any}
          size={24}
          color={warningContent.iconColor}
        />
        <Text style={[
          styles.title,
          { color: warningContent.titleColor }
        ]}>
          {warningContent.title}
        </Text>
      </View>

      <Text style={[
        styles.message,
        { color: warningContent.messageColor }
      ]}>
        {warningContent.message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 32,
  },
});

export default InteractionWarning;
