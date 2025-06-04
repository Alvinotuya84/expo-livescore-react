import { useQuery as useLiveQuery } from '@livestore/react';
import { useMutation } from '@tanstack/react-query';
import { Document } from '../lib/api';
import { queries } from '../lib/livestore';
import { syncWithServer, uploadLocalChanges } from '../lib/sync';

// LiveStore queries
export const useDocuments = () => {
  return useLiveQuery(queries.activeDocuments$) as unknown as Document[];
};

export const useDocument = (id: string) => {
  return useLiveQuery(queries.documentById$(id)) as unknown as Document;
};

export const useConflicts = () => {
  return useLiveQuery(queries.conflicts$) as unknown as Document[];
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