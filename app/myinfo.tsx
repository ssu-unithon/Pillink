import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import BottomNavigationBar from '../components/BottomNavigationBar';
import FamilyGroup, { FamilyAvatar } from '../components/FamilyGroup';
import { FAMILY_DATA } from '@/constants/FamilyData';

function OverlappingAvatars({ data }: { data: any[] }) {
  const familyMembers = data.filter(item => item.id !== 'invite');
  const totalWidth = (familyMembers.length - 1) * 28 + 48; // 겹침 간격 * (개수-1) + 마지막 아바타 너비

  return (
    <View style={[styles.avatarsRow, { width: totalWidth }]}>
      {familyMembers.map((item, idx) => (
        <FamilyAvatar
          key={item.id}
          name={item.name}
          active={item.active}
          style={{ left: idx * 28, zIndex: familyMembers.length - idx, position: 'absolute' }}
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

        {/*<UserProfileSection />*/}

        <OverlappingAvatars data={FAMILY_DATA} />
        <View style={styles.familyGroupWrapper}>
          <FamilyGroup data={FAMILY_DATA} showAvatars={true} />
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
    marginTop: 16,
    marginBottom: 8,
    height: 44,
    position: 'relative',
    alignSelf: 'center', // 가운데 정렬
  },
  avatarCount: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 8,
    zIndex: 0,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarCountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    width: '90%',
  },
  userAvatar: {
    marginRight: 0,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
});