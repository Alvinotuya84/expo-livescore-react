import { useStore } from '@/lib/store';
import { Store } from '@livestore/livestore';
import { ReactApi, useQuery as useLiveQuery } from '@livestore/react';
import { useMutation } from '@tanstack/react-query';
import { Document } from '../lib/api';
import { queries } from '../lib/livestore';
import { syncWithServer, uploadLocalChanges } from '../lib/sync';

// Helper function for LiveStore queries
const useLiveStoreQuery = <T>(query: any) => {
  const store = useStore();
  console.log('store', store);
  return useLiveQuery(query, {
    store: store as Store & ReactApi // TODO: Fix type issue
  }) as unknown as T;
};

// LiveStore queries
export const useDocuments = () => {
  return useLiveStoreQuery<Document[]>(queries.activeDocuments$);
};

export const useDocument = (id: string) => {
  return useLiveStoreQuery<Document>(queries.documentById$(id));
};

export const useConflicts = () => {
  return useLiveStoreQuery<Document[]>(queries.conflicts$);
};

// React Query mutations
export const useSyncMutation = () => {
  return useMutation({
    mutationFn: syncWithServer,
    onError: (error) => {
      console.error('Sync failed:', error);
    }
  });
};

export const useUploadMutation = () => {
  return useMutation({
    mutationFn: uploadLocalChanges,
    onError: (error) => {
      console.error('Upload failed:', error);
    }
  });
};

// Combined hooks for document operations
export const useDocumentOperations = () => {
  const syncMutation = useSyncMutation();
  const uploadMutation = useUploadMutation();

  const sync = async () => {
    try {
      await syncMutation.mutateAsync();
      // After sync, upload any local changes
      const documents = useDocuments();
      await uploadMutation.mutateAsync(documents);
    } catch (error) {
      console.error('Document operations failed:', error);
      throw error;
    }
  };

  return {
    sync,
    isSyncing: syncMutation.isPending || uploadMutation.isPending,
    error: syncMutation.error || uploadMutation.error
  };
};