import { useStore } from '@livestore/react';
import { apiClient, Document, SyncResponse } from './api';
import { documentMutations, syncMutations } from './livestore';

// Helper to get client ID from sync state
const getClientId = async () => {
  const store = useStore();
  const syncState = await store.mutate(syncMutations.updateSyncState(Date.now(), true));
  return syncState.syncState[0].clientId;
};

// Apply server changes to LiveStore
export const applyServerChanges = (serverResponse: SyncResponse) => {
  const mutations = {
    documents: {
      upsert: serverResponse.documents.map(doc => ({
        ...doc,
        serverTimestamp: serverResponse.timestamp
      }))
    }
  };

  return mutations;
};

// Sync with server
export const syncWithServer = async () => {
  try {
    const store = useStore();
    const clientId = await getClientId();
    const syncState = await store.mutate(syncMutations.updateSyncState(Date.now(), true));
    const lastSyncTimestamp = syncState.syncState[0].lastSyncTimestamp;

    // Get changes from server
    const serverResponse = await apiClient.sync(lastSyncTimestamp, clientId);

    // Apply server changes to LiveStore
    await store.mutate(applyServerChanges(serverResponse));

    // Update sync timestamp
    await store.mutate(syncMutations.updateSyncState(serverResponse.timestamp, true));

    return serverResponse;
  } catch (error) {
    // Mark as offline on error
    const store = useStore();
    await store.mutate(syncMutations.updateSyncState(Date.now(), false));
    throw error;
  }
};

// Handle conflict resolution
export const resolveConflict = async (
  documentId: string,
  resolution: 'local' | 'server' | 'merged',
  mergedContent?: string
) => {
  const store = useStore();
  const clientId = await getClientId();

  // Update local state
  await store.mutate(documentMutations.resolveConflict(documentId, resolution, mergedContent));

  // Send resolution to server
  await apiClient.resolveConflict({
    documentId,
    resolution,
    mergedContent
  });
};

// Upload local changes to server
export const uploadLocalChanges = async (documents: Document[]) => {
  const store = useStore();
  const clientId = await getClientId();
  
  for (const doc of documents) {
    try {
      if (doc.isDeleted) {
        await apiClient.deleteDocument(doc.id, clientId);
      } else if (doc.serverTimestamp === undefined) {
        // New document
        await apiClient.createDocument(doc.content);
      } else {
        // Updated document
        await apiClient.updateDocument(doc.id, doc.content, doc.version);
      }
    } catch (error: any) {
      if (error.status === 409) {
        // Handle conflict
        await store.mutate(documentMutations.resolveConflict(doc.id, 'local'));
      } else {
        throw error;
      }
    }
  }
}; 