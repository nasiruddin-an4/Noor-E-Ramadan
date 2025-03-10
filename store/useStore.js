import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStore = create(
  persist(
    (set) => ({
      selectedDivision: 'dhaka',
      loading: false,
      selectedFoods: {},
      settings: {
        selectedDivision: 'dhaka',
        notifications: true,
        language: 'en',
        theme: 'dark',
      },
      setSelectedDivision: (division) =>
        set(() => ({ selectedDivision: division })),
      setLoading: (loading) => set(() => ({ loading })),
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
      clearFoodSelections: () => set(() => ({ selectedFoods: {} })),
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
