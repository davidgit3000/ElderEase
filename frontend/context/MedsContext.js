import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const MedsContext = createContext();

const STORAGE_KEY = '@taken_today';
const initialMeds = [
  { id: '1', name: 'Lisinopril', dosage: '10mg - 1 tablet', time: '8:00 AM', frequency: 'Daily', status: 'Upcoming' },
  { id: '2', name: 'Metformin', dosage: '500mg - 1 tablet', time: '1:00 PM', frequency: 'Daily', status: 'Upcoming' },
  { id: '3', name: 'Aspirin',    dosage: '81mg - 1 tablet', time: '8:00 PM', frequency: 'Daily', status: 'Upcoming' },
];

export const MedsProvider = ({ children }) => {
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(data => {
        const taken = data ? JSON.parse(data) : [];
        const loaded = initialMeds.map(m => ({
          ...m,
          status: taken.includes(m.id) ? 'Taken' : m.status,
        }));
        setMeds(loaded);
      })
      .catch(console.error);
  }, []);

  const markTaken = async id => {
    setMeds(ms => ms.map(m => m.id === id ? { ...m, status: 'Taken' } : m));
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const taken = data ? JSON.parse(data) : [];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...taken, id]));
    } catch (e) {
      console.error('Error saving taken meds', e);
    }
  };

  const addMed = med => setMeds(ms => [...ms, med]);
  const updateMed = med => setMeds(ms => ms.map(m => m.id === med.id ? med : m));

  return (
    <MedsContext.Provider value={{ meds, markTaken, addMed, updateMed }}>
      {children}
    </MedsContext.Provider>
  );
};
