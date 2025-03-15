import React, { useState } from 'react';
import { View, Text, FlatList, StatusBar, TouchableOpacity, Clipboard, Alert, LayoutAnimation, Platform, UIManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import duaListData from '@/data/duaList.json';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Page5() {
  const duas = duaListData.duas;
  const [expandedDua, setExpandedDua] = useState(null);

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedDua(expandedDua === id ? null : id);
  };

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    Alert.alert('Copied!', 'The text has been copied to your clipboard.');
  };

  const renderDuaItem = ({ item }) => {
    const isExpanded = expandedDua === item.id;

    return (
      <View className="mb-1 rounded-xl bg-gray-800 overflow-hidden border border-gray-700/50 shadow-lg">
        {/* Header */}
        <TouchableOpacity
          className="p-4 flex-row justify-between items-center bg-gray-800"
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.85}
        >
          <Text 
            className="text-lg font-semibold text-gray-100 flex-shrink"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#60A5FA"
          />
        </TouchableOpacity>

        {/* Expanded Content */}
        {isExpanded && (
          <View className="p-4 bg-gray-850 border-t border-gray-700">
            {/* Arabic */}
            <View className="mb-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm font-medium text-gray-400">আরবি:</Text>
                <TouchableOpacity onPress={() => copyToClipboard(item.arabic)}>
                  <Ionicons name="copy-outline" size={20} color="#60A5FA" />
                </TouchableOpacity>
              </View>
              <Text className="text-lg text-gray-100 mt-2 font-arabic leading-8">
                {item.arabic}
              </Text>
            </View>

            {/* Transliteration */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-400">উচ্চারণ:</Text>
              <Text className="text-base text-gray-200 mt-2 leading-6 italic">
                {item.transliteration}
              </Text>
            </View>

            {/* Translation */}
            <View>
              <Text className="text-sm font-medium text-gray-400">অর্থ:</Text>
              <Text className="text-base text-gray-200 mt-2 leading-6">
                {item.translation}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      
        <Text className="text-xl font-bold text-gray-100 text-center pt-2">
          দোয়ার তালিকা
        </Text>

      {/* Dua List */}
      <FlatList
        data={duas}
        renderItem={renderDuaItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View className="h-2" />}
      />
    </SafeAreaView>
  );
}