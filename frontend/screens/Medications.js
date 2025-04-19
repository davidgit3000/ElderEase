// Medications.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  Modal,
  TextInput,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';
import { Ionicons } from '@expo/vector-icons';
import { MedsContext } from '../context/MedsContext';

const statusColors = {
  Taken:    { bg: '#e6f7eb', color: '#4caf50' },
  Now:      { bg: '#e6f0fa', color: '#2a6fbf' },
  Upcoming: { bg: '#f0f1f7', color: '#888' },
  Missed:   { bg: '#fbeaea', color: '#d32f2f' },
};

const dosageOptions = [
  '1/2 tablet',
  '1 tablet',
  '2 tablets',
  '3 tablets',
  '4 tablets',
  '5 tablets',
];

const frequencyOptions = [
  'Daily',
  'Every Other Day',
  'Weekly',
];

export default function Medications({ navigation }) {
  // list + modal states
  const { meds: medications, addMed, updateMed, markTaken } = useContext(MedsContext);
  const [modalVisible, setModalVisible]       = useState(false);
  const [editMed, setEditMed]                 = useState(null);

  // form fields
  const [medName, setMedName]                       = useState('');
  const [medDosageAmount, setMedDosageAmount]       = useState('');
  const [selectedDosage, setSelectedDosage]         = useState('1 tablet');
  const [selectedFrequency, setSelectedFrequency]   = useState('Daily');
  const [time, setTime]                             = useState(new Date());

  // dropdown & time‑picker toggles
  const [showDosageList, setShowDosageList]         = useState(false);
  const [showFrequencyList, setShowFrequencyList]   = useState(false);
  const [showTimePicker, setShowTimePicker]         = useState(false);

  const openAddModal = () => {
    setEditMed(null);
    setMedName('');
    setMedDosageAmount('');
    setSelectedDosage('1 tablet');
    setSelectedFrequency('Daily');
    setTime(new Date());
    setModalVisible(true);
  };

  const openEditModal = med => {
    setEditMed(med);
    setMedName(med.name);

    // split dosage into amount + unit
    const parts = med.dosage.split(' - ');
    setMedDosageAmount(parts[0] || '');
    setSelectedDosage(parts[1] || '1 tablet');
    setSelectedFrequency(med.frequency);

    // parse time string back into Date
    const [hms, ampm] = med.time.split(' ');
    const [h, m]     = hms.split(':').map(n => parseInt(n, 10));
    const d           = new Date();
    let hour          = (h % 12) + (ampm === 'PM' ? 12 : 0);
    d.setHours(hour, m);
    setTime(d);

    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setShowDosageList(false);
    setShowFrequencyList(false);
    setShowTimePicker(false);
    setEditMed(null);
  };

  const onChangeTime = (_, picked) => {
    if (picked) setTime(picked);
    if (Platform.OS === 'android') setShowTimePicker(false);
  };

  const formatTime = date => {
    let h    = date.getHours();
    const m  = date.getMinutes();
    const am = h >= 12 ? 'PM' : 'AM';
    h        = h % 12 || 12;
    const mm = m < 10 ? '0' + m : m;
    return `${h}:${mm} ${am}`;
  };

  const saveMedication = () => {
    const newMed = {
      id: editMed ? editMed.id : Date.now().toString(),
      name: medName,
      dosage: `${medDosageAmount} - ${selectedDosage}`,
      time: formatTime(time),
      frequency: selectedFrequency,
    };

    if (editMed) {
      updateMed(newMed);
    } else {
      addMed({ ...newMed, status: 'Upcoming' });
    }

    closeModal();
  };

  const renderMed = ({ item }) => (
    <View style={styles.medCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.medName}>{item.name}</Text>
        <Text style={styles.medInfo}>{item.dosage}</Text>
        <View style={styles.medRow}>
          <Ionicons name="time-outline" size={14} color="#222" />
          <Text style={styles.medTime}>{item.time}</Text>
          <View style={[styles.medTag, { backgroundColor: statusColors[item.status].bg }]}>  
            <Text style={{ color: statusColors[item.status].color, fontSize: 11 }}>
              {item.status}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionBtns}>
        <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editBtn}>
          <Ionicons name="pencil-outline" size={18} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => updateMed({ ...item, status: 'Taken' })}
          style={styles.deleteBtn}
        >
          <Ionicons name="trash-outline" size={18} color="#d32f2f" />
        </TouchableOpacity>
        {tab === 'Today' && (
          <TouchableOpacity onPress={() => markTaken(item.id)} style={styles.actionBtns}>
            <Ionicons name="checkmark-circle" size={24} color="#4caf50" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // --- Tab state ---
  const [tab, setTab] = useState('Today');

  // --- Date helpers ---
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  // Helper to check if a med is due on a date
  function isMedDue(med, date) {
    if (med.frequency === 'Daily') return true;
    if (med.frequency === 'Every Other Day') {
      // Simple: odd/even days since epoch
      const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const diffDays = Math.floor((date - start) / (1000*60*60*24));
      return diffDays % 2 === 0;
    }
    if (med.frequency === 'Weekly') {
      // Assume taken on the same weekday as start
      // You might want to store a start date for each med for more accuracy
      const medStartDay = 0; // Sunday by default (customize as needed)
      return date.getDay() === medStartDay;
    }
    return false;
  }

  // Helper to sort by time
  function sortByTime(a, b) {
    const parse = t => {
      const [hm, ampm] = t.time.split(' ');
      let [h, m] = hm.split(':').map(Number);
      if (ampm === 'PM' && h !== 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };
    return parse(a) - parse(b);
  }

  // Filtered/sorted meds for each tab
  const filteredMeds = medications.filter(med => {
    if (tab === 'Today') return isMedDue(med, today);
    if (tab === 'Tomorrow') return isMedDue(med, tomorrow);
    // Upcoming: show all future meds (could be expanded to a week view)
    return true;
  }).sort(sortByTime);

  // Grouping logic
  const sections = [
    { title: 'Morning', data: filteredMeds.filter(med => {
        const [hm, ampm] = med.time.split(' ');
        let [h, m] = hm.split(':').map(Number);
        if (ampm === 'PM' && h !== 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        const minutes = h * 60 + m;
        return minutes >= 5*60 && minutes < 12*60;
      }) },
    { title: 'Afternoon', data: filteredMeds.filter(med => {
        const [hm, ampm] = med.time.split(' ');
        let [h, m] = hm.split(':').map(Number);
        if (ampm === 'PM' && h !== 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        const minutes = h * 60 + m;
        return minutes >= 12*60 && minutes < 17*60;
      }) },
    { title: 'Evening', data: filteredMeds.filter(med => {
        const [hm, ampm] = med.time.split(' ');
        let [h, m] = hm.split(':').map(Number);
        if (ampm === 'PM' && h !== 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        const minutes = h * 60 + m;
        return minutes >= 17*60 && minutes < 21*60;
      }) },
    { title: 'Night', data: filteredMeds.filter(med => {
        const [hm, ampm] = med.time.split(' ');
        let [h, m] = hm.split(':').map(Number);
        if (ampm === 'PM' && h !== 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        const minutes = h * 60 + m;
        return (minutes >= 21*60 && minutes < 24*60) || (minutes < 5*60);
      }) },
  ].filter(section => section.data.length > 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f4f7' }} edges={['top','bottom']}>
      <TopBar/>

      <View style={styles.headerRow}>
        <Text style={styles.title}>My Medications</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {['Today', 'Tomorrow', 'Upcoming'].map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => renderMed({ item })}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{section.title}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />

      {/* ——— Main Add/Edit Modal ——— */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { overflow: 'visible' }]}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editMed ? 'Edit Medication' : 'Add Medication'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={20} color="#888"/>
              </TouchableOpacity>
            </View>

            {/* Medication Name */}
            <Text style={styles.inputLabel}>Medication Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter medication name"
              value={medName}
              onChangeText={setMedName}
            />

            {/* Dosage */}
            <Text style={styles.inputLabel}>Dosage</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.dosageAmountInput]}
                placeholder="Amount (e.g. 10mg)"
                value={medDosageAmount}
                onChangeText={setMedDosageAmount}
              />
              <Pressable
                style={[styles.dropdownButton, styles.dosageDropdownButton]}
                onPress={() => setShowDosageList(true)}
              >
                <View style={styles.dropdownDisplay}>
                  <Text style={{ color: '#111' }}>{selectedDosage}</Text>
                  <Ionicons name="chevron-down-outline" size={16} color="#888"/>
                </View>
              </Pressable>

              <Modal visible={showDosageList} transparent animationType="fade">
                <Pressable style={styles.dropdownModalCenter} onPress={() => setShowDosageList(false)}>
                  <View style={styles.dropdownBeautifulBox}>
                    {dosageOptions.map(opt => (
                      <TouchableOpacity
                        key={opt}
                        style={[
                          styles.dropdownBeautifulItem,
                          selectedDosage === opt && styles.dropdownBeautifulSelected
                        ]}
                        onPress={() => {
                          setSelectedDosage(opt);
                          setShowDosageList(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownBeautifulText,
                            selectedDosage === opt && styles.dropdownBeautifulTextSelected
                          ]}
                        >
                          {opt}
                        </Text>
                        {selectedDosage === opt && (
                          <Ionicons name="checkmark" size={18} color="#007AFF" style={{ marginLeft: 8 }}/>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </Pressable>
              </Modal>
            </View>

            {/* Frequency */}
            <Text style={styles.inputLabel}>Frequency</Text>
            <View style={styles.inputRow}>
              <Pressable
                style={styles.dropdownButton}
                onPress={() => setShowFrequencyList(true)}
              >
                <View style={styles.dropdownDisplay}>
                  <Text style={{ color: '#111' }}>{selectedFrequency}</Text>
                  <Ionicons name="chevron-down-outline" size={16} color="#888"/>
                </View>
              </Pressable>

              <Modal visible={showFrequencyList} transparent animationType="fade">
                <Pressable style={styles.dropdownModalCenter} onPress={() => setShowFrequencyList(false)}>
                  <View style={styles.dropdownBeautifulBox}>
                    {frequencyOptions.map(opt => (
                      <TouchableOpacity
                        key={opt}
                        style={[
                          styles.dropdownBeautifulItem,
                          selectedFrequency === opt && styles.dropdownBeautifulSelected
                        ]}
                        onPress={() => {
                          setSelectedFrequency(opt);
                          setShowFrequencyList(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownBeautifulText,
                            selectedFrequency === opt && styles.dropdownBeautifulTextSelected
                          ]}
                        >
                          {opt}
                        </Text>
                        {selectedFrequency === opt && (
                          <Ionicons name="checkmark" size={18} color="#007AFF" style={{ marginLeft: 8 }}/>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </Pressable>
              </Modal>
            </View>

            {/* Time */}
            <Text style={styles.inputLabel}>Time</Text>
            <Pressable
              style={styles.input}
              onPress={() => setShowTimePicker(v => !v)}
            >
              <View style={styles.dropdownDisplay}>
                <Text>{formatTime(time)}</Text>
                <Ionicons name="time-outline" size={18} color="#888"/>
              </View>
            </Pressable>
            {showTimePicker && (
              <View style={styles.pickerWrapper}>
                <DateTimePicker
                  value={time}
                  mode="time"
                  display={Platform.OS === 'android' ? 'clock' : 'spinner'}
                  onChange={onChangeTime}
                  style={styles.timePicker}
                  textColor="#000"
                  minuteInterval={5}
                />
              </View>
            )}

            {/* Buttons */}
            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveMedication}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomNavBar navigation={navigation} activeRoute="Medications"/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // --- Tabs styles ---
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 2,
    gap: 8,
  },
  tabBtn: {
    paddingVertical: 7,
    paddingHorizontal: 22,
    borderRadius: 18,
    backgroundColor: '#f4f4f7',
    marginHorizontal: 2,
  },
  tabBtnActive: {
    backgroundColor: '#222',
  },
  tabText: {
    color: '#222',
    fontWeight: '500',
    fontSize: 15,
  },
  tabTextActive: {
    color: '#fff',
  },

  // Dosage input group alignment
  dosageAmountInput: {
    flex: 1.2,
    height: 48,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRightWidth: 0,
    marginRight: 0,
    marginBottom: 12,
    backgroundColor: '#f6f7fa',
    borderWidth: 1,
    borderColor: '#ececec',
    paddingLeft: 12,
    paddingRight: 12,
    fontSize: 15,
  },
  dosageDropdownButton: {
    flex: 1,
    height: 48,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeftWidth: 0,
    marginLeft: 0,
    marginBottom: 12,
    backgroundColor: '#f6f7fa',
    borderWidth: 1,
    borderColor: '#ececec',
    paddingRight: 12,
    paddingLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // beautiful dropdown modals
  dropdownModalCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  dropdownBeautifulBox: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 8,
    minWidth: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 14,
    elevation: 6,
  },
  dropdownBeautifulItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  dropdownBeautifulSelected: {
    backgroundColor: '#f1f6fc',
    borderRadius: 12,
  },
  dropdownBeautifulText: {
    fontSize: 17,
    color: '#222',
    flex: 1,
  },
  dropdownBeautifulTextSelected: {
    color: '#007AFF',
    fontWeight: 'bold',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
  title:    { fontSize: 20, fontWeight: 'bold', color: '#222' },
  addBtn:   {
    backgroundColor: '#222',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  medCard:  {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ececec',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  medName:  { fontWeight: 'bold', fontSize: 15, color: '#222' },
  medInfo:  { fontSize: 13, color: '#888', marginBottom: 3 },
  medRow:   { flexDirection: 'row', alignItems: 'center' },
  medTime:  { fontSize: 12, marginLeft: 4, marginRight: 8, color: '#222' },
  medTag:   { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 4 },
  actionBtns:{ flexDirection: 'row', alignItems: 'center' },
  editBtn:  { padding: 6, marginRight: 8 },
  deleteBtn:{ padding: 6 },

  modalOverlay:{
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard:{
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
  modalHeader:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle:{ fontSize: 20, fontWeight: 'bold', color: '#222' },

  inputLabel:{
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
    marginTop: 8,
    marginBottom: 2,
  },
  input:{
    backgroundColor: '#f6f7fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ececec',
  },
  inputRow:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },

  dropdownButton:{
    backgroundColor: '#f6f7fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ececec',
    padding: 12,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownDisplay:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  pickerWrapper: {
    width: '100%',
    height: 150,
    overflow: 'visible',
    marginBottom: 5,
    alignItems: 'center', // Center the picker horizontally
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  timePicker: {
    flex: 1,
  },

  modalBtnRow:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 12,
  },
  cancelBtn:{
    flex: 1,
    backgroundColor: '#f0f1f7',
    borderRadius: 8,
    alignItems: 'center',
    padding: 12,
  },
  cancelBtnText:{ color: '#222', fontSize: 16, fontWeight: 'bold' },
  saveBtn:{
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 8,
    alignItems: 'center',
    padding: 12,
  },
  saveBtnText:{ color: '#fff', fontSize: 16, fontWeight: 'bold' },

  sectionHeader: {
    backgroundColor: '#f4f4f7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
});
