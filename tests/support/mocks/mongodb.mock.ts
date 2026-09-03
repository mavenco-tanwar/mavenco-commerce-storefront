/**
 * Module 37: In-Memory MongoDB Mock Engine
 * Provides deterministic, isolated database operations for fast unit and integration testing
 * without requiring a live MongoDB server or network connectivity.
 */

export class MockMongoCollection<T extends Record<string, any> = any> {
  private documents: T[] = [];

  constructor(public collectionName: string, initialDocs: T[] = []) {
    this.documents = JSON.parse(JSON.stringify(initialDocs));
  }

  public async find(query: Record<string, any> = {}): Promise<{
    toArray: () => Promise<T[]>;
    sort: (sortSpec: Record<string, 1 | -1>) => any;
    limit: (n: number) => any;
  }> {
    let filtered = this.documents.filter((doc) => this.matchesQuery(doc, query));
    const cursor = {
      sort: (sortSpec: Record<string, 1 | -1>) => {
        const [field, dir] = Object.entries(sortSpec)[0] || [];
        if (field) {
          filtered.sort((a, b) => {
            if (a[field] < b[field]) return dir === 1 ? -1 : 1;
            if (a[field] > b[field]) return dir === 1 ? 1 : -1;
            return 0;
          });
        }
        return cursor;
      },
      limit: (n: number) => {
        filtered = filtered.slice(0, n);
        return cursor;
      },
      toArray: async () => JSON.parse(JSON.stringify(filtered)),
    };
    return cursor;
  }

  public async findOne(query: Record<string, any>): Promise<T | null> {
    const doc = this.documents.find((d) => this.matchesQuery(d, query));
    return doc ? JSON.parse(JSON.stringify(doc)) : null;
  }

  public async insertOne(doc: T): Promise<{ insertedId: string; acknowledged: boolean }> {
    const inserted = { ...doc, _id: doc._id || `mock_id_${Date.now()}_${Math.random()}` };
    this.documents.push(inserted);
    return { insertedId: inserted._id, acknowledged: true };
  }

  public async insertMany(docs: T[]): Promise<{ insertedCount: number; acknowledged: boolean }> {
    for (const d of docs) {
      await this.insertOne(d);
    }
    return { insertedCount: docs.length, acknowledged: true };
  }

  public async updateOne(
    query: Record<string, any>,
    update: { $set?: Partial<T>; $inc?: Record<string, number> },
    options?: { upsert?: boolean }
  ): Promise<{ modifiedCount: number; upsertedId?: string }> {
    const index = this.documents.findIndex((d) => this.matchesQuery(d, query));
    if (index >= 0) {
      if (update.$set) {
        this.documents[index] = { ...this.documents[index], ...update.$set };
      }
      if (update.$inc) {
        for (const [k, val] of Object.entries(update.$inc)) {
          this.documents[index][k] = (this.documents[index][k] || 0) + val;
        }
      }
      return { modifiedCount: 1 };
    } else if (options?.upsert) {
      const newDoc = { ...(query as any), ...(update.$set || {}) };
      await this.insertOne(newDoc);
      return { modifiedCount: 1, upsertedId: newDoc._id };
    }
    return { modifiedCount: 0 };
  }

  public async countDocuments(query: Record<string, any> = {}): Promise<number> {
    return this.documents.filter((d) => this.matchesQuery(d, query)).length;
  }

  public async deleteMany(query: Record<string, any> = {}): Promise<{ deletedCount: number }> {
    const initialLen = this.documents.length;
    this.documents = this.documents.filter((d) => !this.matchesQuery(d, query));
    return { deletedCount: initialLen - this.documents.length };
  }

  private matchesQuery(doc: Record<string, any>, query: Record<string, any>): boolean {
    if (!query || Object.keys(query).length === 0) return true;

    // Support $or queries
    if (Array.isArray(query.$or)) {
      return query.$or.some((subQuery) => this.matchesQuery(doc, subQuery));
    }

    for (const [key, value] of Object.entries(query)) {
      if (key === '$or') continue;
      if (doc[key] !== value) return false;
    }
    return true;
  }
}

export class MockMongoDatabase {
  private collections: Map<string, MockMongoCollection> = new Map();

  constructor(public databaseName: string) {}

  public collection<T extends Record<string, any> = any>(name: string): MockMongoCollection<T> {
    if (!this.collections.has(name)) {
      this.collections.set(name, new MockMongoCollection<T>(name));
    }
    return this.collections.get(name)! as MockMongoCollection<T>;
  }

  public clear(): void {
    this.collections.clear();
  }
}
