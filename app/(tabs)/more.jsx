import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

export default function MoreScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'dark';
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const cards = [
    {
      title: 'Food Calories',
      path: '/more/page1',
      iconName: 'flame',
      gradient: ['#F59E0B', '#D97706'],
    },
    {
      title: 'Read Al-Quran',
      path: '/more/page2',
      iconName: 'book',
      gradient: ['#10B981', '#059669'],
    },
    {
      title: 'Read Hadith',
      path: '/more/page3',
      iconName: 'book-outline',
      gradient: ['#8B5CF6', '#6D28D9'],
    },
    {
      title: 'Dua List',
      path: '/more/page5',
      iconName: 'document-text',
      gradient: ['#3B82F6', '#1D4ED8'],
    },
    {
      title: 'Ramadan Schedule',
      path: '/more/page6',
      iconName: 'time',
      gradient: ['#EC4899', '#DB2777'],
    },
    {
      title: 'আল্লাহর ৯৯টি নাম',
      path: '/more/page7',
      iconName: 'compass',
      gradient: ['#14B8A6', '#0D9488'],
    },
  ];

  const themeStyles = {
    light: {
      background: 'bg-gray-50',
      text: 'text-gray-800',
      subText: 'text-gray-600',
      border: 'border-gray-200',
    },
    dark: {
      background: 'bg-gray-900',
      text: 'text-gray-100',
      subText: 'text-gray-400',
      border: 'border-gray-800',
    },
  };

  const styles = themeStyles[colorScheme];

  return (
    <SafeAreaView className={`flex-1 ${styles.background}`}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <ScrollView className="flex-1 px-4 pt-6 ">
        <View className="mb-6">
          <Text className={`text-3xl font-bold ${styles.text}`}>
            Explore More
          </Text>
          <Text className={`text-base ${styles.subText} mt-1`}>
            Discover useful tools and resources
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-between pb-5">
          {cards.map((card, index) => (
            <TouchableOpacity
              key={index}
              className={`w-[48%] mb-4 rounded-2xl overflow-hidden ${hoveredIndex === index ? 'scale-105' : 'scale-100'
                } transition-all duration-200`}
              onPress={() => router.push(card.path)}
              onPressIn={() => setHoveredIndex(index)}
              onPressOut={() => setHoveredIndex(null)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={card.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="items-center justify-between p-5 h-44" // Fixed height added
              >
                <View className="items-center">
                  <View className="items-center justify-center w-16 h-16 mb-4 rounded-full bg-white/20">
                    <Ionicons name={card.iconName} size={32} color="white" />
                  </View>
                  <Text
                    className="px-2 text-lg font-semibold text-center text-white"
                    numberOfLines={2} // Limit to 2 lines
                    ellipsizeMode="tail" // Add ellipsis if text overflows
                  >
                    {card.title}
                  </Text>
                </View>
                <View className="w-12 h-1 rounded-full bg-white/30" />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
