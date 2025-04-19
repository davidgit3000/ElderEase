import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Modal, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';
import { Ionicons } from '@expo/vector-icons';

const Settings = ({ navigation }) => {
  // Example user data
  const [user, setUser] = useState({
    name: 'John Smith',
    email: 'john.smith@email.com',
    type: 'User',
    avatar: require('../assets/profile.png'),
  });
  const [editModal, setEditModal] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [medReminders, setMedReminders] = useState(true);
  const [apptReminders, setApptReminders] = useState(true);

  const handleSave = () => {
    setUser({ ...user, email });
    setEditModal(false);
    setPassword('');
  };

  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f4f7' }} edges={["top","bottom"]}>
      <TopBar />
      <View style={{ flex: 1, padding: 16, paddingBottom: 80 }}>
        {/* Profile Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profile</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Image source={user.avatar} style={styles.avatar} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.type}>{user.type}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => setEditModal(true)}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        {/* Reminders */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Reminders</Text>
          <View style={styles.reminderRow}>
            <Ionicons name="medkit-outline" size={20} color="#444" style={{marginRight:8}} />
            <Text style={styles.reminderText}>Medication Reminders</Text>
            <Switch value={medReminders} onValueChange={setMedReminders} />
          </View>
          <View style={styles.reminderRow}>
            <Ionicons name="calendar-outline" size={20} color="#444" style={{marginRight:8}} />
            <Text style={styles.reminderText}>Appointment Reminders</Text>
            <Switch value={apptReminders} onValueChange={setApptReminders} />
          </View>
        </View>
        {/* Access */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Access</Text>
          <TouchableOpacity style={styles.accessBtn}>
            <Text style={styles.accessBtnText}>Manage Caregiver</Text>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.accessBtn}>
            <Text style={styles.accessBtnText}>Manage Clinic</Text>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>
        </View>
        {/* Log Out */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#222" style={{marginRight:8}} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
      {/* Edit Profile Modal */}
      <Modal visible={editModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput style={[styles.input, { backgroundColor: '#ececec', color: '#888' }]} value={user.name} editable={false} />
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Enter new password" />
            <View style={{ flexDirection: 'row', marginTop: 18, gap: 12 }}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <BottomNavBar navigation={navigation} activeRoute="Settings" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#ececec',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#ececec',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
  },
  type: {
    color: '#888',
    fontSize: 14,
    marginBottom: 2,
  },
  email: {
    color: '#444',
    fontSize: 15,
    marginBottom: 4,
  },
  editBtn: {
    backgroundColor: '#23272f',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  reminderText: {
    flex: 1,
    color: '#222',
    fontSize: 15,
    marginLeft: 6,
  },
  accessBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f6f7fa',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  accessBtnText: {
    color: '#222',
    fontSize: 15,
    fontWeight: '500',
  },
  logoutBtn: {
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: '#ececec',
  },
  logoutText: {
    color: '#222',
    fontSize: 17,
    fontWeight: '600',
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
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
    marginTop: 8,
    marginBottom: 2,
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
  cancelBtn: {
    flex: 1,
    backgroundColor: '#f0f1f7',
    borderRadius: 8,
    alignItems: 'center',
    padding: 12,
  },
  cancelBtnText: {
    color: '#222',
    fontSize: 16,
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
});

export default Settings;
