import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { RadioButton } from 'react-native-paper';

const LoginScreen = ({ navigation }) => {
  const [role, setRole] = useState('User');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [caregiverName, setCaregiverName] = useState('');
  const [clinicName, setClinicName] = useState('');

  const handleLogin = () => {
    // For now, just navigate to the appropriate dashboard based on role
    if (role === 'User') {
      navigation.replace('UserDashboard');
    } else if (role === 'Caregiver') {
      navigation.replace('CaregiverDashboard');
    } else if (role === 'Clinic') {
      navigation.replace('ClinicDashboard');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>Login</Text>
            <View style={styles.radioGroup}>
              <View style={styles.radioOption}>
                <RadioButton
                  value="User"
                  status={role === 'User' ? 'checked' : 'unchecked'}
                  onPress={() => setRole('User')}
                  color="#007AFF"
                  uncheckedColor="#BDBDBD"
                />
                <Text style={styles.radioLabel}>User</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton
                  value="Caregiver"
                  status={role === 'Caregiver' ? 'checked' : 'unchecked'}
                  onPress={() => setRole('Caregiver')}
                  color="#007AFF"
                  uncheckedColor="#BDBDBD"
                />
                <Text style={styles.radioLabel}>Caregiver</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton
                  value="Clinic"
                  status={role === 'Clinic' ? 'checked' : 'unchecked'}
                  onPress={() => setRole('Clinic')}
                  color="#007AFF"
                  uncheckedColor="#BDBDBD"
                />
                <Text style={styles.radioLabel}>Clinic</Text>
              </View>
            </View>

            {role === 'User' ? (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#BDBDBD"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#BDBDBD"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
                <TouchableOpacity>
                  <Text style={styles.forgotPassword}>Forgot password?</Text>
                </TouchableOpacity>
              </>
            ) : role === 'Caregiver' ? (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter full name"
                    placeholderTextColor="#BDBDBD"
                    value={caregiverName}
                    onChangeText={setCaregiverName}
                    autoCapitalize="words"
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>User ID</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter user ID"
                    placeholderTextColor="#BDBDBD"
                    value={userId}
                    onChangeText={setUserId}
                    autoCapitalize="none"
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Clinic Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter clinic name"
                    placeholderTextColor="#BDBDBD"
                    value={clinicName}
                    onChangeText={setClinicName}
                    autoCapitalize="words"
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>User ID</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter user ID"
                    placeholderTextColor="#BDBDBD"
                    value={userId}
                    onChangeText={setUserId}
                    autoCapitalize="none"
                  />
                </View>
              </>
            )}

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>

            {role === 'User' && (
              <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerButtonText}>Register</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f6',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 32,
    paddingHorizontal: 24,
    width: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 26,
    color: '#111',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 18,
    marginLeft: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
  },
  radioLabel: {
    fontSize: 16,
    color: '#111',
    marginRight: 2,
    marginLeft: -6,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 15,
    color: '#222',
    marginBottom: 4,
    fontWeight: '500',
    marginLeft: 2,
  },
  input: {
    backgroundColor: '#f4f4f6',
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: '#e1e1e6',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#222',
  },
  forgotPassword: {
    color: '#222',
    marginBottom: 14,
    marginLeft: 3,
    fontSize: 15,
    opacity: 0.7,
  },
  loginButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 12,
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
  registerButton: {
    backgroundColor: '#e9eaee',
    paddingVertical: 14,
    borderRadius: 8,
  },
  registerButtonText: {
    textAlign: 'center',
    color: '#23272f',
    fontSize: 17,
    fontWeight: '500',
  },
});

export default LoginScreen;
