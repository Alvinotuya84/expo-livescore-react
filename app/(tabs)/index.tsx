import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from '../../components/ui/LinearGradient';
import { VStack } from '../../components/ui/VStack';
import { useDocumentOperations } from '../../hooks/useDocuments';
import type { Document } from '../../lib/api';
import { queries } from '../../lib/livestore';
import { useStore } from '../../lib/store';

// Convert LiveStore document to API document
const convertToApiDocument = (doc: any): Document => ({
  id: doc.id,
  content: doc.content,
  version: doc.version,
  clientId: doc.clientId,
  clientTimestamp: doc.clientTimestamp,
  serverTimestamp: doc.serverTimestamp || undefined,
  isDeleted: doc.isDeleted,
  conflictsWith: doc.conflictsWith || undefined,
  conflictStatus: doc.conflictStatus,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export default function DocumentList() {
  const router = useRouter();
  const store = useStore();
  const [documents, setDocuments] = useState<Document[]>([]);
  const { sync, isSyncing } = useDocumentOperations();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadDocuments = async () => {
      const docs = await store.query(queries.activeDocuments$);
      setDocuments(docs.map(convertToApiDocument));
    };

    loadDocuments();

    // Subscribe to document changes
    const unsubscribe = store.subscribe(queries.activeDocuments$, {
      onUpdate: (docs) => {
        setDocuments(docs.map(convertToApiDocument));
      },
    });

    return () => {
      unsubscribe();
    };
  }, [store]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await sync();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <LinearGradient
        colors={['#007AFF', '#5856D6']}
        style={{
          padding: 20,
          paddingTop: 60,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
          Documents
        </Text>
      </LinearGradient>

      <VStack
        style={{ flex: 1, padding: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {documents?.map((doc) => (
          <TouchableOpacity
            key={doc.id}
            onPress={() => router.push(`/document/${doc.id}`)}
            style={{
              backgroundColor: '#f8f9fa',
              padding: 15,
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 16, color: '#000' }}>{doc.content}</Text>
            <Text style={{ fontSize: 12, color: '#8E8E93', marginTop: 5 }}>
              Last updated: {new Date(doc.updatedAt).toLocaleString()}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={() => router.push('/document/create')}
          style={{
            backgroundColor: '#007AFF',
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
            marginTop: 20,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            Create New Document
          </Text>
        </TouchableOpacity>
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
