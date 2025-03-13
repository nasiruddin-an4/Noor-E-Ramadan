import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import quranData from '@/data/quran_bn.json';
import { useState } from 'react';

export default function Page2() {
  const router = useRouter();
  const [expandedSurah, setExpandedSurah] = useState(null);

  const toggleSurah = (id) => {
    if (expandedSurah === id) {
      setExpandedSurah(null);
    } else {
      setExpandedSurah(id);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <StatusBar barStyle="light-content" backgroundColor="#030712" />
      
      {/* Header with gradient background */}
      <View className="bg-emerald-900 px-4 py-3 border-b border-emerald-800">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="flex-row items-center"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
            <Text className="text-white text-lg ml-2 font-medium">Back</Text>
          </TouchableOpacity>
          
          <Text className="text-white text-xl font-bold">Al-Quran</Text>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Surah List */}
      <ScrollView className="flex-1">
        {quranData.map((surah) => (
          <View key={surah.id} className="mb-2">
            {/* Surah Header - Always visible */}
            <TouchableOpacity 
              onPress={() => toggleSurah(surah.id)}
              className="bg-gray-800 px-4 py-3 border-l-4 border-emerald-600 flex-row justify-between items-center"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-emerald-800 rounded-full items-center justify-center mr-3">
                  <Text className="text-white font-bold">{surah.id}</Text>
                </View>
                <View>
                  <Text className="text-white text-lg font-bold">{surah.name}</Text>
                  <Text className="text-emerald-400 text-sm">{surah.transliteration} • {surah.type}</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-gray-300">{surah.translation}</Text>
                <View className="flex-row items-center mt-1">
                  <MaterialIcons name="format-list-numbered" size={14} color="#9CA3AF" />
                  <Text className="text-gray-400 text-xs ml-1">{surah.total_verses} verses</Text>
                  <Ionicons 
                    name={expandedSurah === surah.id ? "chevron-up" : "chevron-down"} 
                    size={16} 
                    color="#9CA3AF" 
                    style={{ marginLeft: 8 }}
                  />
                </View>
              </View>
            </TouchableOpacity>

            {/* Verses - Shown only when expanded */}
            {expandedSurah === surah.id && (
              <View className="bg-gray-900">
                {surah.verses.map((verse) => (
                  <View key={verse.id} className="px-4 py-3 border-b border-gray-800">
                    {/* Verse number indicator */}
                    <View className="flex-row items-center mb-3">
                      <View className="w-8 h-8 bg-gray-700 rounded-full items-center justify-center mr-2">
                        <Text className="text-white text-sm">{verse.id}</Text>
                      </View>
                      <Text className="text-gray-400 text-xs">Verse {verse.id}</Text>
                    </View>
                    
                    {/* Arabic text - right aligned */}
                    <Text className="text-white text-2xl leading-10 text-right font-medium mb-2" style={{ fontFamily: 'System' }}>
                      {verse.text}
                    </Text>
                    
                    {/* Bengali translation - left aligned */}
                    <View className="bg-gray-800 rounded-lg p-3 mt-1">
                      <Text className="text-gray-300 text-base">
                        {verse.translation}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}