import { Tabs } from 'expo-router';
import { Moon, CalendarClock, Utensils, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E293B',
          borderTopColor: '#334155',
        },
        tabBarActiveTintColor: '#F59E0B',
        tabBarInactiveTintColor: '#94A3B8',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Prayer Times',
          tabBarIcon: ({ size, color }) => (
            <Moon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="timings"
        options={{
          title: 'Compare',
          tabBarIcon: ({ size, color }) => (
            <CalendarClock size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calories"
        options={{
          title: 'Calories',
          tabBarIcon: ({ size, color }) => (
            <Utensils size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}