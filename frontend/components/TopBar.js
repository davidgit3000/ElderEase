import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TopBar = ({ title = 'MedicRemind', onProfilePress, onBellPress }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.icons}>
      <TouchableOpacity onPress={onBellPress} style={styles.iconBtn}>
        <Ionicons name="notifications-outline" size={22} color="#444" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onProfilePress} style={styles.iconBtn}>
        <Image source={require('../assets/profile.png')} style={styles.avatar} />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
    backgroundColor: '#fff',
    minHeight: 44,
    height: 44,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    marginLeft: 12,
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#eee',
  },
});

export default TopBar;
