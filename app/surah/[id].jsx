import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SurahPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [surahContent, setSurahContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Surah content from an API
    const fetchSurah = async () => {
      try {
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${id}`);
        const data = await response.json();
        setSurahContent(data.data);
      } catch (error) {
        console.error('Error fetching Surah:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurah();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900 p-4">
        <ActivityIndicator size="large" color="#FFFFFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900 p-4">
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} className="flex-row items-center mb-4">
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text className="text-white text-lg ml-2">Back</Text>
      </TouchableOpacity>

      {/* Surah Content */}
      <Text className="text-white text-2xl font-bold mb-4">Surah {surahContent?.englishName}</Text>
      <Text className="text-white">{surahContent?.ayahs.map((ayah) => ayah.text).join(' ')}</Text>
    </SafeAreaView>
  );
}