import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Check } from 'lucide-react-native';
import type { FoodItem } from '@/types/data';
import { useStore } from '@/store/useStore';

interface FoodCardProps {
  food: FoodItem;
}

export default function FoodCard({ food }: FoodCardProps) {
  const { selectedFoods, toggleFoodSelection } = useStore();
  const isSelected = !!selectedFoods[food.id];

  return (
    <Pressable
      style={[styles.container, isSelected && styles.selected]}
      onPress={() => toggleFoodSelection(food)}>
      <Image source={{ uri: food.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{food.name}</Text>
          <Text style={styles.nameBn}>{food.nameBn}</Text>
        </View>
        <View style={styles.portions}>
          {food.portions.map((portion, index) => (
            <Text key={index} style={styles.portion}>
              {portion.size}: {portion.calories} cal
            </Text>
          ))}
        </View>
      </View>
      {isSelected && (
        <View style={styles.checkmark}>
          <Check size={24} color="#F59E0B" />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#334155',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  selected: {
    borderColor: '#F59E0B',
    borderWidth: 2,
  },
  image: {
    width: 100,
    height: 100,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  nameBn: {
    fontSize: 16,
    color: '#94A3B8',
    fontFamily: 'NotoSansBengali-Regular',
  },
  portions: {
    gap: 4,
  },
  portion: {
    fontSize: 14,
    color: '#CBD5E1',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 4,
  },
});