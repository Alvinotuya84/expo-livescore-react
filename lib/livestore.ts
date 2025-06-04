import { createStore, generateId } from '@livestore/react';

// Schema definition
export const schema = createStore({
  documents: {
    id: { type: 'string', primaryKey: true },
    content: { type: 'string', default: '' },
    version: { type: 'number', default: 1 },
    clientId: { type: 'string' },
    clientTimestamp: { type: 'number' },
    serverTimestamp: { type: 'number', nullable: true },
    isDeleted: { type: 'boolean', default: false },
    conflictsWith: { type: 'string', nullable: true },
    conflictStatus: { type: 'string', default: 'active' },
    createdAt: { type: 'number' },
    updatedAt: { type: 'number' }
  },
  
  syncState: {
    id: { type: 'string', primaryKey: true },
    lastSyncTimestamp: { type: 'number', default: 0 },
    clientId: { type: 'string' },
    isOnline: { type: 'boolean', default: false }
  }
});

// Helper function to get client ID
const getClientId = () => {
  // In a real app, this would be stored in AsyncStorage
  return 'client-' + generateId();
};

// Document mutations
export const documentMutations = {
  createDocument: (content: string) => ({
    documents: {
      insert: {
        id: generateId(),
        content,
        clientId: getClientId(),
        clientTimestamp: Date.now(),
        version: 1,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    }
  }),
  
  updateDocument: (id: string, content: string, version: number) => ({
    documents: {
      update: {
        where: { id },
        set: {
          content,
          version,
          clientTimestamp: Date.now(),
          updatedAt: Date.now()
        }
      }
    }
  }),
  
  markDeleted: (id: string) => ({
    documents: {
      update: {
        where: { id },
        set: {
          isDeleted: true,
          clientTimestamp: Date.now(),
          updatedAt: Date.now()
        }
      }
    }
  }),

  resolveConflict: (id: string, resolution: 'local' | 'server' | 'merged', mergedContent?: string) => ({
    documents: {
      update: {
        where: { id },
        set: {
          conflictStatus: 'resolved',
          content: mergedContent,
          clientTimestamp: Date.now(),
          updatedAt: Date.now()
        }
      }
    }
  })
};

// Sync state mutations
export const syncMutations = {
  updateSyncState: (lastSyncTimestamp: number, isOnline: boolean) => ({
    syncState: {
      upsert: {
        id: 'current',
        lastSyncTimestamp,
        clientId: getClientId(),
        isOnline
      }
    }
  })
}; 