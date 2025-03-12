import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Star, Heart, Bell, Flag, HelpCircle, Settings } from 'lucide-react-native';

export default function MoreScreen() {
  const router = useRouter();

  const cards = [
    { title: 'Zakat Calculator', path: '/screen1', icon: <Star size={24} color="#F59E0B" /> },
    { title: 'Loved', path: '/screen2', icon: <Heart size={24} color="#F59E0B" /> },
    { title: 'Notifications', path: '/screen3', icon: <Bell size={24} color="#F59E0B" /> },
    { title: 'Reports', path: '/screen4', icon: <Flag size={24} color="#F59E0B" /> },
    { title: 'Help', path: '/screen5', icon: <HelpCircle size={24} color="#F59E0B" /> },
    { title: 'Advanced Settings', path: '/screen6', icon: <Settings size={24} color="#F59E0B" /> },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView className="flex-1">
        <View className="px-4 pt-12 pb-6">
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
                    {card.icon}
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