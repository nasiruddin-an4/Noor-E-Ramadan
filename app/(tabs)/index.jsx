import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DivisionPicker from '@/components/DivisionPicker';
import TimingCard from '@/components/TimingCard';
import { useStore } from '@/store/useStore';
import namazSchedule from '@/data/namaz_schedule_2025.json';
import TimingCardSkeleton from '@/components/TimingCardSkeleton';

export default function HomeScreen() {
  const { selectedDivision, loading } = useStore();

  const currenSchedule = namazSchedule[selectedDivision];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Prayer Times</Text>
        <DivisionPicker />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {currenSchedule.map((timing, index) =>
          loading ? (
            <TimingCardSkeleton key={index} />
          ) : (
            <TimingCard key={index} {...timing} />
          )
        )}
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
    paddingHorizontal: 20,
    paddingTop: 20,
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
