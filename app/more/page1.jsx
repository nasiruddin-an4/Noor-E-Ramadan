import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import foods from '@/data/foods.json';

export default function FoodCalculatorPage() {
  const [selectedFoods, setSelectedFoods] = useState({});
  const [showCalculator, setShowCalculator] = useState(false);
  const slideAnim = useState(new Animated.Value(100))[0];

  useEffect(() => {
    const hasSelectedFoods = Object.keys(selectedFoods).length > 0;
    if (hasSelectedFoods && !showCalculator) {
      setShowCalculator(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (!hasSelectedFoods && showCalculator) {
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowCalculator(false));
    }
  }, [selectedFoods]);

  const handleSelectFood = (food) => {
    setSelectedFoods(prev => {
      const baseSize = food.portions?.[0]?.size ? parseInt(food.portions[0].size) : 100;
      const baseCalories = food.portions?.[0]?.calories ? parseInt(food.portions[0].calories) : 0;
      if (prev[food.id]) {
        const { [food.id]: removed, ...rest } = prev;
        return rest;
      } else {
        return {
          ...prev,
          [food.id]: { 
            ...food, 
            customAmount: baseSize,
            baseSize: baseSize,
            baseCalories: baseCalories
          }
        };
      }
    });
  };

  const handleAmountChange = (foodId, amount) => {
    const numericAmount = parseInt(amount) || 0;
    setSelectedFoods(prev => ({
      ...prev,
      [foodId]: { ...prev[foodId], customAmount: numericAmount }
    }));
  };

  const incrementAmount = (foodId) => {
    setSelectedFoods(prev => {
      const food = prev[foodId];
      const step = food.baseSize >= 100 ? 50 : 10;
      return {
        ...prev,
        [foodId]: { ...food, customAmount: (food.customAmount || food.baseSize) + step }
      };
    });
  };

  const decrementAmount = (foodId) => {
    setSelectedFoods(prev => {
      const food = prev[foodId];
      const step = food.baseSize >= 100 ? 50 : 10;
      const newAmount = Math.max(step, (food.customAmount || food.baseSize) - step);
      return {
        ...prev,
        [foodId]: { ...food, customAmount: newAmount }
      };
    });
  };

  const handleClearAll = () => setSelectedFoods({});

  const calculateTotalCalories = () => {
    return Object.values(selectedFoods).reduce((total, food) => {
      if (!food.baseSize || !food.baseCalories) return total;
      const customAmount = food.customAmount || food.baseSize;
      const calories = Math.round((customAmount / food.baseSize) * food.baseCalories);
      return total + calories;
    }, 0);
  };

  const totalCalories = calculateTotalCalories();
  const selectedCount = Object.keys(selectedFoods).length;

  const getCalorieColor = () => {
    if (totalCalories < 500) return ['#10B981', '#059669']; // Green
    if (totalCalories < 1000) return ['#F59E0B', '#D97706']; // Yellow
    return ['#EF4444', '#DC2626']; // Red
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="p-4">
        <Text className="text-gray-100 text-xl font-bold">Food Calculator</Text>
        <Text className="text-gray-400">Select foods to calculate total calories</Text>
      </View>
      
      {/* Food List */}
      <ScrollView 
        className="flex-1 px-4 py-4"
        contentContainerStyle={{ paddingBottom: showCalculator ? 180 : 20 }}
      >
        {foods.map((food) => (
          <TouchableOpacity 
            key={food.id}
            onPress={() => handleSelectFood(food)}
            className={`mb-3 p-4 rounded-xl flex-row items-center ${selectedFoods[food.id] ? 'bg-gray-800 border border-blue-900' : 'bg-gray-800'}`}
            style={{ elevation: 1 }}
          >
            <View className="w-12 h-12 bg-gray-700 rounded-full items-center justify-center mr-3">
              <Ionicons 
                name={selectedFoods[food.id] ? "checkmark-circle" : "nutrition"} 
                size={24} 
                color={selectedFoods[food.id] ? "#60A5FA" : "#9CA3AF"} 
              />
            </View>
            
            <View className="flex-1">
              <Text className="font-bold text-gray-100">{`${food.name} - ${food.nameBn}`}</Text>
              <Text className="text-gray-400">
                {food.portions?.[0]?.calories || 0} kcal per {food.portions?.[0]?.size || 100}{food.portions?.[0]?.unit || 'g'}
              </Text>
            </View>
            
            {selectedFoods[food.id] && (
              <View className="flex-row items-center">
                <TouchableOpacity 
                  onPress={() => decrementAmount(food.id)}
                  className="bg-gray-700 w-8 h-8 rounded-full items-center justify-center"
                >
                  <Ionicons name="remove" size={20} color="#D1D5DB" />
                </TouchableOpacity>
                
                <View className="flex-row items-center bg-gray-800 rounded-lg px-2 py-1 mx-2 border border-gray-700">
                  <TextInput
                    className="w-14 text-center font-medium text-gray-100"
                    keyboardType="numeric"
                    value={`${selectedFoods[food.id].customAmount}`}
                    onChangeText={(text) => handleAmountChange(food.id, text)}
                  />
                  <Text className="ml-1 text-gray-400">{food.portions?.[0]?.unit || 'g'}</Text>
                </View>
                
                <TouchableOpacity 
                  onPress={() => incrementAmount(food.id)}
                  className="bg-blue-600 w-8 h-8 rounded-full items-center justify-center"
                >
                  <Ionicons name="add" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Calculator */}
      {showCalculator && (
        <Animated.View 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <LinearGradient
            colors={getCalorieColor()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-t-xl p-4"
          >
            {/* Stats card */}
            <View className="bg-gray-800/50 rounded-xl p-4 mb-4">

              {/* <View className="flex-row justify-between items-center">
                <Text className="text-gray-200">Selected Items:</Text>
                <Text className="text-gray-100 font-bold">{selectedCount}</Text>
              </View> */}

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-200">Total Calories:</Text>
                <Text className="text-gray-100 font-bold text-xl">{totalCalories} kcal</Text>
              </View>
            </View>
            
            {/* Clear button */}
            <TouchableOpacity
              className="bg-gray-700/50 py-3 rounded-lg items-center"
              onPress={handleClearAll}
            >
              <Text className="text-gray-100 font-medium">Clear All</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}