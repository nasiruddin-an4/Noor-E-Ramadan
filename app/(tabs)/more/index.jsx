import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MoreScreen() {
  const router = useRouter();
  
  const cards = [
    { title: 'Calories', path: '/more/calories', iconName: 'fast-food' },
    { title: 'Loved', path: '/more/loved', iconName: 'heart' },
    { title: 'Notifications', path: '/more/notifications', iconName: 'notifications' },
    { title: 'Reports', path: '/more/reports', iconName: 'flag' },
    { title: 'Help', path: '/more/help', iconName: 'help-circle' },
    { title: 'Advanced Settings', path: '/more/advanced', iconName: 'settings' },
  ];
  
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView className="flex-1">
        <View className="px-4 pt-6 pb-6">
          <Text className="text-white text-2xl font-bold mb-6">More Options</Text>
          <View className="flex-row flex-wrap justify-between">
            {cards.map((card, index) => (
              <TouchableOpacity
                key={index}
                className="w-[48%] mb-4 bg-gray-800 rounded-xl overflow-hidden shadow-lg"
                onPress={() => router.push(card.path)}
              >
                <View className="p-4 items-center">
                  <View className="w-12 h-12 rounded-full bg-gray-700 items-center justify-center mb-3">
                    <Ionicons name={card.iconName} size={24} color="#F59E0B" />
                  </View>
                  <Text className="text-white text-base font-medium text-center px-1">
                    {card.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}