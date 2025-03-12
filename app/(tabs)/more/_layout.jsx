import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MoreLayout() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "More" }} />
        <Stack.Screen name="calories" options={{ title: "Calories" }} />
        <Stack.Screen name="loved" options={{ title: "Loved" }} />
        <Stack.Screen name="notifications" options={{ title: "Notifications" }} />
        <Stack.Screen name="reports" options={{ title: "Reports" }} />
        <Stack.Screen name="help" options={{ title: "Help" }} />
        <Stack.Screen name="advanced" options={{ title: "Advanced Settings" }} />
      </Stack>
    </SafeAreaView>
  );
}
