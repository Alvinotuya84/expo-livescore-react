import { Events, makeSchema, queryDb, Schema, State } from '@livestore/livestore';

// Define SQLite tables
export const tables = {
  documents: State.SQLite.table({
    name: 'documents',
    columns: {
      id: State.SQLite.text({ primaryKey: true }),
      content: State.SQLite.text({ default: '' }),
      version: State.SQLite.integer({ default: 1 }),
      clientId: State.SQLite.text(),
      clientTimestamp: State.SQLite.integer(),
      serverTimestamp: State.SQLite.integer({ nullable: true }),
      isDeleted: State.SQLite.boolean({ default: false }),
      conflictsWith: State.SQLite.text({ nullable: true }),
      conflictStatus: State.SQLite.text({ default: 'active' }),
      createdAt: State.SQLite.integer(),
      updatedAt: State.SQLite.integer()
    }
  }),
  
  syncState: State.SQLite.table({
    name: 'syncState',
    columns: {
      id: State.SQLite.text({ primaryKey: true }),
      lastSyncTimestamp: State.SQLite.integer({ default: 0 }),
      clientId: State.SQLite.text(),
      isOnline: State.SQLite.boolean({ default: false })
    }
  })
};

// Define events
export const events = {
  documentCreated: Events.synced({
    name: 'v1.DocumentCreated',
    schema: Schema.Struct({
      id: Schema.String,
      content: Schema.String,
      clientId: Schema.String,
      clientTimestamp: Schema.Number,
      version: Schema.Number,
      createdAt: Schema.Number,
      updatedAt: Schema.Number
    })
  }),

  documentUpdated: Events.synced({
    name: 'v1.DocumentUpdated',
    schema: Schema.Struct({
      id: Schema.String,
      content: Schema.String,
      version: Schema.Number,
      clientTimestamp: Schema.Number,
      updatedAt: Schema.Number
    })
  }),

  documentDeleted: Events.synced({
    name: 'v1.DocumentDeleted',
    schema: Schema.Struct({
      id: Schema.String,
      clientTimestamp: Schema.Number,
      updatedAt: Schema.Number
    })
  }),

  conflictResolved: Events.synced({
    name: 'v1.ConflictResolved',
    schema: Schema.Struct({
      id: Schema.String,
      resolution: Schema.Union(Schema.Literal('local'), Schema.Literal('server'), Schema.Literal('merged')),
      mergedContent: Schema.Union(Schema.String, Schema.Null),
      clientTimestamp: Schema.Number,
      updatedAt: Schema.Number
    })
  }),

  syncStateUpdated: Events.synced({
    name: 'v1.SyncStateUpdated',
    schema: Schema.Struct({
      lastSyncTimestamp: Schema.Number,
      clientId: Schema.String,
      isOnline: Schema.Boolean
    })
  })
};

// Define queries using queryDb
export const queries = {
  documents$: queryDb(
    (get) => tables.documents.select(),
    { label: 'documents' }
  ),
  
  documentById$: (id: string) => queryDb(
    (get) => tables.documents.select().where({ id }),
    { label: 'documentById' }
  ),
  
  activeDocuments$: queryDb(
    (get) => tables.documents.select().where({ isDeleted: false }),
    { label: 'activeDocuments' }
  ),
  
  conflicts$: queryDb(
    (get) => tables.documents.select().where({ conflictStatus: 'pending' }),
    { label: 'conflicts' }
  ),
  
  syncState$: queryDb(
    (get) => tables.syncState.select().where({ id: 'current' }),
    { label: 'syncState' }
  )
};

// Define materializers
const materializers = State.SQLite.materializers(events, {
  'v1.DocumentCreated': ({ id, content, clientId, clientTimestamp, version, createdAt, updatedAt }) =>
    tables.documents.insert({
      id,
      content,
      clientId,
      clientTimestamp,
      version,
      createdAt,
      updatedAt
    }),

  'v1.DocumentUpdated': ({ id, content, version, clientTimestamp, updatedAt }) =>
    tables.documents.update({
      content,
      version,
      clientTimestamp,
      updatedAt
    }).where({ id }),

  'v1.DocumentDeleted': ({ id, clientTimestamp, updatedAt }) =>
    tables.documents.update({
      isDeleted: true,
      clientTimestamp,
      updatedAt
    }).where({ id }),

  'v1.ConflictResolved': ({ id, resolution, mergedContent, clientTimestamp, updatedAt }) =>
    tables.documents.update({
      conflictStatus: 'resolved',
      content: mergedContent ?? '',
      clientTimestamp,
      updatedAt
    }).where({ id }),

  'v1.SyncStateUpdated': ({ lastSyncTimestamp, clientId, isOnline }) =>
    tables.syncState.insert({
      id: 'current',
      lastSyncTimestamp,
      clientId,
      isOnline
    })
});

// Create state
const state = State.SQLite.makeState({ tables, materializers });

// Export schema
export const schema = makeSchema({ events, state }); 