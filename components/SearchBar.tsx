import React from 'react';
import { View, TextInput, StyleSheet, Image } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function SearchBar({ value, onChangeText, placeholder = '복용하시는 약을 등록해보세요' }: {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://img.icons8.com/ios-filled/50/888888/search--v1.png' }}
        style={styles.icon}
        resizeMode="contain"
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.mediumGray}
        value={value}
        onChangeText={onChangeText}
        underlineColorAndroid="transparent"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 8,
    tintColor: '#888',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
});

