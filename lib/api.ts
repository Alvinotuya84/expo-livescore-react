import { QueryClient } from '@tanstack/react-query';

// API base URL - replace with your actual backend URL
const API_BASE_URL = 'http://localhost:3000';

// Types
export interface Document {
  id: string;
  content: string;
  version: number;
  clientId: string;
  clientTimestamp: number;
  serverTimestamp?: number;
  isDeleted: boolean;
  conflictsWith?: string;
  conflictStatus: 'active' | 'pending' | 'resolved';
  createdAt: number;
  updatedAt: number;
}

export interface SyncResponse {
  documents: Document[];
  conflicts: Document[];
  timestamp: number;
}

export interface ConflictResolution {
  documentId: string;
  resolution: 'local' | 'server' | 'merged';
  mergedContent?: string;
}

// API client
export const apiClient = {
  // Document operations
  createDocument: async (content: string): Promise<Document> => {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    return response.json();
  },

  getDocuments: async (): Promise<Document[]> => {
    const response = await fetch(`${API_BASE_URL}/documents`);
    return response.json();
  },

  getDocument: async (id: string): Promise<Document> => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`);
    return response.json();
  },

  updateDocument: async (id: string, content: string, version: number): Promise<Document> => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, version })
    });
    return response.json();
  },

  deleteDocument: async (id: string, clientId: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/documents/${id}?clientId=${clientId}`, {
      method: 'DELETE'
    });
  },

  // Sync operations
  sync: async (lastSyncTimestamp: number, clientId: string): Promise<SyncResponse> => {
    const response = await fetch(`${API_BASE_URL}/documents/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lastSyncTimestamp, clientId })
    });
    return response.json();
  },

  getConflicts: async (): Promise<Document[]> => {
    const response = await fetch(`${API_BASE_URL}/documents/conflicts`);
    return response.json();
  },

  resolveConflict: async (resolution: ConflictResolution): Promise<void> => {
    await fetch(`${API_BASE_URL}/documents/resolve-conflict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resolution)
    });
  }
};

// React Query client configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    },
    mutations: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    }
  }
}); 