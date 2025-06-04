import { makePersistedAdapter } from '@livestore/adapter-expo';
import type { Store } from '@livestore/livestore';
import { createStorePromise } from '@livestore/livestore';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { unstable_batchedUpdates as batchUpdates, Text, View } from 'react-native';
import 'react-native-get-random-values';
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
    console.log('Initializing store...');

    const initStore = async () => {
      try {
        console.log('Creating store promise...');
        const newStore = await createStorePromise({
          schema,
          adapter,
          storeId: STORE_ID,
          batchUpdates,
        });
        
        if (mounted) {
          console.log('Store created successfully:', newStore);
          setStore(newStore);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Store initialization failed:', err);
        if (mounted) {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    };

    initStore();

    return () => {
      console.log('Cleaning up store...');
      mounted = false;
      if (store) {
        store.shutdown();
      }
    };
  }, []);

  if (error) {
    console.error('Store error state:', error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>Error: {error.message}</Text>
      </View>
    );
  }

  if (isLoading || !store) {
    console.log('Store loading state:', { isLoading, hasStore: !!store });
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  console.log('Rendering app with store:', store);
  return (
    <StoreContext.Provider value={store}>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </QueryClientProvider>
    </StoreContext.Provider>
  );
}
