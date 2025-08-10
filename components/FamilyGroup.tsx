import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const FamilyListItem = ({ item }: { item: any }) => {
  if (item.type === 'invite') {
    return (
      <TouchableOpacity style={styles.row}>
        <View style={styles.circle}>
          <Ionicons name="add" size={28} color="#4285F4" />
        </View>
        <Text style={[styles.inviteText, { color: '#4285F4' }]}>초대하기</Text>
      </TouchableOpacity>
    );
  }
  return (
    <View style={styles.row}>
      <View style={styles.circle} />
      <Text style={styles.name}>{item.name}</Text>
      {item.active ? (
        <Ionicons name="notifications" size={22} color="#3CB371" style={styles.icon} />
      ) : (
        <MaterialIcons name="notifications-off" size={22} color="#F44336" style={styles.icon} />
      )}
    </View>
  );
};

const FamilyGroup = ({ data }: { data: any[] }) => {
  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'invite') {
      return (
        <TouchableOpacity style={styles.row}>
          <View style={styles.circle}>
            <Ionicons name="add" size={28} color="#4285F4" />
          </View>
          <Text style={[styles.inviteText, { color: '#4285F4' }]}>초대하기</Text>
        </TouchableOpacity>
      );
    }
    return (
      <View style={styles.row}>
        <View style={styles.circle} />
        <Text style={styles.name}>{item.name}</Text>
        {item.active ? (
          <Ionicons name="notifications" size={22} color="#3CB371" style={styles.icon} />
        ) : (
          <MaterialIcons name="notifications-off" size={22} color="#F44336" style={styles.icon} />
        )}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    width: 280,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  inviteText: {
    fontSize: 16,
    fontWeight: '500',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  icon: {
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 76,
  },
});

export default FamilyGroup;
