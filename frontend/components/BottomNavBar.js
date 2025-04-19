import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const navItems = [
  { name: 'Home', icon: 'home-outline', route: 'UserDashboard' },
  { name: 'Medications', icon: 'medkit-outline', route: 'Medications' },
  { name: 'Appointments', icon: 'calendar-outline', route: 'Appointments' },
  { name: 'Voice', icon: 'mic-outline', route: 'Voice' },
  { name: 'Settings', icon: 'settings-outline', route: 'Settings' },
];

const BottomNavBar = ({ navigation, activeRoute }) => (
  <View style={styles.container}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={styles.tabItem}
          onPress={() => navigation.navigate(item.route)}
        >
          <Ionicons
            name={item.icon}
            size={22}
            color={activeRoute === item.route ? '#222' : '#888'}
          />
          <Text style={[styles.tabText, { color: activeRoute === item.route ? '#222' : '#888' }]}> 
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
);


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
    height: 60,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  tabText: {
    fontSize: 10,
    marginTop: 2,
    color: '#858585',
    fontWeight: '500',
    textAlign: 'center',
    includeFontPadding: false,
  },
});

export default BottomNavBar;
