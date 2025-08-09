import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

const InteractionRiskGroups = () => {
  // Card data configuration
  // Order: 중복, 위험, 안전
  const groups = [
    {
      key: 'duplicate',
      title: '중복',
      count: '0건',
      pillBg: Colors.light.primaryLight,
      pillColor: Colors.light.primary,
    },
    {
      key: 'risk',
      title: '위험',
      count: '0건',
      pillBg: Colors.light.dangerLight,
      pillColor: Colors.light.danger,
    },
    {
      key: 'safe',
      title: '안전',
      count: '0건',
      pillBg: Colors.light.secondaryLight,
      pillColor: Colors.light.secondary,
    },
  ];
  return (
    <View style={styles.groupsContainer}>
      {groups.map(({ key, title, count, pillBg, pillColor }) => (
        <View key={key} style={styles.groupCard}>
          <View style={[styles.pill, { backgroundColor: pillBg }]}>
            <Text style={[styles.pillText, { color: pillColor }]}>{title}</Text>
          </View>
          <Text style={styles.groupCount}>{count}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  groupsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 0,
    marginVertical: 0,
  },
  groupCard: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  pill: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 0,
  },
  pillText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  groupCount: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.darkGray,
    marginTop: 8,
    backgroundColor: 'transparent',
  },
});

export default InteractionRiskGroups;