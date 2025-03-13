import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import FoodCard from '@/components/FoodCard';
import foods from '@/data/foods.json';
import { useStore } from '@/store/useStore';

export default function Page1() {
  const router = useRouter();
  const { selectedFoods, clearSelectedFoods } = useStore();

  const calculateTotalCalories = () => {
    return Object.values(selectedFoods).reduce((total, food) => {
      const basePortion = parseInt(food.portions[0].size) || 100;
      const baseCalories = food.portions[0].calories;
      const customAmount = food.customAmount || 100;
      const calories = Math.round((customAmount / basePortion) * baseCalories);
      return total + calories;
    }, 0);
  };

  const totalCalories = calculateTotalCalories();
  const selectedCount = Object.keys(selectedFoods).length;

  const handleClearAll = () => {
    clearSelectedFoods();
    console.log('Cleared selected foods:', selectedFoods); // Debug log
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="p-4">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center mb-4">
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text className="text-white text-lg ml-2">Back</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold mb-4">Food List</Text>
      </View>
      <ScrollView className="flex-1 px-4">
        {foods.map((food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </ScrollView>
      <View className="bg-gray-800 p-4 border-t border-gray-700">
        <Text className="text-white text-lg font-semibold mb-2">Calorie Calculator</Text>
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-300 text-base">Selected Items: {selectedCount}</Text>
          <Text className="text-white text-xl font-bold">Total: {totalCalories} kcal</Text>
        </View>
        {selectedCount > 0 && (
          <TouchableOpacity
            className="mt-3 bg-red-600 py-2 px-4 rounded-lg"
            onPress={handleClearAll} // Use handler for debugging
          >
            <Text className="text-white text-center font-medium">Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}