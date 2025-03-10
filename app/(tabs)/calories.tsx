import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '@/store/useStore';
import FoodCard from '@/components/FoodCard';
import { foods } from '@/data/foods.json';
import { Trash2 } from 'lucide-react-native';

export default function CaloriesScreen() {
  const { selectedFoods, clearFoodSelections } = useStore();
  
  const totalCalories = Object.values(selectedFoods).reduce((total, food) => {
    return total + food.portions[0].calories;
  }, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Calorie Tracker</Text>
        {Object.keys(selectedFoods).length > 0 && (
          <Pressable style={styles.clearButton} onPress={clearFoodSelections}>
            <Trash2 size={20} color="#EF4444" />
            <Text style={styles.clearButtonText}>Clear All</Text>
          </Pressable>
        )}
      </View>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {foods.map((food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </ScrollView>
      {Object.keys(selectedFoods).length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalText}>
            Total Calories: <Text style={styles.totalCalories}>{totalCalories}</Text>
          </Text>
        </View>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#451A1A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  clearButtonText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    backgroundColor: '#1E293B',
  },
  totalText: {
    fontSize: 18,
    color: '#F8FAFC',
    textAlign: 'center',
  },
  totalCalories: {
    color: '#F59E0B',
    fontWeight: 'bold',
  },
});