import { makePersistedAdapter } from '@livestore/adapter-expo';
import { LiveStoreProvider } from '@livestore/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { unstable_batchedUpdates as batchUpdates } from 'react-native';
import { queryClient } from '../lib/api';
import { schema } from '../lib/livestore';

// Create adapter with SQLite persistence
const adapter = makePersistedAdapter();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <LiveStoreProvider
        schema={schema}
        adapter={adapter}
        batchUpdates={batchUpdates}
        storeId="default"
        renderLoading={({ stage }) => (
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                title: 'Loading...',
                headerShown: true,
              }}
            />
          </Stack>
        )}
        renderError={(error) => (
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                title: 'Error',
                headerShown: true,
              }}
            />
          </Stack>
        )}
      >
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
