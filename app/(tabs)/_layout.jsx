import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
  AntDesign,
} from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  console.log('🚀 ~ TabLayout ~ colorScheme:', colorScheme);

  // Theme definitions
  const themeStyles = {
    light: {
      tabBarBackground: '#F9FAFB', // Light gray background
      tabBarActiveTint: '#F59E0B', // Amber active color
      tabBarInactiveTint: '#64748B', // Gray for inactive
      statusBarStyle: 'dark-content',
      statusBarBackground: '#F9FAFB',
    },
    dark: {
      tabBarBackground: '#1E293B', // Dark slate background
      tabBarActiveTint: '#F59E0B', // Amber active color
      tabBarInactiveTint: '#94A3B8', // Light gray for inactive
      statusBarStyle: 'light-content',
      statusBarBackground: '#1E293B',
    },
  };

  const theme = themeStyles[colorScheme];
  console.log('🚀 ~ TabLayout ~ theme:', theme);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme?.tabBarBackground,
          height: 60,
          paddingBottom: 20,
          paddingTop: 4,
          paddingHorizontal: 20,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          paddingBottom: 3,
        },
        tabBarActiveTintColor: theme.tabBarActiveTint,
        tabBarInactiveTintColor: theme.tabBarInactiveTint,
      }}
    >
      {/* Ramadan Schedule Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ramadan',
          tabBarIcon: ({ size, color }) => (
            <FontAwesome5 name="mosque" size={18} color={color} />
          ),
        }}
      />

      {/* Timings Comparison Tab */}
      <Tabs.Screen
        name="timings"
        options={{
          title: 'Compare',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="time-outline" size={24} color={color} />
          ),
        }}
      />

      {/* Zakat Calculator Tab */}
      <Tabs.Screen
        name="zakatCalculator"
        options={{
          title: 'Zakat',
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="calculate" size={24} color={color} />
          ),
        }}
      />

      {/* More Options Tab */}
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="appstore-o" size={18} color={color} />
          ),
        }}
      />

      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="settings-outline" size={18} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
