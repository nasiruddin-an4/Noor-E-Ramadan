// components/NamazCard.jsx
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

const NamazCard = ({ prayerName, time, isNextPrayer }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const [timeStr, period] = time.split(' ');
      const [hours, minutes] = timeStr.split(':');
      
      let prayerTime = new Date();
      prayerTime.setHours(
        period === 'PM' && hours !== '12' ? parseInt(hours) + 12 : parseInt(hours),
        parseInt(minutes),
        0
      );

      if (prayerTime < now) {
        prayerTime.setDate(prayerTime.getDate() + 1);
      }

      const diff = prayerTime - now;
      const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [time]);

  return (
    <View className={`p-4 m-2 rounded-lg ${isNextPrayer ? 'bg-blue-600' : 'bg-gray-800'}`}>
      <Text className="text-white text-lg font-bold">{prayerName}</Text>
      <Text className="text-white text-xl">{time}</Text>
      {isNextPrayer && (
        <Text className="text-yellow-300 text-sm mt-1">Next: {timeLeft}</Text>
      )}
    </View>
  );
};

export default NamazCard;