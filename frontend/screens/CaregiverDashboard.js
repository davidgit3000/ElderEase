import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';

const CaregiverDashboard = ({ navigation }) => (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f4f7' }} edges={["top","bottom"]}>
    <TopBar />
    <View style={styles.container}>
      <Text style={styles.title}>Caregiver Dashboard</Text>
      <Text style={styles.subtitle}>Feature coming soon...</Text>
    </View>
    <BottomNavBar navigation={navigation} activeRoute="CaregiverDashboard" />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
  },
});

export default CaregiverDashboard;
