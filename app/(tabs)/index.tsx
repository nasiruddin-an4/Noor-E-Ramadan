import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DivisionPicker from '@/components/DivisionPicker';
import TimingCard from '@/components/TimingCard';
import { useStore } from '@/store/useStore';

// Temporary data - Replace with actual API data
const timings = [
  { "date": "2025-03-01", "sehri": "5:05 AM", "iftar": "6:20 PM" },
  { "date": "2025-03-02", "sehri": "5:04 AM", "iftar": "6:20 PM" },
  { "date": "2025-03-03", "sehri": "5:04 AM", "iftar": "6:19 PM" },
  { "date": "2025-03-04", "sehri": "5:03 AM", "iftar": "6:18 PM" },
  { "date": "2025-03-05", "sehri": "5:02 AM", "iftar": "6:17 PM" },
  { "date": "2025-03-06", "sehri": "5:01 AM", "iftar": "6:16 PM" },
  { "date": "2025-03-07", "sehri": "5:00 AM", "iftar": "6:15 PM" },
  { "date": "2025-03-08", "sehri": "4:59 AM", "iftar": "6:14 PM" },
  { "date": "2025-03-09", "sehri": "4:58 AM", "iftar": "6:13 PM" },
  { "date": "2025-03-10", "sehri": "4:57 AM", "iftar": "6:12 PM" },
  { "date": "2025-03-11", "sehri": "4:56 AM", "iftar": "6:11 PM" },
  { "date": "2025-03-12", "sehri": "4:55 AM", "iftar": "6:10 PM" },
  { "date": "2025-03-13", "sehri": "4:54 AM", "iftar": "6:09 PM" },
  { "date": "2025-03-14", "sehri": "4:53 AM", "iftar": "6:08 PM" },
  { "date": "2025-03-15", "sehri": "4:52 AM", "iftar": "6:07 PM" },
  { "date": "2025-03-16", "sehri": "4:51 AM", "iftar": "6:06 PM" },
  { "date": "2025-03-17", "sehri": "4:50 AM", "iftar": "6:05 PM" },
  { "date": "2025-03-18", "sehri": "4:49 AM", "iftar": "6:04 PM" },
  { "date": "2025-03-19", "sehri": "4:48 AM", "iftar": "6:03 PM" },
  { "date": "2025-03-20", "sehri": "4:47 AM", "iftar": "6:02 PM" },
  { "date": "2025-03-21", "sehri": "4:46 AM", "iftar": "6:01 PM" },
  { "date": "2025-03-22", "sehri": "4:45 AM", "iftar": "6:00 PM" },
  { "date": "2025-03-23", "sehri": "4:44 AM", "iftar": "5:59 PM" },
  { "date": "2025-03-24", "sehri": "4:43 AM", "iftar": "5:58 PM" },
  { "date": "2025-03-25", "sehri": "4:42 AM", "iftar": "5:57 PM" },
  { "date": "2025-03-26", "sehri": "4:41 AM", "iftar": "5:56 PM" },
  { "date": "2025-03-27", "sehri": "4:40 AM", "iftar": "5:55 PM" },
  { "date": "2025-03-28", "sehri": "4:39 AM", "iftar": "5:54 PM" },
  { "date": "2025-03-29", "sehri": "4:38 AM", "iftar": "5:53 PM" },
  { "date": "2025-03-30", "sehri": "4:37 AM", "iftar": "5:52 PM" }
];

export default function HomeScreen() {
  const { selectedDivision } = useStore();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Prayer Times</Text>
        <DivisionPicker />
      </View>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {timings.map((timing) => (
          <TimingCard key={timing.date} {...timing} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
});