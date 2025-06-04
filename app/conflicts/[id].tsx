import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from '../../components/ui/LinearGradient';
import { useDocument } from '../../hooks/useDocuments';
import { resolveConflict } from '../../lib/sync';

export default function ConflictResolver() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const document = useDocument(id as string);
  const [mergedContent, setMergedContent] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  if (!document) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleResolve = async (resolution: 'local' | 'server' | 'merged') => {
    setIsResolving(true);
    try {
      await resolveConflict(
        document.id,
        resolution,
        resolution === 'merged' ? mergedContent : undefined
      );
      router.back();
    } catch (error) {
      console.error('Failed to resolve conflict:', error);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={{ padding: 20 }}
      >
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
          Resolve Conflict
        </Text>
      </LinearGradient>

      <View style={{ flex: 1, padding: 16 }}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 8 }}>
            Local Version
          </Text>
          <Text style={{ backgroundColor: 'white', padding: 12, borderRadius: 8 }}>
            {document.content}
          </Text>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 8 }}>
            Server Version
          </Text>
          <Text style={{ backgroundColor: 'white', padding: 12, borderRadius: 8 }}>
            {document.conflictsWith}
          </Text>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 8 }}>
            Merged Version (Optional)
          </Text>
          <TextInput
            value={mergedContent}
            onChangeText={setMergedContent}
            multiline
            style={{
              backgroundColor: 'white',
              padding: 12,
              borderRadius: 8,
              minHeight: 100,
              textAlignVertical: 'top',
            }}
            placeholder="Enter merged content..."
          />
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={() => handleResolve('local')}
            disabled={isResolving}
            style={{
              flex: 1,
              backgroundColor: '#4c669f',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>
              Keep Local
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleResolve('server')}
            disabled={isResolving}
            style={{
              flex: 1,
              backgroundColor: '#28a745',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>
              Keep Server
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleResolve('merged')}
            disabled={isResolving || !mergedContent.trim()}
            style={{
              flex: 1,
              backgroundColor: '#ffc107',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
              opacity: !mergedContent.trim() ? 0.5 : 1,
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>
              Use Merged
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
} 