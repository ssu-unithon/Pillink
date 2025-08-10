import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';

interface InteractionRiskGroupsProps {
  onGroupPress?: (groupType: 'duplicate' | 'risk' | 'safe') => void;
  interactable?: boolean;
  selectedGroup?: 'duplicate' | 'risk' | 'safe' | null;
}

const InteractionRiskGroups = ({ onGroupPress, interactable = false, selectedGroup = null }: InteractionRiskGroupsProps) => {
  // Card data configuration
  // Order: 중복, 위험, 안전
  const groups = [
    {
      key: 'duplicate' as const,
      title: '중복',
      count: '0건',
      pillBg: Colors.primaryLight,
      pillColor: Colors.primary,
      activeBg: '#6666FF',
      activeTextColor: '#E6E6FF',
    },
    {
      key: 'risk' as const,
      title: '위험',
      count: '1건',
      pillBg: Colors.dangerLight,
      pillColor: Colors.danger,
      activeBg: '#FF5050',
      activeTextColor: '#FFD9D9',
    },
    {
      key: 'safe' as const,
      title: '안전',
      count: '1건',
      pillBg: Colors.secondaryLight,
      pillColor: Colors.secondary,
      activeBg: '#2DB67D',
      activeTextColor: '#D9F2E6',
    },
  ];

  return (
    <View>
      <View style={styles.groupsContainer}>
        {groups.map(({ key, title, count, pillBg, pillColor, activeBg, activeTextColor }) => {
          const countValue = parseInt(count);
          const isClickable = interactable && countValue > 0;
          const isSelected = selectedGroup === key;
          const isInactive = selectedGroup && selectedGroup !== key;

          const CardComponent = isClickable ? TouchableOpacity : View;

          return (
            <CardComponent
              key={key}
              style={[
                styles.groupCard,
                isClickable && styles.clickableCard,
                isSelected && { backgroundColor: activeBg },
                isInactive && { opacity: 0.4 },
              ]}
              onPress={isClickable ? () => onGroupPress?.(key) : undefined}
              activeOpacity={isClickable ? 0.8 : 1}
            >
              <View style={[
                styles.pill,
                { backgroundColor: isSelected ? activeTextColor : pillBg }
              ]}>
                <Text style={[
                  styles.pillText,
                  { color: isSelected ? activeBg : pillColor }
                ]}>
                  {title}
                </Text>
              </View>
              <Text style={[
                styles.groupCount,
                !isClickable && countValue === 0 && styles.disabledCount,
                { color: isSelected ? '#fff' : '#222' }
              ]}>
                {count}
              </Text>
            </CardComponent>
          );
        })}
      </View>
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