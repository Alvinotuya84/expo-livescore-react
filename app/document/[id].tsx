import { mutate } from '@livestore/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from '../../components/ui/LinearGradient';
import { useDocument } from '../../hooks/useDocuments';
import { documentMutations } from '../../lib/livestore';

export default function DocumentEditor() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const document = useDocument(id as string);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (document) {
      setContent(document.content);
    }
  }, [document]);

  const handleSave = async () => {
    if (!document) return;

    setIsSaving(true);
    try {
      await mutate(
        documentMutations.updateDocument(
          document.id,
          content,
          document.version + 1
        )
      );
      router.back();
    } catch (error) {
      console.error('Failed to save document:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!document) return;

    try {
      await mutate(documentMutations.markDeleted(document.id));
      router.back();
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  if (!document) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={{ padding: 20 }}
      >
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
          Edit Document
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
            onPress={handleSave}
            disabled={isSaving}
            style={{
              flex: 1,
              backgroundColor: '#4c669f',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>
              {isSaving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            style={{
              backgroundColor: '#dc3545',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
              width: 100,
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
} 