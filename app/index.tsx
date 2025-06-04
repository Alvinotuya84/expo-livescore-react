import { useQuery } from '@livestore/react';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from '../components/ui/LinearGradient';
import { VStack } from '../components/ui/VStack';
import { useDocumentOperations } from '../hooks/useDocuments';
import { queries } from '../lib/livestore';

interface Document {
  id: string;
  content: string;
  updatedAt: number;
  isDeleted: boolean;
  version: number;
  serverTimestamp: number | null;
  conflictsWith: string | null;
}

export default function DocumentList() {
  const router = useRouter();
  const documents = useQuery(queries.activeDocuments$) as unknown as Document[];
  const { sync, isSyncing } = useDocumentOperations();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await sync();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.header}
      >
        <Text style={styles.title}>Documents</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/document/create')}
        >
          <Text style={styles.createButtonText}>New Document</Text>
        </TouchableOpacity>
      </LinearGradient>

      <VStack
        refreshControl={
          <RefreshControl refreshing={refreshing || isSyncing} onRefresh={handleRefresh} />
        }
      >
        {documents.length === 0 ? (
          <Text style={styles.emptyText}>No documents yet</Text>
        ) : (
          documents.map((doc: Document) => (
            <TouchableOpacity
              key={doc.id}
              style={styles.documentItem}
              onPress={() => router.push(`/document/${doc.id}`)}
            >
              <Text style={styles.documentTitle}>
                {doc.content.substring(0, 50)}
                {doc.content.length > 50 ? '...' : ''}
              </Text>
              <Text style={styles.documentDate}>
                {new Date(doc.updatedAt).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  createButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#3b5998',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  documentItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  documentTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  documentDate: {
    fontSize: 12,
    color: '#666',
  },
}); 