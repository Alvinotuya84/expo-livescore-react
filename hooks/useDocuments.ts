import { useQuery as useLiveQuery } from '@livestore/react';
import { useMutation } from '@tanstack/react-query';
import { schema } from '../lib/livestore';
import { syncWithServer, uploadLocalChanges } from '../lib/sync';

// LiveStore queries
export const useDocuments = () => {
  return useLiveQuery(
    schema.documents.select()
      .where({ isDeleted: false })
      .orderBy('updatedAt', 'desc')
  );
};

export const useDocument = (id: string) => {
  return useLiveQuery(
    schema.documents.select()
      .where({ id })
      .first()
  );
};

export const useConflicts = () => {
  return useLiveQuery(
    schema.documents.select()
      .where({ conflictStatus: 'pending' })
  );
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
      const documents = await useDocuments();
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