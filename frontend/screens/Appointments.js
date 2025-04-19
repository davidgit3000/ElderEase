import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, ScrollView, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';
import { Ionicons } from '@expo/vector-icons';

const specialties = [
  'Cardiologist', 'Neurologist', 'Ophthalmologist', 'Rheumatologist', 'General Practitioner', 'Dermatologist', 'Other',
];

const initialAppointments = [
  { id: '1', doctor: 'Dr. Sarah Lee', specialty: 'Cardiologist', dateTime: new Date(2025,3,25,10,30), clinic: 'Heart Care Center', insurance: 'Covered by Medicare', status: 'Upcoming' },
  { id: '2', doctor: 'Dr. James Wilson', specialty: 'Neurologist', dateTime: new Date(2025,4,3,14,15), clinic: 'Neuro Health Clinic', insurance: 'Covered by Medicare', status: 'Upcoming' },
  { id: '3', doctor: 'Dr. Robert Chen', specialty: 'Ophthalmologist', dateTime: new Date(2025,2,15), status: 'Completed' },
  { id: '4', doctor: 'Dr. Amanda Patel', specialty: 'Rheumatologist', dateTime: new Date(2025,1,28), status: 'Missed' },
];

export default function Appointments({ navigation }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [modalVisible, setModalVisible] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState('Cardiologist');
  const [specialtyModal, setSpecialtyModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [insurance, setInsurance] = useState('');
  const [location, setLocation] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [actionModal, setActionModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);

  useEffect(() => {
    const now = new Date();
    setAppointments(prev => prev.map(a => {
      if (a.status === 'Upcoming' && now.getTime() > a.dateTime.getTime() + 24 * 60 * 60 * 1000) {
        return { ...a, status: 'Missed' };
      }
      return a;
    }));
  }, []);

  const handleSave = () => {
    if (editingAppointment) {
      setAppointments(prev => prev.map(a => a.id === editingAppointment.id ? { ...a, doctor: doctorName, specialty: selectedSpecialty, dateTime: date, insurance, clinic: location } : a));
    } else {
      setAppointments(prev => [...prev, { id: Date.now().toString(), doctor: doctorName, specialty: selectedSpecialty, dateTime: date, insurance, clinic: location, status: 'Upcoming' }]);
    }
    setEditingAppointment(null);
    setModalVisible(false);
    setShowManualForm(false);
  };

  const handleEdit = () => {
    const a = selectedAppointment;
    setDoctorName(a.doctor);
    setSelectedSpecialty(a.specialty);
    setDate(a.dateTime);
    setInsurance(a.insurance || '');
    setLocation(a.clinic || '');
    setEditingAppointment(a);
    setShowManualForm(true);
    setModalVisible(true);
    setActionModal(false);
  };

  const handleComplete = () => {
    setAppointments(prev => prev.map(a => a.id === selectedAppointment.id ? { ...a, status: 'Completed' } : a));
    setActionModal(false);
  };

  const handleRemove = () => {
    setAppointments(prev => prev.filter(a => a.id !== selectedAppointment.id));
    setActionModal(false);
  };

  const now = new Date();
  const upcomingAppointments = appointments.filter(a =>
    a.status === 'Upcoming' &&
    a.dateTime.getTime() + 24 * 60 * 60 * 1000 >= now.getTime()
  ).sort((a, b) => a.dateTime - b.dateTime);
  const pastAppointments = appointments.filter(a => a.status !== 'Upcoming')
    .sort((a, b) => b.dateTime - a.dateTime);

  const formatDateTime = (dateObj) => {
    const opts = { month: 'long', day: 'numeric', year: 'numeric' };
    const dateStr = dateObj.toLocaleDateString(undefined, opts);
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minStr = minutes < 10 ? '0' + minutes : minutes;
    return `${dateStr} • ${hours}:${minStr} ${ampm}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f4f7' }} edges={['top', 'bottom']}>
      <TopBar />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Appointments</Text>
        <Text style={styles.subtitle}>Manage your medical appointments</Text>
        {/* Upcoming Appointments */}
        <Text style={styles.sectionHeader}>Upcoming Appointments</Text>
        {upcomingAppointments.map(item => (
          <View key={item.id} style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Text style={styles.cardDoctor}>{item.doctor}</Text>
              <View style={styles.specialtyTag}><Text style={styles.specialtyTagText}>{item.specialty}</Text></View>
            </View>
            <View style={styles.cardRow}><Ionicons name="calendar-outline" size={16} color="#222" /><Text style={styles.cardRowText}>{formatDateTime(item.dateTime)}</Text></View>
            <View style={styles.cardRow}><Ionicons name="location-outline" size={16} color="#222" /><Text style={styles.cardRowText}>{item.clinic}</Text></View>
            <View style={styles.cardRow}><Ionicons name="document-text-outline" size={16} color="#222" /><Text style={styles.cardRowText}>{item.insurance}</Text></View>
            <TouchableOpacity style={styles.detailsBtn} onPress={() => { setSelectedAppointment(item); setActionModal(true); }}><Text style={styles.detailsBtnText}>Edit</Text></TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.bookBtn} onPress={() => { setEditingAppointment(null); setShowManualForm(true); setModalVisible(true); }}>
          <Ionicons name="add" size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.bookBtnText}>Book Appointment</Text>
        </TouchableOpacity>
        {/* Past Appointments */}
        <Text style={styles.sectionHeader}>Past Appointments</Text>
        {pastAppointments.map(item => {
          const content = (
            <View key={item.id} style={styles.pastCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={styles.pastDoctor}>{item.doctor}</Text>
                  <Text style={styles.pastSpecialty}>{item.specialty}</Text>
                  <Text style={styles.pastDate}>{formatDateTime(item.dateTime)}</Text>
                </View>
                <View style={[styles.statusTag, item.status === 'Completed' ? styles.completed : styles.missed]}>
                  <Text style={[styles.statusTagText, item.status === 'Completed' ? styles.completedText : styles.missedText]}>{item.status}</Text>
                </View>
              </View>
            </View>
          );
          return item.status === 'Missed' ? (
            <TouchableOpacity key={item.id} onPress={() => { setSelectedAppointment(item); setActionModal(true); }}>
              {content}
            </TouchableOpacity>
          ) : content;
        })}
        <TouchableOpacity style={styles.pastBtn}><Text style={styles.pastBtnText}>View All Past Appointments</Text><Ionicons name="chevron-forward" size={16} color="#888" /></TouchableOpacity>
      </ScrollView>
      {/* Book Appointment Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {!showManualForm ? (
              <>
                <Text style={styles.modalTitle}>Book Appointment</Text>
                <TouchableOpacity style={styles.aiBtn} onPress={() => { setModalVisible(false); navigation.navigate('Voice'); }}>
                  <Ionicons name="mic-outline" size={20} color="#222" style={{ marginRight: 8 }} />
                  <Text style={styles.aiBtnText}>AI-assisted (speak your request)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.manualBtn} onPress={() => setShowManualForm(true)}>
                  <Ionicons name="create-outline" size={20} color="#222" style={{ marginRight: 8 }} />
                  <Text style={styles.manualBtnText}>Enter details manually</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Manual Entry</Text>
                <Text style={styles.inputLabel}>Doctor Name</Text>
                <TextInput
                  style={styles.input}
                  value={doctorName}
                  onChangeText={setDoctorName}
                  placeholder="Enter doctor's name"
                  placeholderTextColor="#888"
                />
                <Text style={styles.inputLabel}>Preferred Date/Time</Text>
                <Pressable
                  style={styles.dropdown}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={{ color: '#000' }}>{formatDateTime(date)}</Text>
                  <Ionicons name="calendar-outline" size={16} color="#888" />
                </Pressable>
                <Modal
                  visible={showDatePicker}
                  animationType="fade"
                  transparent
                >
                  <Pressable
                    style={styles.dropdownModalCenter}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <View style={styles.datetimeModalBox}>
                      <Text style={styles.pickerTitle}>Select Date & Time</Text>
                      <DateTimePicker
                        value={date}
                        mode="datetime"
                        display={Platform.OS === 'android' ? 'default' : 'spinner'}
                        onChange={(e, sel) => {
                          if (sel) setDate(sel);
                        }}
                        style={styles.datetimePicker}
                        textColor="#000"
                      />
                      <TouchableOpacity
                        style={styles.doneBtn}
                        onPress={() => setShowDatePicker(false)}
                      >
                        <Text style={styles.doneText}>Done</Text>
                      </TouchableOpacity>
                    </View>
                  </Pressable>
                </Modal>
                <Text style={styles.inputLabel}>Insurance</Text>
                <TextInput style={styles.input} value={insurance} onChangeText={setInsurance} placeholder="e.g. Covered by Medicare" placeholderTextColor="#888" />
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Enter location or clinic name" placeholderTextColor="#888" />
                <View style={styles.modalBtnRow}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => { setShowManualForm(false); setModalVisible(false); }}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.saveBtnText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      {/* Action Modal */}
      <Modal visible={actionModal} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setActionModal(false)}>
          <View style={styles.modalCard}>
            {selectedAppointment?.status === 'Missed' ? (
              <>
                <TouchableOpacity onPress={handleComplete}><Text style={styles.pickerTitle}>Mark Completed</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setActionModal(false)}><Text style={styles.pickerTitle}>Cancel</Text></TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity onPress={handleEdit}><Text style={styles.pickerTitle}>Edit Details</Text></TouchableOpacity>
                <TouchableOpacity onPress={handleComplete}><Text style={styles.pickerTitle}>Mark Completed</Text></TouchableOpacity>
                <TouchableOpacity onPress={handleRemove}><Text style={styles.pickerTitle}>Remove Appointment</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setActionModal(false)}><Text style={[styles.pickerTitle, styles.cancelBtnText]}>Cancel</Text></TouchableOpacity>
              </>
            )}
          </View>
        </Pressable>
      </Modal>
      <BottomNavBar navigation={navigation} activeRoute="Appointments" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  subtitle: {
    color: '#888',
    fontSize: 15,
    marginBottom: 18,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 18,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#ececec',
  },
  cardDoctor: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginBottom: 2,
  },
  dropdownModalCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  datetimeModalBox: {
    backgroundColor: '#fff',
    borderRadius: 18,
    width: '80%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 14,
    elevation: 6,
    alignItems: 'center',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  datetimePicker: {
    width: '100%',
    marginBottom: 12,
  },
  doneBtn: {
    backgroundColor: '#222',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignSelf: 'center',
  },
  doneText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  specialtyTag: {
    backgroundColor: '#f1f6fc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  specialtyTagText: {
    color: '#2a6fbf',
    fontSize: 13,
    fontWeight: '600',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  cardRowText: {
    marginLeft: 8,
    color: '#444',
    fontSize: 14,
  },
  detailsBtn: {
    backgroundColor: '#ececec',
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  detailsBtnText: {
    color: '#222',
    fontWeight: '600',
    fontSize: 15,
  },
  bookBtn: {
    backgroundColor: '#222',
    borderRadius: 8,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 18,
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pastCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ececec',
  },
  pastDoctor: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  pastSpecialty: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  pastDate: {
    fontSize: 13,
    color: '#888',
  },
  statusTag: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 74,
  },
  completed: {
    backgroundColor: '#e6f7eb',
  },
  missed: {
    backgroundColor: '#fbeaea',
  },
  completedText: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  missedText: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  pastBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 30,
  },
  pastBtnText: {
    color: '#222',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    width: '88%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 18,
    textAlign: 'center',
  },
  aiBtn: {
    backgroundColor: '#f6f7fa',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  aiBtnText: {
    color: '#222',
    fontSize: 16,
    fontWeight: '600',
  },
  manualBtn: {
    backgroundColor: '#f6f7fa',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  manualBtnText: {
    color: '#222',
    fontSize: 16,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
    marginTop: 8,
    marginBottom: 2,
  },
  dropdown: {
    backgroundColor: '#f6f7fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ececec',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f6f7fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ececec',
    color: '#222',
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#f0f1f7',
    borderRadius: 8,
    alignItems: 'center',
    padding: 12,
  },
  cancelBtnText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 8,
    alignItems: 'center',
    padding: 12,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  specialtyModalCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    width: '80%',
    maxHeight: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  specialtyModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
    textAlign: 'center',
  },
  specialtyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
});
