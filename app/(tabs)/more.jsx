import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MoreScreen() {
  const router = useRouter();

  const cards = [
    { title: 'Calories', path: '/more/page1', iconName: 'flame' },
    { title: 'Islamic Hadith', path: '/more/page2', iconName: 'book' },
    { title: 'Notifications', path: '/more/page3', iconName: 'notifications' },
    { title: 'Reports', path: '/more/page4', iconName: 'flag' },
    { title: 'Help', path: '/more/page5', iconName: 'help-circle' },
    { title: 'Advanced Settings', path: '/more/page6', iconName: 'settings' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView className="flex-1 p-4">
        <Text className="text-white text-2xl font-bold mb-6">More Options</Text>
        <View className="flex-row flex-wrap justify-between">
          {cards.map((card, index) => (
            <TouchableOpacity
              key={index}
              className="w-[48%] bg-gray-800 rounded-xl p-6 mb-4 items-center shadow-md"
              onPress={() => router.push(card.path)}
            >
              <View className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center mb-3">
                <Ionicons name={card.iconName} size={28} color="#F59E0B" />
              </View>
              <Text className="text-white text-lg font-medium text-center">{card.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
