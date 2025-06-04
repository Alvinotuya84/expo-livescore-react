import { LiveStoreProvider } from '@livestore/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { queryClient } from '../lib/api';
import { schema } from '../lib/livestore';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <LiveStoreProvider schema={schema}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: 'Documents',
              headerShown: true,
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
            name="conflicts/index"
            options={{
              title: 'Conflicts',
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
          <Stack.Screen
            name="settings/index"
            options={{
              title: 'Settings',
              headerShown: true,
            }}
          />
        </Stack>
      </LiveStoreProvider>
    </QueryClientProvider>
  );
}
