import { Stack } from 'expo-router';

export default function TabsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="conflicts"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="document/[id]"
        options={{
          title: 'Edit Document',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="document/create"
        options={{
          title: 'New Document',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="conflicts/[id]"
        options={{
          title: 'Resolve Conflict',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
