import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Check, Minus, Plus, Flame } from 'lucide-react-native';
import type { FoodItem } from '@/types/data';
import { useStore } from '@/store/useStore';
import { useState } from 'react';

interface FoodCardProps {
  food: FoodItem;
}

export default function FoodCard({ food }: FoodCardProps) {
  const { selectedFoods, toggleFoodSelection } = useStore();
  const isSelected = !!selectedFoods[food.id];
  const [customAmount, setCustomAmount] = useState(100); // Starting with 100g
  
  // Extract the unit (g, gm, ml, etc.) from the portion size
  const getUnit = () => {
    const sizeStr = food.portions[0].size;
    return sizeStr.replace(/[0-9]/g, '').trim();
  };
  
  const unit = getUnit() || 'g';
  
  // Calculate calories based on proportion
  const calculateCalories = () => {
    const basePortion = parseInt(food.portions[0].size) || 100;
    const baseCalories = food.portions[0].calories;
    return Math.round((customAmount / basePortion) * baseCalories);
  };
  
  const incrementAmount = () => {
    setCustomAmount(prev => prev + 50);
  };
  
  const decrementAmount = () => {
    setCustomAmount(prev => Math.max(50, prev - 50));
  };

  return (
    <Pressable
      style={[styles.container, isSelected && styles.selected]}
      onPress={() => toggleFoodSelection(food)}>
      
      <View style={styles.leftBorder} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{`${food.name} - (${food.nameBn})`}</Text>
          </View>
          
          {isSelected && (
            <View style={styles.checkmark}>
              <Check size={20} color="#FFFFFF" />
            </View>
          )}
        </View>
        
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{food.category}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.portionSection}>
          <View style={styles.caloriesDisplay}>
            <Flame size={18} color="#F59E0B" />
            <Text style={styles.caloriesText}>{calculateCalories()}</Text>
            <Text style={styles.caloriesUnit}>calories</Text>
          </View>
          
          <View style={styles.portionControls}>
            <Pressable 
              style={[styles.button, customAmount <= 50 && styles.buttonDisabled]} 
              onPress={decrementAmount}
              disabled={customAmount <= 50}
            >
              <Minus size={18} color={customAmount <= 50 ? "#64748B" : "#F8FAFC"} />
            </Pressable>
            
            <View style={styles.amountContainer}>
              <Text style={styles.amountText}>{customAmount}</Text>
              <Text style={styles.unitText}>{unit}</Text>
            </View>
            
            <Pressable style={styles.button} onPress={incrementAmount}>
              <Plus size={18} color="#F8FAFC" />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#334155',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  selected: {
    backgroundColor: '#1E293B',
  },
  leftBorder: {
    width: 6,
    backgroundColor: '#F59E0B',
    opacity: 0.8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  nameBn: {
    fontSize: 14,
    color: '#94A3B8',
    fontFamily: 'NotoSansBengali-Regular',
  },
  checkmark: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    padding: 4,
    marginLeft: 8,
  },
  categoryBadge: {
    backgroundColor: '#475569',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
    backgroundColor: '#475569',
    marginVertical: 12,
  },
  portionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  caloriesDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  caloriesText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginLeft: 6,
  },
  caloriesUnit: {
    fontSize: 14,
    color: '#94A3B8',
    marginLeft: 4,
  },
  portionControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#293548',
    opacity: 0.7,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 12,
  },
  amountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  unitText: {
    fontSize: 14,
    color: '#94A3B8',
    marginLeft: 2,
  },
});