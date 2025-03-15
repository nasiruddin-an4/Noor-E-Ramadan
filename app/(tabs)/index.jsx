import {View,Text,TouchableOpacity,ScrollView,ImageBackground,StatusBar,Image,Animated,Modal,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {Ionicons,MaterialCommunityIcons,FontAwesome5,} from '@expo/vector-icons';
import namazSchedule from '@/data/namaz_schedule_2025.json';
import { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export default function PrayerTimesScreen() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fade in animation when screen loads
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Get today's prayer times
  const todaySchedule = namazSchedule.dhaka.find(
    (item) => item.Date === '14 March, 2025'
  );

  // Format current time
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // Format current date
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const prayerTimes = [
    {
      name: 'Fajr',
      time: todaySchedule.Fajr,
      icon: 'weather-sunset-up',
      color: 'from-blue-900 to-indigo-800',
    },
    {
      name: 'Dhuhr',
      time: todaySchedule.Dhuhr,
      icon: 'weather-sunny',
      color: 'from-amber-600 to-orange-500',
    },
    {
      name: 'Asr',
      time: todaySchedule.Asr,
      icon: 'weather-sunset',
      color: 'from-orange-700 to-red-600',
    },
    {
      name: 'Maghrib',
      time: todaySchedule.Maghrib,
      icon: 'weather-night',
      color: 'from-purple-900 to-violet-800',
    },
    {
      name: 'Isha',
      time: todaySchedule.Isha,
      icon: 'star',
      color: 'from-indigo-900 to-blue-900',
    },
  ];

  const getNextPrayer = () => {
    const minutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    return (
      prayerTimes.find((prayer) => {
        const [timeStr, period] = prayer.time.split(' ');
        const [hours, mins] = timeStr.split(':');
        let prayerMinutes =
          (period === 'PM' && hours !== '12'
            ? parseInt(hours) + 12
            : parseInt(hours)) *
          60 +
          parseInt(mins);
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
      (period === 'PM' && hours !== '12'
        ? parseInt(hours) + 12
        : parseInt(hours)) *
      60 +
      parseInt(mins);

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
    let currentPrayerIndex = -1;
    let nextPrayerIndex = 0;

    for (let i = 0; i < prayerTimes.length; i++) {
      const [timeStr, period] = prayerTimes[i].time.split(' ');
      const [hours, mins] = timeStr.split(':');
      let prayerMinutes =
        (period === 'PM' && hours !== '12'
          ? parseInt(hours) + 12
          : parseInt(hours)) *
        60 +
        parseInt(mins);

      if (prayerMinutes <= now) {
        currentPrayerIndex = i;
      }
    }

    nextPrayerIndex = (currentPrayerIndex + 1) % prayerTimes.length;

    let startTime, endTime;

    if (currentPrayerIndex === -1) {
      startTime = 24 * 60 - 1;
    } else {
      const [timeStr, period] = prayerTimes[currentPrayerIndex].time.split(' ');
      const [hours, mins] = timeStr.split(':');
      startTime =
        (period === 'PM' && hours !== '12'
          ? parseInt(hours) + 12
          : parseInt(hours)) *
        60 +
        parseInt(mins);
    }

    const [nextTimeStr, nextPeriod] =
      prayerTimes[nextPrayerIndex].time.split(' ');
    const [nextHours, nextMins] = nextTimeStr.split(':');
    endTime =
      (nextPeriod === 'PM' && nextHours !== '12'
        ? parseInt(nextHours) + 12
        : parseInt(nextHours)) *
      60 +
      parseInt(nextMins);

    if (
      nextPrayerIndex === 0 &&
      currentPrayerIndex === prayerTimes.length - 1
    ) {
      endTime += 24 * 60;
    }

    const totalDuration = endTime - startTime;
    const elapsed = now - startTime;
    return Math.floor((elapsed / totalDuration) * 100);
  };

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
              <View className="flex-row justify-between text-center items-center mb-2">
                
                <Text className="text-white text-xl font-bold">
                  Prayer Times
                </Text>
              </View>

              {/* Next Prayer Card */}
              <View className="">
                <LinearGradient
                  colors={[
                    nextPrayer.name === 'Fajr'
                      ? '#1e3a8a'
                      : nextPrayer.name === 'Dhuhr'
                        ? '#d97706'
                        : nextPrayer.name === 'Asr'
                          ? '#b45309'
                          : nextPrayer.name === 'Maghrib'
                            ? '#581c87'
                            : '#312e81',
                    'rgba(0,0,0,0.7)',
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="rounded-2xl p-5"
                >
                  <View className="items-center">
                    <Text className="text-white text-base ml-1">
                      Dhaka, Bangladesh
                    </Text>
                    <View className="flex-row items-center mt-2">
                      <Text className="text-white text-2xl font-bold">
                        {' '}
                        {formattedDate}
                      </Text>
                    </View>
                  </View>
                  <View className="bg-black/30 rounded-lg p-3 mt-2">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-white text-base">
                        Coming Up : {nextPrayer.name} : {nextPrayer.time}
                      </Text>
                      <Text className="text-white text-xl font-bold">
                        {getTimeRemaining()}
                      </Text>
                    </View>
                    <View className="mt-2 bg-gray-700/50 rounded-full h-3">
                      <View
                        className="bg-white rounded-full h-3"
                        style={{ width: `${getPrayerProgress()}%` }}
                      />
                    </View>
                  </View>
                </LinearGradient>
              </View>

              {/* Sehri and Iftar Cards */}
              <Text className="text-white text-lg font-bold mt-6 mb-3">
                Today Iftar & Sehri :{' '}
              </Text>
              <View className="flex-row space-x-3 mb-4">
                <LinearGradient
                  colors={['rgba(22, 101, 52, 0.8)', 'rgba(16, 70, 40, 0.9)']}
                  className="flex-1 p-2 rounded-xl"
                >
                  <View className="items-center">
                    <View className="mb-2 flex flex-row items-center gap-2">
                      <MaterialCommunityIcons
                        name="food-variant"
                        size={24}
                        color="white"
                      />
                      <Text className="text-white text-lg font-bold">
                        Sehri
                      </Text>
                    </View>
                    <Text className="text-white text-xl mt-1">
                      {todaySchedule.Sehri}
                    </Text>
                  </View>
                </LinearGradient>
                <LinearGradient
                  colors={['rgba(154, 52, 18, 0.8)', 'rgba(124, 45, 18, 0.9)']}
                  className="flex-1 p-2 rounded-xl"
                >
                  <View className="items-center">
                    <View className="mb-2 flex flex-row items-center gap-2">
                      <MaterialCommunityIcons
                        name="food"
                        size={24}
                        color="white"
                      />
                      <Text className="text-white text-lg font-bold">Iftar</Text>
                    </View>
                    <Text className="text-white text-xl mt-1">
                      {todaySchedule.Iftar}
                    </Text>
                  </View>
                </LinearGradient>
              </View>

              {/* Prayer Times List */}
              <Text className="text-white text-lg font-bold mb-3">
                Today's Pray Schedule
              </Text>
              <ScrollView className="">
                {prayerTimes.map((prayer) => (
                  <LinearGradient
                    key={prayer.name}
                    colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)']}
                    className={`mb-3 rounded-xl p-4 flex-row justify-between items-center ${nextPrayer.name === prayer.name
                        ? 'border-l-4 border-white'
                        : ''
                      }`}
                  >
                    <View className="flex-row items-center">
                      <View
                        className={`w-10 h-10 rounded-full bg-opacity-80 items-center justify-center ${prayer.name === 'Fajr'
                            ? 'bg-blue-800'
                            : prayer.name === 'Dhuhr'
                              ? 'bg-amber-600'
                              : prayer.name === 'Asr'
                                ? 'bg-orange-700'
                                : prayer.name === 'Maghrib'
                                  ? 'bg-purple-800'
                                  : 'bg-indigo-800'
                          }`}
                      >
                        <MaterialCommunityIcons
                          name={prayer.icon}
                          size={20}
                          color="white"
                        />
                      </View>
                      <View className="ml-3">
                        <Text className="text-white text-lg font-bold">
                          {prayer.name}
                        </Text>
                        {nextPrayer.name === prayer.name && (
                          <Text className="text-white text-xs opacity-80">
                            Coming up next
                          </Text>
                        )}
                      </View>
                    </View>
                    <Text className="text-white text-xl font-bold">
                      {prayer.time}
                    </Text>
                  </LinearGradient>
                ))}

                {/* Additional Features */}
                <View className="flex-row mb-6">
                  <TouchableOpacity
                    className="flex-1 bg-indigo-800/80 p-4 items-center"
                    onPress={() => setShowMonthlyModal(true)}
                  >
                    <FontAwesome5 name="calendar-alt" size={24} color="white" />
                    <Text className="text-white text-base font-bold mt-2">
                      Monthly View
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 bg-indigo-500/80 p-4 items-center"
                    onPress={() => {
                      /* Navigate to qibla direction */
                    }}
                  >
                    <FontAwesome5 name="compass" size={24} color="white" />
                    <Text className="text-white text-base font-bold mt-2">
                      Qibla Finder
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Quran Verse */}
                <LinearGradient
                  colors={['rgba(30, 58, 138, 0.8)', 'rgba(30, 58, 138, 0.6)']}
                  className="p-5 rounded-xl "
                >
                  <View className="items-center">
                    <Image
                      source={require('@/assets/quran-icon.png')}
                      className="w-12 h-12 mb-2"
                      style={{ tintColor: 'white' }}
                    />
                    <Text className="text-white text-lg font-bold">
                      Verse of the Day
                    </Text>
                  </View>
                  <Text className="text-white text-center italic mb-2">
                    "Indeed, prayer has been decreed upon the believers at
                    specified times."
                  </Text>
                  <Text className="text-white text-center font-bold">
                    Surah An-Nisa 4:103
                  </Text>
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
                      <Text className="text-white text-xl font-bold">
                        March 2025 Schedule
                      </Text>
                      <TouchableOpacity
                        onPress={() => setShowMonthlyModal(false)}
                        className="p-2"
                      >
                        <Ionicons name="close" size={24} color="white" />
                      </TouchableOpacity>
                    </View>

                    <ScrollView className="p-4">
                      {namazSchedule.dhaka.map((day) => (
                        <View
                          key={day.Date}
                          className="mb-4 p-4 bg-gray-800/60 rounded-xl"
                        >
                          <Text className="text-white text-lg font-bold mb-2">
                            {day.Date}
                          </Text>
                          <View className="flex-row flex-wrap justify-between">
                            <View>
                              <Text className="text-white">
                                Fajr: {day.Fajr}
                              </Text>
                              <Text className="text-white">
                                Dhuhr: {day.Dhuhr}
                              </Text>
                              <Text className="text-white">Asr: {day.Asr}</Text>
                            </View>
                            <View>
                              <Text className="text-white">
                                Maghrib: {day.Maghrib}
                              </Text>
                              <Text className="text-white">
                                Isha: {day.Isha}
                              </Text>
                            </View>
                            <View className="flex justify-between">
                              <Text className="text-yellow-300">{`Sehri: ${day.Sehri}        -       Iftar: ${day.Iftar}`}</Text>
                              {/* <Text className="text-orange-300">Iftar: {day.Iftar}</Text> */}
                            </View>
                          </View>
                        </View>
                      ))}
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
