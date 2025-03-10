import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useStore } from '@/store/useStore';
import { divisions } from '@/data/divisions.json';
import { timings } from '@/data/timings.json';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react-native';

export default function TimingsScreen() {
  const { selectedDivision, settings } = useStore();
  const [compareWithDivision, setCompareWithDivision] = useState('chittagong');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Compare Timings</Text>
        <View style={styles.pickerContainer}>
          <View style={styles.picker}>
            <Text style={styles.label}>From</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedDivision}
                style={styles.pickerSelect}
                dropdownIconColor="#F59E0B"
                itemStyle={styles.pickerItem}>
                {divisions.map((division) => (
                  <Picker.Item
                    key={division.id}
                    label={division.name}
                    value={division.id}
                    color="#F8FAFC"
                  />
                ))}
              </Picker>
            </View>
          </View>
          <ArrowRight size={24} color="#F59E0B" />
          <View style={styles.picker}>
            <Text style={styles.label}>To</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={compareWithDivision}
                onValueChange={setCompareWithDivision}
                style={styles.pickerSelect}
                dropdownIconColor="#F59E0B"
                itemStyle={styles.pickerItem}>
                {divisions.map((division) => (
                  <Picker.Item
                    key={division.id}
                    label={division.name}
                    value={division.id}
                    color="#F8FAFC"
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      </View>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {timings.dhaka.map((timing) => (
          <View key={timing.date} style={styles.comparisonCard}>
            <Text style={styles.date}>
              {format(new Date(timing.date), 'MMMM d, yyyy')}
            </Text>
            <View style={styles.timingsRow}>
              <View style={styles.divisionTiming}>
                <Text style={styles.divisionName}>
                  {divisions.find(d => d.id === selectedDivision)?.name}
                </Text>
                <View style={styles.times}>
                  <View style={styles.timeBlock}>
                    <Text style={styles.timeLabel}>Sehri</Text>
                    <Text style={styles.time}>{timing.sehri}</Text>
                  </View>
                  <View style={styles.timeBlock}>
                    <Text style={styles.timeLabel}>Iftar</Text>
                    <Text style={styles.time}>{timing.iftar}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.divisionTiming}>
                <Text style={styles.divisionName}>
                  {divisions.find(d => d.id === compareWithDivision)?.name}
                </Text>
                <View style={styles.times}>
                  <View style={styles.timeBlock}>
                    <Text style={styles.timeLabel}>Sehri</Text>
                    <Text style={styles.time}>{timing.sehri}</Text>
                  </View>
                  <View style={styles.timeBlock}>
                    <Text style={styles.timeLabel}>Iftar</Text>
                    <Text style={styles.time}>{timing.iftar}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
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
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  picker: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: '#F8FAFC',
    marginBottom: 8,
  },
  pickerWrapper: {
    backgroundColor: '#334155',
    borderRadius: 8,
    overflow: 'hidden',
  },
  pickerSelect: {
    backgroundColor: '#334155',
    color: '#F8FAFC',
  },
  pickerItem: {
    color: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  comparisonCard: {
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
  timingsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  divisionTiming: {
    flex: 1,
    alignItems: 'center',
  },
  divisionName: {
    fontSize: 16,
    color: '#F59E0B',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  times: {
    width: '100%',
    gap: 8,
  },
  timeBlock: {
    backgroundColor: '#1E293B',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    color: '#94A3B8',
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  divider: {
    width: 1,
    backgroundColor: '#475569',
    marginHorizontal: 12,
  },
});