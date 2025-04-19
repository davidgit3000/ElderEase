import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MedsProvider } from './context/MedsContext';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import UserDashboard from './screens/UserDashboard';
import CaregiverDashboard from './screens/CaregiverDashboard';
import ClinicDashboard from './screens/ClinicDashboard';
import Medications from './screens/Medications';
import Appointments from './screens/Appointments';
import Voice from './screens/Voice';
import Settings from './screens/Settings';

const Placeholder = ({ title }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f7' }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#222' }}>{title}</Text>
    <Text style={{ color: '#888', marginTop: 8 }}>Feature coming soon...</Text>
  </View>
);

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <MedsProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ animation: 'none', headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="UserDashboard" component={UserDashboard} />
          <Stack.Screen name="CaregiverDashboard" component={CaregiverDashboard} />
          <Stack.Screen name="ClinicDashboard" component={ClinicDashboard} />
          <Stack.Screen name="Medications" component={Medications} />
          <Stack.Screen name="Appointments" component={Appointments} />
          <Stack.Screen name="Voice" component={Voice} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </MedsProvider>
  );
}
