import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';
import { Ionicons } from '@expo/vector-icons';

const EXAMPLES = [
  'Remind me to take my blood pressure pill at 8PM',
  'Book an appointment with a cardiologist next week',
];

const Voice = ({ navigation }) => {
  const [status, setStatus] = useState('Listening...');
  const [userInput, setUserInput] = useState('');
  const [recentCommands, setRecentCommands] = useState([
    'Remind me to take my blood pressure pill at 8PM',
    'Book an appointment with a cardiologist next week',
  ]);
  const [listening, setListening] = useState(true);
  const glowAnim = useRef(new Animated.Value(1)).current;

  // Animate glowing mic
  React.useEffect(() => {
    if (listening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1.18,
            duration: 900,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ])
      ).start();
    } else {
      glowAnim.setValue(1);
    }
  }, [listening]);

  // Simulate voice input for demo
  const onMicPress = () => {
    if (status === 'Listening...') {
      setStatus('Processing...');
      setListening(false);
      setTimeout(() => {
        const heard = EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)];
        setUserInput(heard);
        setStatus(`Here’s what I heard: "${heard}"`);
        setRecentCommands([heard, ...recentCommands.slice(0, 7)]);
      }, 1800);
    } else {
      setUserInput('');
      setStatus('Listening...');
      setListening(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f4f7' }} edges={["top","bottom"]}>
      <TopBar />
      <View style={styles.container}>
        <Text style={styles.statusText}>{status}</Text>
        <Animated.View style={[styles.micContainer, { transform: [{ scale: glowAnim }] }]}> 
          <TouchableOpacity
            style={[styles.micButton, listening && styles.micActive]}
            onPress={onMicPress}
            activeOpacity={0.7}
          >
            <Ionicons name="mic" size={48} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
        <Text style={styles.instruction}>Try saying:</Text>
        <View style={styles.examplesBox}>
          {EXAMPLES.map((ex, idx) => (
            <Text key={idx} style={styles.exampleText}>
              “{ex}”
            </Text>
          ))}
        </View>
        <Text style={styles.recentTitle}>Recent Voice Commands</Text>
        <ScrollView style={styles.logBox} contentContainerStyle={{paddingBottom:10}}>
          {recentCommands.map((cmd, idx) => (
            <Text key={idx} style={styles.logText}>{cmd}</Text>
          ))}
        </ScrollView>
      </View>
      <BottomNavBar navigation={navigation} activeRoute="Voice" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
    paddingHorizontal: 18,
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 36,
    textAlign: 'center',
  },
  micContainer: {
    marginBottom: 24,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  micActive: {
    borderWidth: 4,
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOpacity: 0.5,
    shadowRadius: 18,
  },
  instruction: {
    color: '#888',
    fontSize: 15,
    marginTop: 18,
    marginBottom: 6,
    textAlign: 'center',
  },
  examplesBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 22,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  exampleText: {
    color: '#222',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 6,
  },
  recentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#888',
    marginBottom: 4,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  logBox: {
    backgroundColor: '#f6f7fa',
    borderRadius: 10,
    width: '100%',
    padding: 10,
    maxHeight: 110,
    marginBottom: 10,
  },
  logText: {
    color: '#444',
    fontSize: 14,
    marginBottom: 3,
  },
});

export default Voice;
