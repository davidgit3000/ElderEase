import { useState, useEffect } from 'react';

const initialMeds = [
  { id: '1', name: 'Lisinopril', dosage: '10mg - 1 tablet', time: '8:00 AM', frequency: 'Daily' },
  { id: '2', name: 'Metformin', dosage: '500mg - 1 tablet', time: '1:00 PM', frequency: 'Daily' },
  { id: '3', name: 'Aspirin',    dosage: '81mg - 1 tablet', time: '8:00 PM', frequency: 'Daily' },
];

function isMedDue(med, date) {
  if (med.frequency === 'Daily') return true;
  if (med.frequency === 'Every Other Day') {
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.floor((date - start) / (1000 * 60 * 60 * 24));
    return diffDays % 2 === 0;
  }
  if (med.frequency === 'Weekly') {
    // show on same weekday as start date
    return date.getDay() === start.getDay();
  }
  return false;
}

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

export default function useTodaysMeds() {
  const [todayMeds, setTodayMeds] = useState([]);

  useEffect(() => {
    const today = new Date();
    const filtered = initialMeds.filter(med => isMedDue(med, today)).sort(sortByTime);
    setTodayMeds(filtered);
  }, []);

  return todayMeds;
}
