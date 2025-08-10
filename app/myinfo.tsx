import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import BottomNavigationBar from '../components/BottomNavigationBar';
import FamilyGroup from '../components/FamilyGroup';

const PROFILE_DATA = [
  { id: '1', name: '오말숙' },
  { id: '2', name: '남지윤' },
  { id: '3', name: '홍준우' },
  { id: '4', name: '이수아' },
];

function OverlappingAvatars() {
  return (
    <View style={styles.avatarsRow}>
      {PROFILE_DATA.map((item, idx) => (
        <View
          key={item.id}
          style={[styles.avatar, { left: idx * 28, zIndex: PROFILE_DATA.length - idx }]} // 겹침 효과
        />
      ))}
    </View>
  );
}

export default function MyInfoScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>내 정보</Text>
        <Text style={styles.subtitle}>프로필 및 설정</Text>
        <OverlappingAvatars />
        <View style={styles.familyGroupWrapper}>
          <FamilyGroup />
        </View>
      </View>
      <BottomNavigationBar activeIndex={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.mediumGray,
  },
  familyGroupWrapper: {
    marginTop: 40,
    marginBottom: 24,
    alignItems: 'center',
    width: '100%',
  },
  avatarsRow: {
    flexDirection: 'row',
    marginTop: 24,
    marginBottom: 8,
    height: 44,
    position: 'relative',
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D9D9D9',
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#fff',
  },
});