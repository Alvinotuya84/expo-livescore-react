import { useState } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from '../../components/ui/LinearGradient';
import { VStack } from '../../components/ui/VStack';
import { useDocumentOperations } from '../../hooks/useDocuments';

export default function Settings() {
  const { sync, isSyncing } = useDocumentOperations();
  const [autoSync, setAutoSync] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <LinearGradient
        colors={['#5856D6', '#007AFF']}
        style={{
          padding: 20,
          paddingTop: 60,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
          Settings
        </Text>
      </LinearGradient>

      <VStack style={{ flex: 1, padding: 20 }}>
        <View
          style={{
            backgroundColor: '#f8f9fa',
            padding: 15,
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Sync Settings
          </Text>
          
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 15,
            }}
          >
            <Text style={{ fontSize: 16 }}>Auto-sync</Text>
            <Switch value={autoSync} onValueChange={setAutoSync} />
          </View>

          <TouchableOpacity
            onPress={sync}
            disabled={isSyncing}
            style={{
              backgroundColor: '#007AFF',
              padding: 15,
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: '#f8f9fa',
            padding: 15,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            About
          </Text>
          <Text style={{ fontSize: 14, color: '#666', lineHeight: 20 }}>
            This app uses LiveStore for offline-first document synchronization.
            Your documents are stored locally and synced with the server when
            possible.
          </Text>
        </View>
      </VStack>
    </View>
  );
} 