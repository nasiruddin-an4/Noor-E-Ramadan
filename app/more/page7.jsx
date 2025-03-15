import React, { useState } from 'react';
import { View, Text, FlatList, StatusBar, TouchableOpacity, Clipboard, Alert, LayoutAnimation, Platform, UIManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import allahNamesData from '@/data/allahNames.json';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Page7() {
    const router = useRouter();
    const names = allahNamesData.names;
    const [expandedName, setExpandedName] = useState(null);

    const toggleExpand = (id) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedName(expandedName === id ? null : id);
    };

    const copyToClipboard = (text) => {
        Clipboard.setString(text);
        Alert.alert('Copied!', 'The name has been copied to your clipboard.');
    };

    const renderNameItem = ({ item }) => {
        const isExpanded = expandedName === item.id;

        return (
            <View className="mb-1 rounded-xl bg-gray-800 overflow-hidden border border-gray-700/50 shadow-lg">
                {/* Header */}
                <TouchableOpacity
                    className="p-3 flex-row justify-between items-center bg-gray-800"
                    onPress={() => toggleExpand(item.id)}
                    activeOpacity={0.85}
                >
                    <View className="flex-row items-center flex-1">
                        <View className="w-8 h-8 bg-gray-700 rounded-full items-center justify-center mr-3">
                            <Text className="text-gray-100 font-bold">{item.id}</Text>
                        </View>
                        <Text
                            className="text-lg font-semibold text-gray-100 flex-shrink"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {`${item.transliteration} - ${item.bangla_uchcharon}`}
                        </Text>
                    </View>
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
                        <View className="mb-1">
                            {/* Header Row */}
                            <View className="flex-row justify-between items-center">
                                <Text className="text-sm font-medium text-gray-400">আরবি:</Text>
                                <Text className="text-sm font-medium text-gray-400 ml-2">উচ্চারণ:</Text>
                                <TouchableOpacity onPress={() => copyToClipboard(item.arabic)}>
                                    <Ionicons name="copy-outline" size={20} color="#60A5FA" />
                                </TouchableOpacity>
                            </View>

                            {/* Arabic and Transliteration Text */}
                            <View className="flex-row justify-between items-start ">
                                {/* Arabic Text */}
                                <Text className="text-xl text-gray-100 font-arabic leading-8 flex-1">
                                    {item.arabic}
                                </Text>

                                {/* Transliteration Text */}
                                <Text className="text-base text-gray-200 leading-6 flex-1">
                                    {item.transliteration}
                                </Text>
                            </View>
                        </View>


                        {/* Bangla Meaning */}
                        <View className="flex flex-row items-center">
                            <Text className="text-sm font-medium text-gray-400">বাংলা অর্থ:</Text>
                            <Text className="font-medium text-base text-gray-200 ml-2 leading-6">
                                {item.bangla}
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
            <View className="flex-row items-center justify-between p-2">
                {/* Back Icon (Left Side) */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="p-2 rounded-full bg-gray-800/50"
                >
                    <Ionicons name="arrow-back" size={18} color="#D1D5DB" />
                </TouchableOpacity>

                {/* Centered Text */}
                <Text className="flex-1 text-xl font-bold text-gray-100 text-center">
                    আল্লাহর ৯৯টি নাম
                </Text>

                {/* Spacer to Balance the Layout */}
                <View className="w-8" />
            </View>

            {/* Names List */}
            <FlatList
                data={names}
                renderItem={renderNameItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 10, paddingBottom: 10 }}
                ItemSeparatorComponent={() => <View className="h-2" />}
            />
        </SafeAreaView>
    );
}