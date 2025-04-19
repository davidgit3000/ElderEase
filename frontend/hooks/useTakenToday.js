import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@taken_today';

export default function useTakenToday() {
  const [taken, setTaken] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(data => {
        if (data) setTaken(JSON.parse(data));
      })
      .catch(console.error);
  }, []);

  const markTaken = async id => {
    const updated = [...taken, id];
    setTaken(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save taken medications', e);
    }
  };

  return { taken, markTaken };
}
