import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '@/store/useStore';
import { foods } from '@/data/foods.json';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useState } from 'react';

// Reimagined FoodCard with quantity controls
const CompactFoodCard = ({ food, isSelected }) => {
  const { toggleFoodSelection, updateFoodQuantity } = useStore();
  const [quantity, setQuantity] = useState(1);
  
  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    if (isSelected) {
      updateFoodQuantity(food.id, newQuantity);
    }
  };
  
  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      if (isSelected) {
        updateFoodQuantity(food.id, newQuantity);
      }
    }
  };
  
  const handleToggle = () => {
    toggleFoodSelection(food, quantity);
  };
  
  return (
    <Pressable
      className={`mb-3 rounded-xl overflow-hidden ${isSelected ? 'border border-amber-500' : 'border border-transparent'}`}
      onPress={handleToggle}
    >
      <View className="flex-row h-20 bg-slate-700 rounded-xl overflow-hidden">
        <View className="flex-1 justify-center p-3">
          <Text className="text-white font-semibold text-base">{food.name}</Text>
          <View className="flex-row justify-between mt-1">
            {/* <Text className="text-slate-300 text-xs">{food.portions[0].amount} {food.portions[0].unit}</Text> */}
            <Text className="text-amber-500 font-bold">{Math.round(food.portions[0].calories * quantity)} cal</Text>
          </View>
        </View>
        
        {/* Quantity controls */}
        <View className="justify-center pr-3 pl-1">
          <View className="flex-row items-center bg-slate-800 rounded-lg overflow-hidden">
            <Pressable 
              className="w-8 h-8 items-center justify-center bg-slate-900"
              onPress={handleDecrease}
            >
              <MaterialCommunityIcons name="minus" size={16} color={quantity > 1 ? "#F59E0B" : "#94A3B8"} />
            </Pressable>
            
            <View className="w-8 h-8 items-center justify-center">
              <Text className="text-white font-medium">{quantity}</Text>
            </View>
            
            <Pressable 
              className="w-8 h-8 items-center justify-center bg-slate-900"
              onPress={handleIncrease}
            >
              <MaterialCommunityIcons name="plus" size={16} color="#F59E0B" />
            </Pressable>
          </View>
        </View>
        
        {isSelected && (
          <View className="absolute top-2 right-2 bg-amber-500 rounded-full p-1">
            <MaterialCommunityIcons name="check" size={14} color="#FFF" />
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default function CaloriesScreen() {
  const { selectedFoods, clearFoodSelections } = useStore();
  
  const totalCalories = Object.values(selectedFoods).reduce((total, food) => {
    return total + (food.portions[0].calories * (food.quantity || 1));
  }, 0);

  return (
    <SafeAreaView className="flex-1 bg-gray-900" edges={['top']}>
      {/* Header with gradient-like background */}
      <View className="px-5 pt-4 pb-5">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-2xl font-bold text-white">
            Calorie <Text className="text-amber-500">Tracker</Text>
          </Text>
          {Object.keys(selectedFoods).length > 0 && (
            <Pressable 
              className="flex-row items-center bg-red-500/10 px-3 py-1.5 rounded-full"
              onPress={clearFoodSelections}
            >
              <MaterialCommunityIcons name="trash-can-outline" size={16} color="#EF4444" />
              <Text className="text-red-500 font-medium text-sm ml-1">Clear</Text>
            </Pressable>
          )}
        </View>
        
        {/* Summary Card */}
        <View className="bg-slate-700/60 rounded-xl p-3 flex-row justify-between items-center">
          <View>
            <Text className="text-slate-400 text-xs">Today's intake</Text>
            <Text className="text-white text-lg font-bold">
              {totalCalories > 0 ? Math.round(totalCalories) : 0} <Text className="text-sm font-normal text-slate-300">calories</Text>
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-amber-500/20 items-center justify-center mr-2">
              <MaterialCommunityIcons name="silverware-fork-knife" size={20} color="#F59E0B" />
            </View>
            <Text className="text-sm text-slate-300">{Object.keys(selectedFoods).length} items</Text>
          </View>
        </View>
      </View>
      
      {/* Food List */}
      <View className="px-4 py-3 flex-row items-center justify-between">
        <Text className="text-white font-semibold">Food Items</Text>
        <Text className="text-slate-400 text-xs">{foods.length} available</Text>
      </View>
      
      <ScrollView 
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      >
        {foods.map((food) => (
          <CompactFoodCard 
            key={food.id} 
            food={food} 
            isSelected={selectedFoods[food.id] !== undefined}
          />
        ))}
        <View className="h-20" /> {/* Extra space for the floating bar */}
      </ScrollView>
      
      {/* Floating Summary Bar */}
      {Object.keys(selectedFoods).length > 0 && (
        <View className="absolute bottom-6 left-4 right-4">
          <BlurView intensity={80} className="rounded-xl overflow-hidden">
            <View className="bg-slate-800/80 px-4 py-3 flex-row justify-between items-center rounded-xl">
              <View>
                <Text className="text-white font-bold">Total Calories</Text>
                <Text className="text-amber-500 font-bold text-lg">{Math.round(totalCalories)}</Text>
              </View>
              <Pressable className="bg-amber-500 py-2 px-4 rounded-lg">
                <Text className="text-white font-semibold">Save Log</Text>
              </Pressable>
            </View>
          </BlurView>
        </View>
      )}
    </SafeAreaView>
  );
}