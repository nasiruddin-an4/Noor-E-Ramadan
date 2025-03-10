import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Division, FoodItem, Settings } from '@/types/data';

interface State {
  selectedDivision: string;
  selectedFoods: { [key: string]: FoodItem };
  settings: Settings;
  setSelectedDivision: (division: string) => void;
  toggleFoodSelection: (food: FoodItem) => void;
  clearFoodSelections: () => void;
  updateSettings: (settings: Partial<Settings>) => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      selectedDivision: 'dhaka',
      selectedFoods: {},
      settings: {
        selectedDivision: 'dhaka',
        notifications: true,
        language: 'en',
        theme: 'dark',
      },
      setSelectedDivision: (division) =>
        set(() => ({ selectedDivision: division })),
      toggleFoodSelection: (food) =>
        set((state) => {
          const newSelectedFoods = { ...state.selectedFoods };
          if (newSelectedFoods[food.id]) {
            delete newSelectedFoods[food.id];
          } else {
            newSelectedFoods[food.id] = food;
          }
          return { selectedFoods: newSelectedFoods };
        }),
      clearFoodSelections: () =>
        set(() => ({ selectedFoods: {} })),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'ramadan-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);