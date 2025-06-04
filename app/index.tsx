import { useRouter } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from '../components/ui/LinearGradient';
import { VStack } from '../components/ui/VStack';
import { useDocumentOperations, useDocuments } from '../hooks/useDocuments';
import { Document } from '../lib/api';

export default function DocumentList() {
  const router = useRouter();
  const documents = useDocuments();
  const { sync, isSyncing } = useDocumentOperations();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await sync();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={{ padding: 20 }}
      >
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
          Documents
        </Text>
      </LinearGradient>

      <VStack
        style={{ flex: 1, padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {documents?.map((doc: Document) => (
          <TouchableOpacity
            key={doc.id}
            onPress={() => router.push(`/document/${doc.id}`)}
            style={{
              backgroundColor: 'white',
              padding: 16,
              borderRadius: 8,
              marginBottom: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '500' }}>
              {doc.content.substring(0, 50)}
              {doc.content.length > 50 ? '...' : ''}
            </Text>
            <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
              Last updated: {new Date(doc.updatedAt).toLocaleString()}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={() => router.push('/document/create')}
          style={{
            backgroundColor: '#4c669f',
            padding: 16,
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 16,
          }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>
            Create New Document
          </Text>
        </TouchableOpacity>
      </VStack>
    </View>
  );
} 