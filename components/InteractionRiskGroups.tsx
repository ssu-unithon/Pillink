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
});

export default InteractionRiskGroups;