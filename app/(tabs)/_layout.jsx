import { Tabs } from 'expo-router';
import { MaterialCommunityIcons, FontAwesome5, Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E293B',
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
        tabBarActiveTintColor: '#F59E0B',
        tabBarInactiveTintColor: '#94A3B8',
      }}
    >
      {/* Ramadan Schedule Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ramadan',
          tabBarIcon: ({ size, color }) => <FontAwesome5 name="mosque" size={18} color={color} />,
        }}
      />

      {/* Timings Comparison Tab */}
      <Tabs.Screen
        name="timings"
        options={{
          title: 'Compare',
          tabBarIcon: ({ size, color }) => <Ionicons name="time-outline" size={24} color={color} />,
        }}
      />

      {/* Zakat Calculator Tab */}
      <Tabs.Screen
        name="zakatCalculator"
        options={{
          title: 'Zakat',
          tabBarIcon: ({ size, color }) => <MaterialIcons name="calculate" size={24} color={color} />,
        }}
      />

      {/* More Options Tab */}
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ size, color }) => <AntDesign name="appstore-o" size={18} color={color} />,
        }}
      />

      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => <Ionicons name="settings-outline" size={18} color={color} />,
        }}
      />
    </Tabs>
  );
}