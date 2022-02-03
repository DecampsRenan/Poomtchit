import Dexie, { Table } from 'dexie';

export type Session = {
  id?: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Sample = {
  id?: number;
  sessionId: number;
  arrayBuffer?: ArrayBuffer;
};

export class JamboxDexieDb extends Dexie {
  sessions!: Table<Session>;
  samples!: Table<Sample>;

  constructor() {
    super('jambox');
    this.version(1).stores({
      sessions: '++id, name, createdAt, updatedAt',
    });

    this.version(2)
      .stores({
        sessions: '++id, name, createdAt, updatedAt',
        samples: '++id, sessionId',
      })
      .upgrade((tx) => {
        return tx
          .table('sessions')
          .toCollection()
          .modify((session) => {
            console.log('session', session);
            if (session.samples) {
              tx.table('samples').bulkAdd(
                session.samples.map(
                  (sample): Sample => ({
                    sessionId: session.id,
                    arrayBuffer: sample,
                  })
                )
              );
            }
            delete session.samples;
          });
      });
  }
}

export const db = new JamboxDexieDb();
