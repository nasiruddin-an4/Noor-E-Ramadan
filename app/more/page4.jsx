import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import foodTipsData from "@/data/ramadanFoodTips.json";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export default function Page4() {
  const router = useRouter();
  const [expandedTip, setExpandedTip] = useState(null);

  const toggleTip = (id) => {
    setExpandedTip(expandedTip === id ? null : id);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />

      {/* Header */}
        <View className="flex-row items-center justify-between p-5">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center p-2 rounded-full bg-gray-800/50"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={18} color="#D1D5DB" />
          </TouchableOpacity>
          
          <Text className="text-gray-100 text-xl font-bold">রমজানের খাবার টিপস</Text>
          <View className="w-10" /> {/* Spacer for symmetry */}
        </View>

      {/* Food Tips List */}
      <ScrollView className="flex-1 px-4 py-2">
        {foodTipsData.foodTips.map((tip) => {
          const isExpanded = expandedTip === tip.id;
          const animation = useSharedValue(isExpanded ? 1 : 0);

          const animatedStyle = useAnimatedStyle(() => ({
            height: withSpring(isExpanded ? 'auto' : 0),
            opacity: withSpring(isExpanded ? 1 : 0),
          }));

          return (
            <View 
              key={tip.id} 
              className="mb-4 rounded-xl overflow-hidden bg-gray-800 shadow-lg border border-gray-700/50"
            >
              {/* Tip Header */}
              <TouchableOpacity
                onPress={() => toggleTip(tip.id)}
                className="p-4 flex-row justify-between items-center bg-gray-800"
                activeOpacity={0.85}
              >
                <View className="flex-row items-center flex-1">
                  <LinearGradient
                    colors={['#4B5563', '#374151']}
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  >
                    <Text className="text-gray-100 font-bold">{tip.id}</Text>
                  </LinearGradient>
                  <Text 
                    className="text-gray-100 text-lg font-semibold flex-shrink"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {tip.title}
                  </Text>
                </View>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>

              {/* Tip Description */}
              {isExpanded && (
                <Animated.View style={[animatedStyle, { overflow: 'hidden' }]}>
                  <View className="p-4 bg-gray-850 border-t border-gray-700">
                    <Text className="text-gray-300 text-base leading-6">
                      {tip.description}
                    </Text>
                  </View>
                </Animated.View>
              )}
            </View>
          );
        })}
        <View className="h-5" /> {/* Bottom padding */}
      </ScrollView>
    </SafeAreaView>
  );
}