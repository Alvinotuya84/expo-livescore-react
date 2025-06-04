import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#8E8E93',
      headerShown: false,
    }}
  >
    <Tabs.Screen
      name="index"
      options={{
        title: 'Documents',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="document-text" size={size} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="conflicts"
      options={{
        title: 'Conflicts',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="warning" size={size} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="settings"
      options={{
        title: 'Settings',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="settings" size={size} color={color} />
        ),
      }}
    />
  </Tabs>
  );
}
