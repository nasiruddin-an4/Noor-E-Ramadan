import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useStore } from '@/store/useStore';
import { divisions } from '@/data/divisions.json';

export default function DivisionPicker() {
  const { selectedDivision, setSelectedDivision, setLoading } = useStore();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Division</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedDivision}
          onValueChange={(value) => {
            setSelectedDivision(value);
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
            }, 500);
          }}
          style={styles.picker}
          dropdownIconColor="#F8FAFC"
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
  );
}

const styles = StyleSheet.create({
  container: {
    // marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#F8FAFC',
    // marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    overflow: 'hidden',
    paddingHorizontal: 5,
  },
  picker: {
    backgroundColor: '#1E293B',
    color: '#F8FAFC',
  },
  pickerItem: {
    color: '#F8FAFC',
  },
});
