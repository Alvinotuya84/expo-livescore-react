import { mutate } from '@livestore/react';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from '../../components/ui/LinearGradient';
import { documentMutations } from '../../lib/livestore';

export default function CreateDocument() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!content.trim()) return;

    setIsCreating(true);
    try {
      await mutate(documentMutations.createDocument(content));
      router.back();
    } catch (error) {
      console.error('Failed to create document:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={{ padding: 20 }}
      >
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
          New Document
        </Text>
      </LinearGradient>

      <View style={{ flex: 1, padding: 16 }}>
        <TextInput
          value={content}
          onChangeText={setContent}
          multiline
          style={{
            flex: 1,
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 8,
            fontSize: 16,
            textAlignVertical: 'top',
          }}
          placeholder="Enter document content..."
        />

        <View style={{ flexDirection: 'row', marginTop: 16, gap: 8 }}>
          <TouchableOpacity
            onPress={handleCreate}
            disabled={isCreating || !content.trim()}
            style={{
              flex: 1,
              backgroundColor: '#4c669f',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
              opacity: !content.trim() ? 0.5 : 1,
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>
              {isCreating ? 'Creating...' : 'Create'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              backgroundColor: '#6c757d',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
              width: 100,
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
} 