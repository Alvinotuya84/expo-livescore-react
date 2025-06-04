import { Store } from '@livestore/livestore';
import { apiClient, Document, SyncResponse } from './api';
import { events, queries, schema } from './livestore';

type AppStore = Store<typeof schema>;

const getClientId = async (store: AppStore) => {
   store.commit(events.syncStateUpdated({
    lastSyncTimestamp: Date.now(),
    clientId: 'local',
    isOnline: true
  }));
  const syncState =  store.query(queries.syncState$);
  return syncState[0].clientId;
};

export const applyServerChanges = (serverResponse: SyncResponse) => {
  return events.documentCreated({
    id: serverResponse.documents[0].id,
    content: serverResponse.documents[0].content,
    clientId: 'local',
    clientTimestamp: Date.now(),
    version: 1,
    createdAt: Date.now(),
    updatedAt: Date.now()
  });
};

export const syncWithServer = async (store: AppStore) => {
  try {
    const clientId = await getClientId(store);
     store.commit(events.syncStateUpdated({
      lastSyncTimestamp: Date.now(),
      clientId,
      isOnline: true
    }));
    const syncState = store.query(queries.syncState$);
    const lastSyncTimestamp = syncState[0].lastSyncTimestamp;

    const serverResponse = await apiClient.sync(lastSyncTimestamp, clientId);

     store.commit(applyServerChanges(serverResponse));

     store.commit(events.syncStateUpdated({
      lastSyncTimestamp: serverResponse.timestamp,
      clientId,
      isOnline: true
    }));
    return serverResponse;
  } catch (error) {
   store.commit(events.syncStateUpdated({
      lastSyncTimestamp: Date.now(),
      clientId: 'local',
      isOnline: false
    }));
    throw error;
  }
};

export const resolveConflict = async (
  store: AppStore,
  documentId: string,
  resolution: 'local' | 'server' | 'merged',
  mergedContent?: string
) => {
  const clientId = await getClientId(store);

  await store.commit(events.conflictResolved({
    id: documentId,
    resolution,
    mergedContent: resolution === 'merged' ? (mergedContent ?? '') : null,
    clientTimestamp: Date.now(),
    updatedAt: Date.now()
  }));

  await apiClient.resolveConflict({
    documentId,
    resolution,
    mergedContent: resolution === 'merged' ? mergedContent : undefined
  });
};

export const uploadLocalChanges = async (store: AppStore, documents: Document[]) => {
  const clientId = await getClientId(store);
  
  for (const doc of documents) {
    try {
      if (doc.isDeleted) {
        await apiClient.deleteDocument(doc.id, clientId);
      } else if (doc.serverTimestamp === undefined) {
        await apiClient.createDocument(doc.content);
      } else {
        await apiClient.updateDocument(doc.id, doc.content, doc.version);
      }
    } catch (error: any) {
      if (error.status === 409) {
         store.commit(events.conflictResolved({
          id: doc.id,
          resolution: 'local',
          mergedContent: null,
          clientTimestamp: Date.now(),
          updatedAt: Date.now()
        }));
      } else {
        throw error;
      }
    }
  }
};