import { View, Text, TouchableOpacity, ScrollView, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MoreScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'dark'; // Default to dark if null

  const cards = [
    { title: 'Food Calories', path: '/more/page1', iconName: 'flame' },
    { title: 'Read Al-Quran', path: '/more/page2', iconName: 'book' },
    { title: 'Read Hadith', path: '/more/page3', iconName: 'book-outline' },
    { title: 'Ramadan Food Tips', path: '/more/page4', iconName: 'fast-food' },
    { title: 'Dua List', path: '/more/page5', iconName: 'help-circle' },
    { title: 'Advanced Settings', path: '/more/page6', iconName: 'settings' },
  ];

  // Theme-based Tailwind classes
  const themeStyles = {
    light: {
      background: 'bg-gray-100', // Soft light gray
      text: 'text-gray-900', // Dark gray for contrast
      cardBackground: 'bg-white', // White cards
      cardIconBackground: 'bg-gray-200', // Light gray icon bg
      iconColor: '#D97706', // Amber-600 for icons
      shadow: 'shadow-sm', // Subtle shadow
    },
    dark: {
      background: 'bg-gray-900', // Dark gray background
      text: 'text-gray-100', // Light gray text
      cardBackground: 'bg-gray-800', // Darker gray cards
      cardIconBackground: 'bg-gray-700', // Slightly lighter gray for icons
      iconColor: '#F59E0B', // Amber-500 for icons
      shadow: 'shadow-md', // Slightly stronger shadow
    },
  };

  const styles = themeStyles[colorScheme];

  return (
    <SafeAreaView className={`flex-1 ${styles.background}`}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView className="flex-1 p-4">
        <Text className={`text-2xl font-bold mb-6 ${styles.text}`}>More Options</Text>
        <View className="flex-row flex-wrap justify-between">
          {cards.map((card, index) => (
            <TouchableOpacity
              key={index}
              className={`w-[48%] ${styles.cardBackground} rounded-xl p-6 mb-4 items-center ${styles.shadow}`}
              onPress={() => router.push(card.path)}
              activeOpacity={0.8} // Subtle touch feedback
            >
              <View
                className={`w-14 h-14 ${styles.cardIconBackground} rounded-full flex items-center justify-center mb-3`}
              >
                <Ionicons name={card.iconName} size={28} color={styles.iconColor} />
              </View>
              <Text className={`text-lg font-medium text-center ${styles.text}`}>
                {card.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}