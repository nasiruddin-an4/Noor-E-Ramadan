import { View, Text, TouchableOpacity, ScrollView, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import foodTipsData from "@/data/ramadanFoodTips.json";

export default function Page4() {
  const router = useRouter();
  const [expandedTip, setExpandedTip] = useState(null);
  const colorScheme = useColorScheme() || 'dark';

  const toggleTip = (id) => {
    setExpandedTip(expandedTip === id ? null : id);
  };

  return (
    <SafeAreaView className={`${colorScheme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} flex-1`}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View className="bg-gray-100 dark:bg-gray-900 p-5">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center p-2"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={26} className='text-gray-600 dark:text-white' />
            <Text className="text-gray-600 dark:text-white text-lg font-semibold ml-2">Back</Text>
          </TouchableOpacity>
          
          <Text className="text-gray-600 dark:text-white text-lg font-bold">রমজানের খাবার টিপস</Text>
          <TouchableOpacity className="p-2" activeOpacity={0.7}>
            <Ionicons name="search" size={26} className='text-gray-600 dark:text-white' />
          </TouchableOpacity>
        </View>
      </View>

      {/* Food Tips List */}
      <ScrollView className="flex-1 px-4">
        {foodTipsData.foodTips.map((tip) => {
          const isExpanded = expandedTip === tip.id;

          return (
            <View key={tip.id} className="mb-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              {/* Tip Header */}
              <TouchableOpacity
                onPress={() => toggleTip(tip.id)}
                className="p-4 flex-row justify-between items-center"
                activeOpacity={0.85}
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                    <Text className="text-white font-bold">{tip.id}</Text>
                  </View>
                  <Text className="text-gray-900 dark:text-gray-100 text-lg font-semibold flex-shrink">
                    {tip.title}
                  </Text>
                </View>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colorScheme === 'dark' ? "#A0AEC0" : "#4A5568"}
                />
              </TouchableOpacity>

              {/* Tip Description */}
              {isExpanded && (
                <View className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <Text className="text-gray-700 dark:text-gray-300 text-base leading-6">
                    {tip.description}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
