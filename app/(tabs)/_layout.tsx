import { Tabs } from 'expo-router';
import {
  Landmark,
  Clock,
  Utensils,
  HandCoins,
  MoreHorizontal,
  Settings,
} from 'lucide-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E293B',
          height: 60, // Sleek height
          paddingBottom: 20, // Better touch access
          paddingTop: 4, // Ensures spacing
          paddingHorizontal: 20, // Better left & right padding
        },
        tabBarLabelStyle: {
          fontSize: 10, // Balanced text
          fontWeight: '500',
          paddingBottom: 3,
        },
        tabBarActiveTintColor: '#F59E0B',
        tabBarInactiveTintColor: '#94A3B8',
      }}
    >
      {/* Ramadan Schedule Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ramadan',
          tabBarIcon: ({ size, color }) => <Landmark size={18} color={color} />,
        }}
      />

      {/* Timings Comparison Tab */}
      <Tabs.Screen
        name="timings"
        options={{
          title: 'Compare',
          tabBarIcon: ({ size, color }) => <Clock size={18} color={color} />,
        }}
      />

      {/* Calorie Tracker Tab */}
      <Tabs.Screen
        name="calories"
        options={{
          title: 'Calories',
          tabBarIcon: ({ size, color }) => <Utensils size={18} color={color} />,
        }}
      />

      {/* Zakat Calculator Tab */}
      <Tabs.Screen
        name="zakat"
        options={{
          title: 'Zakat',
          tabBarIcon: ({ size, color }) => (
            <HandCoins size={18} color={color} />
          ),
        }}
      />

      {/* More Options Tab */}
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="menu" size={24} color={color} />
          ),
        }}
      />

      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => <Settings size={18} color={color} />,
        }}
      />
    </Tabs>
  );
}
