import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import FoodCard from '@/components/FoodCard';
import foods from '@/data/foods.json'; // Import JSON data

export default function Page1() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-900 p-4">
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} className="flex-row items-center mb-4">
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text className="text-white text-lg ml-2">Back</Text>
      </TouchableOpacity>

      <Text className="text-white text-2xl font-bold mb-4">Food List</Text>

      <ScrollView className="flex-1">
        {foods.map(food => (
          <FoodCard key={food.id} food={food} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
