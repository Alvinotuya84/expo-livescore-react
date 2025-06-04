import { useState } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from '../../components/ui/LinearGradient';
import { VStack } from '../../components/ui/VStack';
import { useDocumentOperations } from '../../hooks/useDocuments';

export default function Settings() {
  const { sync, isSyncing } = useDocumentOperations();
  const [autoSync, setAutoSync] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={{ padding: 20 }}
      >
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
          Settings
        </Text>
      </LinearGradient>

      <VStack style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 8,
            marginBottom: 8,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 8 }}>
            Sync Settings
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 14, color: '#666' }}>Auto Sync</Text>
            <Switch value={autoSync} onValueChange={setAutoSync} />
          </View>

          <TouchableOpacity
            onPress={sync}
            disabled={isSyncing}
            style={{
              backgroundColor: '#4c669f',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 8,
            marginBottom: 8,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 8 }}>
            About
          </Text>
          <Text style={{ fontSize: 14, color: '#666' }}>
            This app uses LiveStore for offline-first document synchronization with
            conflict resolution. All changes are stored locally first and synced
            with the server when online.
          </Text>
        </View>
      </VStack>
    </View>
  );
} 