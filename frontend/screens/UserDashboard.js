import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';
import { Ionicons } from '@expo/vector-icons';
import useTodaysMeds from '../hooks/useTodaysMeds';
import useTakenToday from '../hooks/useTakenToday';

const UserDashboard = ({ navigation }) => {
  const todaysMeds = useTodaysMeds();
  const { taken, markTaken } = useTakenToday();
  const displayMeds = todaysMeds.filter(med => !taken.includes(med.id));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f4f7' }} edges={["top", "bottom"]}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <Text style={styles.hello}>Hello, Martha</Text>
        <Text style={styles.subtitle}>
          You have {displayMeds.length} medication{displayMeds.length !== 1 ? 's' : ''} due today
        </Text>
        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Medications')}>
            <Ionicons name="medkit-outline" size={28} color="#222" style={{marginBottom: 6}} />
            <Text style={styles.actionText}>Add Medication</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Appointments')}>
            <Ionicons name="calendar-outline" size={28} color="#222" style={{marginBottom: 6}} />
            <Text style={styles.actionText}>Book Appointment</Text>
          </TouchableOpacity>
        </View>
        {/* Today's Medications */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Today's Medications</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Medications')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {displayMeds.map(med => (
            <View key={med.id} style={styles.medCard}>
              <View style={{flex:1}}>
                <Text style={styles.medName}>{med.name}</Text>
                <Text style={styles.medInfo}>{med.dosage}</Text>
                <View style={styles.medRow}>
                  <Ionicons name="time-outline" size={14} color="#222" />
                  <Text style={styles.medTime}>{med.time}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => markTaken(med.id)}>
                <Ionicons
                  name={taken.includes(med.id) ? 'checkmark-circle' : 'ellipse-outline'}
                  size={28}
                  color={taken.includes(med.id) ? '#2a6fbf' : '#bcbcbc'}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {/* Upcoming Appointments */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          </View>
          <View style={styles.appointmentCard}>
            <View style={{flex:1}}>
              <Text style={styles.appointmentDoctor}>Dr. Sarah Johnson</Text>
              <Text style={styles.appointmentSpecialty}>Cardiologist</Text>
              <View style={styles.appointmentRow}><Ionicons name="calendar-outline" size={14} color="#222" /><Text style={styles.appointmentTime}>April 25, 2025 • 10:30 AM</Text></View>
            </View>
            <TouchableOpacity><Text style={styles.detailsLink}>Details</Text></TouchableOpacity>
          </View>
        </View>
        {/* Health Summary */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Health Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Medication Adherence</Text>
              <View style={styles.summaryCircle}><Text style={styles.summaryCircleText}>92%</Text></View>
              <Text style={styles.summarySub}>Last 30 days</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Appointments</Text>
              <View style={[styles.summaryCircle,{backgroundColor:'#f6f7fa',borderColor:'#e0e0e0'}]}><Text style={[styles.summaryCircleText,{color:'#888'}]}>2</Text></View>
              <Text style={styles.summarySub}>Next 14 days</Text>
            </View>
          </View>
        </View>
        {/* Caregiver Access */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Caregiver Access</Text>
          <View style={styles.caregiverCard}>
            <Image source={require('../assets/profile.png')} style={styles.caregiverAvatar} />
            <View style={{flex:1}}>
              <Text style={styles.caregiverName}>David Smith</Text>
              <Text style={styles.caregiverRole}>Son - Primary caregiver</Text>
            </View>
            <TouchableOpacity><Ionicons name="trash-outline" size={22} color="#d32f2f" /></TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.addCaregiverBtn}>
            <Ionicons name="person-add-outline" size={18} color="#222" style={{marginRight:6}} />
            <Text style={styles.addCaregiverText}>Add Caregiver</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNavBar navigation={navigation} activeRoute="UserDashboard" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80,
    backgroundColor: '#f4f4f7',
  },
  hello: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 2,
    color: '#222',
  },
  subtitle: {
    color: '#7b7b7b',
    marginBottom: 18,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#f6f7fa',
    borderRadius: 10,
    alignItems: 'center',
    padding: 18,
    marginHorizontal: 5,
    elevation: 1,
  },
  actionText: {
    fontWeight: '500',
    fontSize: 15,
    color: '#222',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  seeAll: {
    fontSize: 13,
    color: '#2a6fbf',
    fontWeight: '500',
  },
  medCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f0f1f7',
  },
  medName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  medInfo: {
    fontSize: 13,
    color: '#888',
    marginBottom: 3,
  },
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medTime: {
    fontSize: 12,
    marginLeft: 4,
    marginRight: 8,
    color: '#222',
  },
  medTag: {
    fontSize: 11,
    backgroundColor: '#e6f7eb',
    color: '#4caf50',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: 'hidden',
    marginLeft: 4,
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#f0f1f7',
  },
  appointmentDoctor: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  appointmentSpecialty: {
    fontSize: 13,
    color: '#888',
    marginBottom: 3,
  },
  appointmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentTime: {
    fontSize: 12,
    marginLeft: 4,
    color: '#222',
  },
  detailsLink: {
    fontSize: 13,
    color: '#2a6fbf',
    fontWeight: '500',
    marginLeft: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
    fontWeight: '500',
  },
  summaryCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginBottom: 5,
  },
  summaryCircleText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222',
  },
  summarySub: {
    fontSize: 12,
    color: '#888',
  },
  caregiverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f0f1f7',
  },
  caregiverAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  caregiverName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  caregiverRole: {
    fontSize: 13,
    color: '#888',
  },
  addCaregiverBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6f7fa',
    borderRadius: 8,
    padding: 10,
  },
  addCaregiverText: {
    fontWeight: '500',
    fontSize: 15,
    color: '#222',
  },
});

export default UserDashboard;
