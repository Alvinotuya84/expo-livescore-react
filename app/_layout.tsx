import { Ionicons } from '@expo/vector-icons';
import { makePersistedAdapter } from '@livestore/adapter-expo';
import type { Store } from '@livestore/livestore';
import { createStorePromise } from '@livestore/livestore';
import { QueryClientProvider } from '@tanstack/react-query';
import { Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { unstable_batchedUpdates as batchUpdates, Text, View } from 'react-native';
import { queryClient } from '../lib/api';
import { schema } from '../lib/livestore';
import { StoreContext } from '../lib/store';

// Create adapter with SQLite persistence
const adapter = makePersistedAdapter();

// Define a specific storeId for the application
const STORE_ID = 'expo-riffle-validate-store';

export default function RootLayout() {
  const [store, setStore] = useState<Store<typeof schema> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const initStore = async () => {
      try {
        const newStore = await createStorePromise({
          schema,
          adapter,
          storeId: STORE_ID,
          batchUpdates,
        });
        
        if (mounted) {
          setStore(newStore);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    };

    initStore();

    return () => {
      mounted = false;
      if (store) {
        store.shutdown();
      }
    };
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>Error: {error.message}</Text>
      </View>
    );
  }

  if (isLoading || !store) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StoreContext.Provider value={store}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#8E8E93',
            headerShown: true,
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
      </StoreContext.Provider>
    </QueryClientProvider>
  );
}
