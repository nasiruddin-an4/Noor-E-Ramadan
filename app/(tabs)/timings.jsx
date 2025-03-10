import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useStore } from '@/store/useStore';
import { divisions } from '@/data/divisions.json';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react-native';
import namazSchedule from '@/data/namaz_schedule_2025.json';
import dayjs from 'dayjs';

export default function TimingsScreen() {
  const today = dayjs().format('D MMMM, YYYY');

  const [fromDistrict, setFromDistrict] = useState('dhaka');
  const [toDistrict, setToDistrict] = useState('chattogram');

  const fromDistrictTimings = namazSchedule[fromDistrict].filter(
    (timing) => timing.Date === today
  )[0];

  const toDistrictTimings = namazSchedule[toDistrict].filter(
    (timing) => timing.Date === today
  )[0];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Compare Timings</Text>
        <View style={styles.pickerContainer}>
          <View style={styles.picker}>
            <Text style={styles.label}>From</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={fromDistrict}
                onValueChange={(value) => {
                  setFromDistrict(value);
                }}
                style={styles.pickerSelect}
                dropdownIconColor="#F59E0B"
                itemStyle={styles.pickerItem}
              >
                {divisions.map((division) => (
                  <Picker.Item
                    key={division.id}
                    label={`${division.name} (${division.nameBn})`}
                    value={division.id}
                    color="black"
                  />
                ))}
              </Picker>
            </View>
          </View>
          <ArrowRight style={styles.icon} size={24} color="#F59E0B" />
          <View style={styles.picker}>
            <Text style={styles.label}>To</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={toDistrict}
                onValueChange={(value) => {
                  console.log('🚀 ~ TimingsScreen ~ value:', value);
                  setToDistrict(value);
                }}
                style={styles.pickerSelect}
                dropdownIconColor="#F59E0B"
                itemStyle={styles.pickerItem}
              >
                {divisions.map((division) => (
                  <Picker.Item
                    key={division.id}
                    label={`${division.name} (${division.nameBn})`}
                    value={division.id}
                    color="black"
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
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.comparisonCard}>
          <Text style={styles.date}>{format(new Date(), 'MMMM d, yyyy')}</Text>
          <View style={styles.timingsRow}>
            <View style={styles.divisionTiming}>
              <Text style={styles.divisionName}>
                {fromDistrict.replace(/^./, fromDistrict[0].toUpperCase())}
              </Text>
              <View style={styles.times}>
                <View style={styles.timeBlock}>
                  <Text style={styles.timeLabel}>Sehri</Text>
                  <Text style={styles.time}>{fromDistrictTimings.Sehri}</Text>
                </View>
                <View style={styles.timeBlock}>
                  <Text style={styles.timeLabel}>Iftar</Text>
                  <Text style={styles.time}>{fromDistrictTimings.Iftar}</Text>
                </View>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.divisionTiming}>
              <Text style={styles.divisionName}>
                {toDistrict.replace(/^./, toDistrict[0].toUpperCase())}
              </Text>
              <View style={styles.times}>
                <View style={styles.timeBlock}>
                  <Text style={styles.timeLabel}>Sehri</Text>
                  <Text style={styles.time}>{toDistrictTimings.Sehri}</Text>
                </View>
                <View style={styles.timeBlock}>
                  <Text style={styles.timeLabel}>Iftar</Text>
                  <Text style={styles.time}>{toDistrictTimings.Iftar}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
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
    alignContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    marginBottom: -30,
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
