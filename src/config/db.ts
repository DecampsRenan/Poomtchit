import Dexie, { Table } from 'dexie';

export interface Session {
  id?: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  samples?: ArrayBuffer[];
}

export class JamboxDexieDb extends Dexie {
  sessions!: Table<Session>;

  constructor() {
    super('jambox');
    this.version(1).stores({
      sessions: '++id, name, createdAt, updatedAt',
    });
  }
}

export const db = new JamboxDexieDb();
