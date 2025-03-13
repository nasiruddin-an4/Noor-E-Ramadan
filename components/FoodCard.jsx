import { View, Text, Pressable, StyleSheet, Animated, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/useStore';
import { useState, useEffect } from 'react';

export default function FoodCard({ food }) {
  const { selectedFoods, toggleFoodSelection, updateFoodAmount } = useStore();
  const isSelected = !!selectedFoods[food.id];
  const [customAmount, setCustomAmount] = useState(selectedFoods[food.id]?.customAmount || 100);
  const [scaleAnim] = useState(new Animated.Value(1));
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (isSelected && updateFoodAmount) {
      updateFoodAmount(food.id, customAmount);
    }
  }, [customAmount, isSelected, updateFoodAmount]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: isSelected ? 1.05 : 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isSelected]);

  const getUnit = () => {
    const sizeStr = food.portions[0].size;
    return sizeStr.replace(/[0-9]/g, '').trim();
  };

  const unit = getUnit() || 'g';

  const calculateCalories = () => {
    const basePortion = parseInt(food.portions[0].size) || 100;
    const baseCalories = food.portions[0].calories;
    return Math.round((customAmount / basePortion) * baseCalories);
  };

  const incrementAmount = () => setCustomAmount((prev) => prev + 50);
  const decrementAmount = () => setCustomAmount((prev) => Math.max(50, prev - 50));

  const styles = getStyles(colorScheme);

  return (
    <Animated.View
      style={[styles.container, isSelected && styles.selectedContainer, { transform: [{ scale: scaleAnim }] }]}
    >
      <Pressable
        style={styles.cardContent}
        onPress={() => toggleFoodSelection(food)}
        android_ripple={{ color: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
      >
        <View style={styles.header}>
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{`${food.name} - ${food.nameBn}`}</Text>
          </View>
          {isSelected ? (
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          ) : (
            <Ionicons name="add-circle-outline" size={20} color={colorScheme === 'dark' ? '#9E9E9E' : '#757575'} />
          )}
        </View>
        <View style={styles.categoryContainer}>
          <Ionicons name="restaurant-outline" size={12} color={colorScheme === 'dark' ? '#9E9E9E' : '#757575'} />
          <Text style={styles.categoryText}>{food.category}</Text>
        </View>
        <View style={styles.nutritionContainer}>
          <View style={styles.caloriesContainer}>
            <Ionicons name="flame-outline" size={16} color="#FF5722" />
            <Text style={styles.caloriesText}>{calculateCalories()}</Text>
            <Text style={styles.caloriesUnit}>calories</Text>
          </View>
          <View style={styles.portionContainer}>
            <Pressable onPress={decrementAmount} style={styles.portionButton} hitSlop={10}>
              <Ionicons name="remove-circle" size={20} color="#2196F3" />
            </Pressable>
            <View style={styles.amountContainer}>
              <Text style={styles.amountText}>{customAmount}</Text>
              <Text style={styles.unitText}>{unit}</Text>
            </View>
            <Pressable onPress={incrementAmount} style={styles.portionButton} hitSlop={10}>
              <Ionicons name="add-circle" size={20} color="#2196F3" />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// Styles unchanged
const getStyles = (colorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF',
      borderRadius: 8,
      marginVertical: 6,
      marginHorizontal: 12,
      shadowColor: colorScheme === 'dark' ? '#000' : '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.1,
      shadowRadius: 2,
      elevation: 2,
      overflow: 'hidden',
    },
    selectedContainer: {
      backgroundColor: colorScheme === 'dark' ? '#2E2E2E' : '#E3F2FD',
      borderColor: '#2196F3',
      borderWidth: 1,
    },
    cardContent: {
      padding: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    nameContainer: {
      flex: 1,
    },
    nameText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? '#FFFFFF' : '#212121',
    },
    categoryContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    categoryText: {
      fontSize: 12,
      color: colorScheme === 'dark' ? '#9E9E9E' : '#757575',
      marginLeft: 4,
    },
    nutritionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colorScheme === 'dark' ? '#333333' : '#EEEEEE',
    },
    caloriesContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    caloriesText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#FF5722',
      marginLeft: 4,
    },
    caloriesUnit: {
      fontSize: 12,
      color: colorScheme === 'dark' ? '#9E9E9E' : '#757575',
      marginLeft: 4,
    },
    portionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    portionButton: {
      padding: 2,
    },
    amountContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginHorizontal: 6,
      minWidth: 50,
      justifyContent: 'center',
    },
    amountText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? '#FFFFFF' : '#212121',
    },
    unitText: {
      fontSize: 12,
      color: colorScheme === 'dark' ? '#9E9E9E' : '#757575',
      marginLeft: 2,
    },
  });