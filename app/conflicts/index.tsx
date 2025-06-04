import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from '../../components/ui/LinearGradient';
import { VStack } from '../../components/ui/VStack';
import { useConflicts } from '../../hooks/useDocuments';
import { Document } from '../../lib/api';

export default function ConflictsList() {
  const router = useRouter();
  const conflicts = useConflicts();

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={{ padding: 20 }}
      >
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
          Conflicts
        </Text>
      </LinearGradient>

      <VStack style={{ flex: 1 }}>
        {conflicts?.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: '#666' }}>
              No conflicts to resolve
            </Text>
          </View>
        ) : (
          conflicts?.map((doc: Document) => (
            <TouchableOpacity
              key={doc.id}
              onPress={() => router.push(`/conflicts/${doc.id}`)}
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
              <Text style={{ fontSize: 12, color: '#dc3545', marginTop: 4 }}>
                Has conflict with version {doc.conflictsWith}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </VStack>
    </View>
  );
} 