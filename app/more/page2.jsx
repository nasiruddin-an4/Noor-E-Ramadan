import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// List of Quran chapters (Surahs)
const quranChapters = [
  { id: 1, name: 'Al-Fatiha' },
  { id: 2, name: 'Al-Baqarah' },
  { id: 3, name: 'Aal-E-Imran' },
  { id: 4, name: 'An-Nisa' },
  { id: 5, name: 'Al-Ma\'idah' },
  { id: 6, name: 'Al-An\'am' },
  { id: 7, name: 'Al-A\'raf' },
  { id: 8, name: 'Al-Anfal' },
  { id: 9, name: 'At-Tawbah' },
  { id: 10, name: 'Yunus' },
  // Add more chapters as needed
];

export default function Page2() {
  const router = useRouter();

  // Render each Quran chapter item
  const renderChapter = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/surah/${item.id}`)} // Navigate to Surah page
      className="p-4 bg-gray-800 rounded-lg mb-2"
    >
      <Text className="text-white text-lg">{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900 p-4">
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} className="flex-row items-center mb-4">
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text className="text-white text-lg ml-2">Back</Text>
      </TouchableOpacity>

      {/* Page Content */}
      <Text className="text-white text-2xl font-bold mb-4">Quran Chapters</Text>
      <FlatList
        data={quranChapters}
        renderItem={renderChapter}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
}