import { useRouter } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from '../../components/ui/LinearGradient';
import { VStack } from '../../components/ui/VStack';
import { useConflicts } from '../../hooks/useDocuments';

export default function ConflictsList() {
  const router = useRouter();
  const conflicts = useConflicts();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Refresh conflicts
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <LinearGradient
        colors={['#FF3B30', '#FF9500']}
        style={{
          padding: 20,
          paddingTop: 60,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
          Conflicts
        </Text>
      </LinearGradient>

      <VStack
        style={{ flex: 1, padding: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {conflicts?.map((doc) => (
          <TouchableOpacity
            key={doc.id}
            onPress={() => router.push(`/conflicts/${doc.id}`)}
            style={{
              backgroundColor: '#fff3f3',
              padding: 15,
              borderRadius: 10,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: '#FF3B30',
            }}
          >
            <Text style={{ fontSize: 16, color: '#000' }}>{doc.content}</Text>
            <Text style={{ fontSize: 12, color: '#FF3B30', marginTop: 5 }}>
              Conflict detected: {new Date(doc.updatedAt).toLocaleString()}
            </Text>
          </TouchableOpacity>
        ))}

        {(!conflicts || conflicts.length === 0) && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 16, color: '#8E8E93' }}>
              No conflicts found
            </Text>
          </View>
        )}
      </VStack>
    </View>
  );
} 