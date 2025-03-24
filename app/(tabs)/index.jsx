import { View, Text, TouchableOpacity, ScrollView, ImageBackground, StatusBar, Image, Animated, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import namazSchedule from '@/data/namaz_schedule_2025.json';
import { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export default function PrayerTimesScreen() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const [showQiblaModal, setShowQiblaModal] = useState(false); // New state for Qibla modal
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [lastDate, setLastDate] = useState(currentTime.getDate());

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const findTodaySchedule = () => {
    const today = new Date();
    const formattedToday = formatDate(today);
    const todaySchedule = namazSchedule.dhaka.find(
      (item) => item.Date === formattedToday
    );
    if (!todaySchedule) {
      console.warn(`No schedule found for ${formattedToday}. Falling back to the first entry.`);
      return namazSchedule.dhaka[0];
    }
    return todaySchedule;
  };

  const [todaySchedule, setTodaySchedule] = useState(findTodaySchedule());

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date();
      setCurrentTime(newTime);
      const currentDate = newTime.getDate();
      if (currentDate !== lastDate) {
        console.log(`Date changed from ${formatDate(new Date(newTime.getTime() - 86400000))} to ${formatDate(newTime)}`);
        const newSchedule = findTodaySchedule();
        setTodaySchedule(newSchedule);
        setLastDate(currentDate);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [lastDate]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const prayerTimes = [
    { name: 'Fajr', time: todaySchedule.Fajr, icon: 'weather-sunset-up', color: 'from-blue-900 to-indigo-800' },
    { name: 'Dhuhr', time: todaySchedule.Dhuhr, icon: 'weather-sunny', color: 'from-amber-600 to-orange-500' },
    { name: 'Asr', time: todaySchedule.Asr, icon: 'weather-sunset', color: 'from-orange-700 to-red-600' },
    { name: 'Maghrib', time: todaySchedule.Maghrib, icon: 'weather-night', color: 'from-purple-900 to-violet-800' },
    { name: 'Isha', time: todaySchedule.Isha, icon: 'star', color: 'from-indigo-900 to-blue-900' },
  ];

  const getNextPrayer = () => {
    const minutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    return (
      prayerTimes.find((prayer) => {
        const [timeStr, period] = prayer.time.split(' ');
        const [hours, mins] = timeStr.split(':');
        let prayerMinutes =
          (period === 'PM' && hours !== '12' ? parseInt(hours) + 12 : parseInt(hours)) * 60 + parseInt(mins);
        return prayerMinutes > minutes;
      }) || prayerTimes[0]
    );
  };

  const nextPrayer = getNextPrayer();

  const getTimeRemaining = () => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    const [timeStr, period] = nextPrayer.time.split(' ');
    const [hours, mins] = timeStr.split(':');
    let prayerTime =
      (period === 'PM' && hours !== '12' ? parseInt(hours) + 12 : parseInt(hours)) * 60 + parseInt(mins);
    if (nextPrayer.name === 'Fajr' && prayerTime < now) {
      prayerTime += 24 * 60;
    }
    const diff = prayerTime - now;
    const hoursLeft = Math.floor(diff / 60);
    const minsLeft = diff % 60;
    return `${hoursLeft}h ${minsLeft}m`;
  };

  const getPrayerProgress = () => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    let currentPrayerIndex = prayerTimes.findIndex((prayer) => {
      const [timeStr, period] = prayer.time.split(' ');
      const [hours, mins] = timeStr.split(':');
      let prayerMinutes =
        (period === 'PM' && hours !== '12' ? parseInt(hours) + 12 : parseInt(hours)) * 60 + parseInt(mins);
      return prayerMinutes > now;
    }) - 1;
    if (currentPrayerIndex < 0) currentPrayerIndex = prayerTimes.length - 1;
    const nextPrayerIndex = (currentPrayerIndex + 1) % prayerTimes.length;
    const [startTimeStr, startPeriod] = prayerTimes[currentPrayerIndex].time.split(' ');
    const [startHours, startMins] = startTimeStr.split(':');
    const startTime =
      (startPeriod === 'PM' && startHours !== '12' ? parseInt(startHours) + 12 : parseInt(startHours)) * 60 + parseInt(startMins);
    const [endTimeStr, endPeriod] = prayerTimes[nextPrayerIndex].time.split(' ');
    const [endHours, endMins] = endTimeStr.split(':');
    let endTime =
      (endPeriod === 'PM' && endHours !== '12' ? parseInt(endHours) + 12 : parseInt(endHours)) * 60 + parseInt(endMins);
    if (nextPrayerIndex === 0) endTime += 24 * 60;
    const totalDuration = endTime - startTime;
    const elapsed = now - startTime;
    return Math.min(100, Math.max(0, Math.floor((elapsed / totalDuration) * 100)));
  };

  // Nafl prayer times for Dhaka, Bangladesh on March 24, 2025
  const naflTimes = [
    { name: 'Tahajjud', time: '01:35 AM - 04:45 AM' },
    { name: 'Ishraq', time: '06:15 AM - 12:00 PM' },
    { name: 'Chasht', time: '09:00 AM - 12:00 PM' },
    { name: 'Awwabin', time: '06:15 PM - 07:30 PM' },
  ];

  return (
    <View className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('@/assets/mosque-bg.jpg')}
        className="flex-1"
        imageStyle={{ opacity: 0.6 }}
      >
        <SafeAreaView className="flex-1">
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
            className="flex-1"
          >
            <Animated.View className="flex-1 p-4" style={{ opacity: fadeAnim }}>
              {/* Header */}
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-white text-xl font-bold">Prayer Times</Text>
              </View>

              {/* Next Prayer Card */}
              <LinearGradient
                colors={[
                  nextPrayer.name === 'Fajr' ? '#1e3a8a' :
                  nextPrayer.name === 'Dhuhr' ? '#d97706' :
                  nextPrayer.name === 'Asr' ? '#b45309' :
                  nextPrayer.name === 'Maghrib' ? '#581c87' : '#312e81',
                  'rgba(0,0,0,0.7)',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-2xl p-5"
              >
                <View className="items-center">
                  <Text className="text-white text-base">Dhaka, Bangladesh</Text>
                  <Text className="text-white text-2xl font-bold mt-2">{todaySchedule.Date}</Text>
                </View>
                <View className="bg-black/30 rounded-lg p-3 mt-2">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-white text-base">
                      Coming Up: {nextPrayer.name} : {nextPrayer.time}
                    </Text>
                    <Text className="text-white text-xl font-bold">{getTimeRemaining()}</Text>
                  </View>
                  <View className="mt-2 bg-gray-700/50 rounded-full h-3">
                    <View
                      className="bg-white rounded-full h-3"
                      style={{ width: `${getPrayerProgress()}%` }}
                    />
                  </View>
                </View>
              </LinearGradient>

              {/* Sehri and Iftar Cards */}
              <Text className="text-white text-lg font-bold mt-6 mb-3">Today's Iftar & Sehri</Text>
              <View className="flex-row space-x-3 mb-4">
                <LinearGradient
                  colors={['rgba(22, 101, 52, 0.8)', 'rgba(16, 70, 40, 0.9)']}
                  className="flex-1 p-2 rounded-xl"
                >
                  <View className="items-center">
                    <View className="mb-2 flex flex-row items-center gap-2">
                      <MaterialCommunityIcons name="food-variant" size={24} color="white" />
                      <Text className="text-white text-lg font-bold">Sehri</Text>
                    </View>
                    <Text className="text-white text-xl mt-1">{todaySchedule.Sehri || 'Not Available'}</Text>
                  </View>
                </LinearGradient>
                <LinearGradient
                  colors={['rgba(154, 52, 18, 0.8)', 'rgba(124, 45, 18, 0.9)']}
                  className="flex-1 p-2 rounded-xl"
                >
                  <View className="items-center">
                    <View className="mb-2 flex flex-row items-center gap-2">
                      <MaterialCommunityIcons name="food" size={24} color="white" />
                      <Text className="text-white text-lg font-bold">Iftar</Text>
                    </View>
                    <Text className="text-white text-xl mt-1">{todaySchedule.Iftar || 'Not Available'}</Text>
                  </View>
                </LinearGradient>
              </View>

              {/* Prayer Times List */}
              <Text className="text-white text-lg font-bold mb-3">Today's Prayer Schedule</Text>
              <ScrollView>
                {prayerTimes.map((prayer) => (
                  <LinearGradient
                    key={prayer.name}
                    colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)']}
                    className={`mb-3 rounded-xl p-4 flex-row justify-between items-center ${
                      nextPrayer.name === prayer.name ? 'border-l-4 border-white' : ''
                    }`}
                  >
                    <View className="flex-row items-center">
                      <View
                        className={`w-10 h-10 rounded-full bg-opacity-80 items-center justify-center ${
                          prayer.name === 'Fajr' ? 'bg-blue-800' :
                          prayer.name === 'Dhuhr' ? 'bg-amber-600' :
                          prayer.name === 'Asr' ? 'bg-orange-700' :
                          prayer.name === 'Maghrib' ? 'bg-purple-800' : 'bg-indigo-800'
                        }`}
                      >
                        <MaterialCommunityIcons name={prayer.icon} size={20} color="white" />
                      </View>
                      <View className="ml-3">
                        <Text className="text-white text-lg font-bold">{prayer.name}</Text>
                        {nextPrayer.name === prayer.name && (
                          <Text className="text-white text-xs opacity-80">Coming up next</Text>
                        )}
                      </View>
                    </View>
                    <Text className="text-white text-xl font-bold">{prayer.time || 'Not Available'}</Text>
                  </LinearGradient>
                ))}

                {/* Additional Features */}
                <View className="flex-row mb-6">
                  <TouchableOpacity
                    className="flex-1 bg-indigo-800/80 p-4 items-center"
                    onPress={() => setShowMonthlyModal(true)}
                  >
                    <FontAwesome5 name="calendar-alt" size={24} color="white" />
                    <Text className="text-white text-base font-bold mt-2">Monthly View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 bg-indigo-500/80 p-4 items-center"
                    onPress={() => setShowQiblaModal(true)} // Open Qibla modal
                  >
                    <FontAwesome5 name="compass" size={24} color="white" />
                    <Text className="text-white text-base font-bold mt-2">Nafl Time</Text>
                  </TouchableOpacity>
                </View>

                {/* Quran Verse */}
                <LinearGradient
                  colors={['rgba(30, 58, 138, 0.8)', 'rgba(30, 58, 138, 0.6)']}
                  className="p-5 rounded-xl"
                >
                  <View className="items-center">
                    <Image
                      source={require('@/assets/quran-icon.png')}
                      className="w-12 h-12 mb-2"
                      style={{ tintColor: 'white' }}
                    />
                    <Text className="text-white text-lg font-bold">Verse of the Day</Text>
                  </View>
                  <Text className="text-white text-center italic mb-2">
                    "Indeed, prayer has been decreed upon the believers at specified times."
                  </Text>
                  <Text className="text-white text-center font-bold">Surah An-Nisa 4:103</Text>
                </LinearGradient>
              </ScrollView>
            </Animated.View>

            {/* Monthly Schedule Modal */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={showMonthlyModal}
              onRequestClose={() => setShowMonthlyModal(false)}
            >
              <View className="flex-1 bg-black/70">
                <SafeAreaView className="flex-1">
                  <View className="bg-gray-900 m-4 rounded-2xl flex-1">
                    <View className="flex-row justify-between items-center p-4 border-b border-gray-800">
                      <Text className="text-white text-xl font-bold">2025 Prayer Schedule</Text>
                      <TouchableOpacity onPress={() => setShowMonthlyModal(false)} className="p-2">
                        <Ionicons name="close" size={24} color="white" />
                      </TouchableOpacity>
                    </View>
                    <ScrollView className="p-4">
                      {namazSchedule.dhaka.map((day) => (
                        <View key={day.Date} className="mb-4 p-4 bg-gray-800/60 rounded-xl">
                          <Text className="text-white text-lg font-bold mb-2">{day.Date}</Text>
                          <View className="flex-row flex-wrap justify-between">
                            <View>
                              <Text className="text-white">Fajr: {day.Fajr}</Text>
                              <Text className="text-white">Dhuhr: {day.Dhuhr}</Text>
                              <Text className="text-white">Asr: {day.Asr}</Text>
                            </View>
                            <View>
                              <Text className="text-white">Maghrib: {day.Maghrib}</Text>
                              <Text className="text-white">Isha: {day.Isha}</Text>
                            </View>
                            <View className="flex justify-between">
                              <Text className="text-yellow-300">{`Sehri: ${day.Sehri} - Iftar: ${day.Iftar}`}</Text>
                            </View>
                          </View>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                </SafeAreaView>
              </View>
            </Modal>

            {/* Qibla Finder Modal with Bangla Nafl Time Schedule */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={showQiblaModal}
              onRequestClose={() => setShowQiblaModal(false)}
            >
              <View className="flex-1 bg-black/70">
                <SafeAreaView className="flex-1">
                  <View className="bg-gray-900 m-4 rounded-2xl flex-1">
                    <View className="flex-row justify-between items-center p-4 border-b border-gray-800">
                      <Text className="text-white text-xl font-bold">Qibla Finder & Nafl Schedule</Text>
                      <TouchableOpacity onPress={() => setShowQiblaModal(false)} className="p-2">
                        <Ionicons name="close" size={24} color="white" />
                      </TouchableOpacity>
                    </View>
                    <ScrollView className="p-4">
                      {/* Placeholder for Qibla Finder */}
                      <View className="mb-4 p-4 bg-gray-800/60 rounded-xl">
                        <Text className="text-white text-lg font-bold mb-2">Qibla Direction</Text>
                        <Text className="text-white">Qibla direction feature coming soon...</Text>
                        {/* In a real app, you’d integrate a Qibla finder API or compass here */}
                      </View>

                      {/* Bangla Nafl Time Schedule */}
                      <View className="mb-4 p-4 bg-gray-800/60 rounded-xl">
                        <Text className="text-white text-lg font-bold mb-2">
                          Bangla Nafl Time Schedule - {todaySchedule.Date}
                        </Text>
                        {naflTimes.map((nafl) => (
                          <View key={nafl.name} className="flex-row justify-between py-2">
                            <Text className="text-white text-base">{nafl.name}</Text>
                            <Text className="text-white text-base">{nafl.time}</Text>
                          </View>
                        ))}
                      </View>
                    </ScrollView>
                  </View>
                </SafeAreaView>
              </View>
            </Modal>
          </LinearGradient>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}