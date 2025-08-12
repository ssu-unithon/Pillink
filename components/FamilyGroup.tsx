import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function FamilyAvatar({ name, active, style }: { name: string; active?: boolean; style?: any }) {
  return (
    <View style={[styles.circle, active && styles.avatarActive, style]}>
      <Text style={[styles.avatarText, { textAlignVertical: 'center' }]}>{name[0]}</Text>
    </View>
  );
}

const FamilyListItem = ({ item }: { item: any }) => {
  const router = useRouter();

  if (item.type === 'invite') {
    return (
      <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => router.push('/invite-family-member')}>
        <View style={styles.inviteCircle}>
          <Ionicons name="add" size={24} color="#4285F4" />
        </View>
        <Text style={styles.inviteText}>초대하기</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.7}
      onPress={() => router.push(`/family/${item.id}`)}
    >
      <FamilyAvatar name={item.name} active={item.active} />
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.iconContainer}>
        {item.active ? (
          <View style={styles.notificationBadge}>
            <Ionicons name="notifications" size={20} color="#10B981" />
          </View>
        ) : (
          <View style={styles.notificationBadgeOff}>
            <MaterialIcons name="notifications-off" size={20} color="#EF4444" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const FamilyGroup = ({ data, showAvatars = true, onSelectMember, selectedId }: { data: any[], showAvatars?: boolean, onSelectMember?: (id: string) => void, selectedId?: string | null }) => {
  const router = useRouter();

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'invite') {
      return (
        <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => router.push('/invite-family-member')}>
          <View style={styles.inviteCircle}>
            <Ionicons name="add" size={24} color="#4285F4" />
          </View>
          <Text style={styles.inviteText}>초대하기</Text>
        </TouchableOpacity>
      );
    }
    return (
      <View style={styles.row}>
        {showAvatars && (
          <FamilyAvatar name={item.name} active={selectedId === item.id} />
        )}
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={0.7}
          onPress={() => {
            onSelectMember?.(item.id);
            AsyncStorage.setItem('selected_family_id', item.id);
          }}
        >
          <Text style={styles.name}>{item.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => router.push(`/family/${item.id}`)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="settings" size={20} color="#9CA3AF" />
        </TouchableOpacity>
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
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    width: 320,
    alignSelf: 'center',
    marginHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    minHeight: 64,
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  inviteCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#E3F2FD',
    borderStyle: 'dashed',
  },
  inviteText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#4285F4',
    letterSpacing: -0.2,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
    color: '#1F2937',
    letterSpacing: -0.2,
  },
  iconContainer: {
    marginLeft: 12,
    padding: 4,
  },
  notificationBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeOff: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 84,
    marginRight: 20,
  },
  avatarActive: {
    borderColor: '#4285F4',
    borderWidth: 3,
    backgroundColor: '#F0F8FF',
  },
  avatarText: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  selectedRow: {
    backgroundColor: '#E0F2FE',
  },
  selectedAvatar: {
    borderColor: '#1877F2',
    borderWidth: 3,
    backgroundColor: '#1877F2',
  },
});

export default FamilyGroup;
