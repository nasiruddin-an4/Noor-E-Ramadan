import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/useStore';
import { useState } from 'react';

export default function FoodCard({ food }) {
  const { selectedFoods, toggleFoodSelection } = useStore();
  const isSelected = !!selectedFoods[food.id];
  const [customAmount, setCustomAmount] = useState(100);

  const getUnit = () => {
    const sizeStr = food.portions[0].size;
    return sizeStr.replace(/[0-9]/g, '').trim();
  };

  const unit = getUnit() || 'g';

  const calculateCalories = () => {
    const basePortion = parseInt(food.portions[0].size) || 100;
    const baseCalories = food.portions[0].calories;
    return Math.round((customAmount / basePortion) * baseCalories);
  };

  const incrementAmount = () => setCustomAmount(prev => prev + 50);
  const decrementAmount = () => setCustomAmount(prev => Math.max(50, prev - 50));

  return (
    <Pressable
      className={`flex-row rounded-2xl mb-4 shadow-lg overflow-hidden p-4 ${
        isSelected ? 'bg-gray-800' : 'bg-gray-700'
      }`}
      onPress={() => toggleFoodSelection(food)}
    >
      <View className="w-2 bg-amber-500 opacity-80" />

      <View className="flex-1 ml-4">
        {/* Header */}
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-lg font-bold text-white">
            {food.name} - ({food.nameBn})
          </Text>
          {isSelected && (
            <View className="bg-amber-500 p-1 rounded-lg">
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            </View>
          )}
        </View>

        {/* Category */}
        <View className="bg-gray-600 px-3 py-1 rounded-full self-start mb-3">
          <Text className="text-xs font-semibold text-gray-300 capitalize">{food.category}</Text>
        </View>

        <View className="h-[1px] bg-gray-500 my-3" />

        {/* Calories & Portion Controls */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="flame" size={18} color="#F59E0B" />
            <Text className="text-xl font-bold text-amber-400 ml-2">{calculateCalories()}</Text>
            <Text className="text-sm text-gray-400 ml-1">calories</Text>
          </View>

          <View className="flex-row items-center">
            <Pressable
              className={`w-9 h-9 rounded-full flex items-center justify-center ${
                customAmount <= 50 ? 'bg-gray-500 opacity-50' : 'bg-gray-600'
              }`}
              onPress={decrementAmount}
              disabled={customAmount <= 50}
            >
              <Ionicons name="remove" size={18} color="#F8FAFC" />
            </Pressable>

            <View className="flex-row items-baseline px-4">
              <Text className="text-lg font-bold text-white">{customAmount}</Text>
              <Text className="text-sm text-gray-400 ml-1">{unit}</Text>
            </View>

            <Pressable className="w-9 h-9 bg-gray-600 rounded-full flex items-center justify-center" onPress={incrementAmount}>
              <Ionicons name="add" size={18} color="#F8FAFC" />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
