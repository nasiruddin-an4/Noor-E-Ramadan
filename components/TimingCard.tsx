import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { Moon, Sun } from 'lucide-react-native';

interface TimingCardProps {
  date: string;
  sehri: string;
  iftar: string;
}

export default function TimingCard({ date, sehri, iftar }: TimingCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.date}>{format(new Date(date), 'MMMM d, yyyy')}</Text>
      <View style={styles.timingsContainer}>
        <View style={styles.timing}>
          <Moon size={24} color="#F59E0B" />
          <Text style={styles.label}>Sehri</Text>
          <Text style={styles.time}>{sehri}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.timing}>
          <Sun size={24} color="#F59E0B" />
          <Text style={styles.label}>Iftar</Text>
          <Text style={styles.time}>{iftar}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 12,
    textAlign: 'center',
  },
  timingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  timing: {
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#94A3B8',
    marginVertical: 4,
  },
  time: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#475569',
  },
});