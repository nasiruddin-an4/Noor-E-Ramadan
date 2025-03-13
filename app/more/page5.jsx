import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Clipboard,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Import the JSON data
import duaListData from '@/data/duaList.json';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function page5({ navigation }) {
  const colorScheme = useColorScheme() || 'dark';

  // Theme definitions
  const themeStyles = {
    light: {
      background: 'bg-gray-50',
      cardBackground: 'bg-white',
      text: 'text-gray-800',
      secondaryText: 'text-gray-500',
      border: 'border-gray-200',
      headerBackground: 'bg-blue-600',
      headerText: 'text-white',
      primary: 'text-blue-600',
      shadow: 'shadow-md',
      buttonText: 'text-white',
    },
    dark: {
      background: 'bg-gray-900',
      cardBackground: 'bg-gray-800',
      text: 'text-gray-100',
      secondaryText: 'text-gray-400',
      border: 'border-gray-700',
      headerBackground: 'bg-teal-900',
      headerText: 'text-white',
      primary: 'text-teal-400',
      shadow: 'shadow-lg',
      buttonText: 'text-white',
    },
  };

  const theme = themeStyles[colorScheme];

  // Access the duas array from the imported JSON data
  const duas = duaListData.duas;

  // State to track which dua is expanded
  const [expandedDua, setExpandedDua] = useState(null);

  // Toggle expand/collapse with animation
  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedDua(expandedDua === id ? null : id);
  };

  // Copy text to clipboard
  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    Alert.alert('Copied!', 'The text has been copied to your clipboard.');
  };

  // Render each dua item
  const renderDuaItem = ({ item }) => {
    const isExpanded = expandedDua === item.id;

    return (
      <View className={`mb-3 ${theme.cardBackground} rounded-xl ${theme.shadow}`}>
        <TouchableOpacity
          className={`px-4 py-4 flex-row justify-between items-center`}
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.9}
        >
          <Text className={`text-lg font-semibold ${theme.text}`}>
            {item.title}
          </Text>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.primary}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View className={`px-4 pb-4 border-t ${theme.border}`}>
            <View className="mt-3">
              <View className="flex-row justify-between items-center">
                <Text className={`text-sm font-medium ${theme.secondaryText}`}>
                  আরবি:
                </Text>
                <TouchableOpacity onPress={() => copyToClipboard(item.arabic)}>
                  <Ionicons
                    name="copy-outline"
                    size={20}
                    color={theme.primary}
                  />
                </TouchableOpacity>
              </View>
              <Text className={`text-lg ${theme.text} mt-1 font-arabic leading-7`}>
                {item.arabic}
              </Text>
            </View>

            <View className="mt-3">
              <Text className={`text-sm font-medium ${theme.secondaryText}`}>
                উচ্চারণ:
              </Text>
              <Text className={`text-base ${theme.text} mt-1 leading-6`}>
                {item.transliteration}
              </Text>
            </View>

            <View className="mt-3">
              <Text className={`text-sm font-medium ${theme.secondaryText}`}>
                অর্থ:
              </Text>
              <Text className={`text-base ${theme.text} mt-1 leading-6`}>
                {item.translation}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${theme.background}`}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.headerBackground}
      />

      {/* Header */}
      <View className={`${theme.headerBackground} px-4 py-4 flex-row items-center ${theme.shadow}`}>

        <Text className={`text-2xl font-bold ${theme.headerText}`}>
          দোয়ার তালিকা
        </Text>
      </View>

      {/* Dua List */}
      <FlatList
        data={duas}
        renderItem={renderDuaItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ItemSeparatorComponent={() => <View className="h-2" />}
      />
    </SafeAreaView>
  );
}