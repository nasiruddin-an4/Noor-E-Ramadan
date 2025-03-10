export interface Division {
  id: string;
  name: string;
  nameBn: string;
}

export interface PrayerTiming {
  date: string;
  sehri: string;
  iftar: string;
}

export interface FoodItem {
  id: string;
  name: string;
  nameBn: string;
  category: string;
  imageUrl: string;
  portions: {
    size: string;
    calories: number;
  }[];
}

export interface Settings {
  selectedDivision: string;
  notifications: boolean;
  language: 'en' | 'bn';
  theme: 'light' | 'dark';
}