import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';

interface InteractionRiskGroupsProps {
  onGroupPress?: (groupType: 'duplicate' | 'risk' | 'safe') => void;
  interactable?: boolean;
}

const InteractionRiskGroups = ({ onGroupPress, interactable = false }: InteractionRiskGroupsProps) => {
  // Card data configuration
  // Order: 중복, 위험, 안전
  const groups = [
    {
      key: 'duplicate' as const,
      title: '중복',
      count: '0건',
      pillBg: Colors.light.primaryLight,
      pillColor: Colors.light.primary,
    },
    {
      key: 'risk' as const,
      title: '위험',
      count: '1건',
      pillBg: Colors.light.dangerLight,
      pillColor: Colors.light.danger,
    },
    {
      key: 'safe' as const,
      title: '안전',
      count: '1건',
      pillBg: Colors.light.secondaryLight,
      pillColor: Colors.light.secondary,
    },
  ];

  return (
    <View style={styles.groupsContainer}>
      {groups.map(({ key, title, count, pillBg, pillColor }) => {
        const countValue = parseInt(count);
        const isClickable = interactable && countValue > 0;

        const CardComponent = isClickable ? TouchableOpacity : View;

        return (
          <CardComponent
            key={key}
            style={[styles.groupCard, isClickable && styles.clickableCard]}
            onPress={isClickable ? () => onGroupPress?.(key) : undefined}
            activeOpacity={isClickable ? 0.8 : 1}
          >
            <View style={[styles.pill, { backgroundColor: pillBg }]}>
              <Text style={[styles.pillText, { color: pillColor }]}>{title}</Text>
            </View>
            <Text style={[styles.groupCount, !isClickable && countValue === 0 && styles.disabledCount]}>
              {count}
            </Text>
          </CardComponent>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  groupsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginVertical: 8,
  },
  groupCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20, // 더 둥글게
    paddingVertical: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  clickableCard: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  pill: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 8,
    minWidth: 48,
    alignItems: 'center',
  },
  pillText: {
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  groupCount: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
    marginTop: 2,
  },
  disabledCount: {
    color: '#999',
  },
});

export default InteractionRiskGroups;