import {
  ClientSession,
  Collection,
  Document,
  Filter,
  MongoClient,
  InsertOneOptions,
  UpdateFilter,
  OptionalUnlessRequiredId,
  Abortable,
  FindOptions,
  IndexDescription,
  IndexDirection,
} from 'mongodb';

import { omit } from 'lodash';
export * from './entity';

type BaseRepository<T, Create, Update> = {
  findAll(filter?: unknown): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(entity: Create): Promise<T>;
  update(id: string, entity: Update): Promise<T>;
  delete(id: string): Promise<void>;
};

export type AppIndexDescription<T> = IndexDescription & {
  key: { [P in keyof T]?: IndexDirection };
};

export type { BaseRepository };

export async function collection<T extends Document>(
  client: MongoClient,
  collectionName: string,
  indexes: AppIndexDescription<T>[],
): Promise<Collection<T>> {
  const db = client.db();
  const collection = db.collection<T>(collectionName);

  const allIndexes: AppIndexDescription<T>[] = [
    {
      key: { id: 1 } as never,
      unique: true,
      name: 'uniq_id',
    },
    ...indexes,
  ];

  const partialIndexes = allIndexes.map((index) => {
    if (index.unique) {
      return {
        ...index,
        name: `${index.name}_active`,
        partialFilterExpression: {
          ...index.partialFilterExpression,
          deletedAt: null,
        },
      };
    }
    return index;
  });

  await collection.createIndexes(partialIndexes);

  return collection;
}

export default abstract class Repository<
  T extends Document & {
    id: string;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  },
> implements BaseRepository<T, T, Omit<T, 'id'>> {
  protected collection: Promise<Collection<T>>;

  constructor(
    client: MongoClient,
    collectionName: string,
    indexes: AppIndexDescription<T>[],
  ) {
    this.collection = collection<T>(client, collectionName, indexes);
  }

  protected abstract toEntity(data: T): T;

  async findAll(
    filter?: Filter<T>,
    options?: FindOptions & Abortable,
  ): Promise<T[]> {
    const col = await this.collection;
    const results = await col
      .find(
        {
          ...filter,
          deletedAt: null,
        } as Filter<T>,
        options,
      )
      .toArray();
    return results.map((item) => this.toEntity(item as unknown as T));
  }

  async findById(id: string): Promise<T | null> {
    const col = await this.collection;
    const result = await col.findOne({
      id,
    } as Filter<T>);
    return result ? this.toEntity(result as unknown as T) : null;
  }

  async create(entity: T, options?: InsertOneOptions): Promise<T> {
    const col = await this.collection;
    const result = await col.insertOne(
      entity as OptionalUnlessRequiredId<T>,
      options,
    );
    if (!result.acknowledged) {
      throw new Error('Failed to create entity');
    }
    return this.toEntity(entity);
  }

  async update(
    id: string,
    entity: T,
    options?: { session?: ClientSession },
  ): Promise<T> {
    const col = await this.collection;
    const result = await col.findOneAndUpdate(
      { id, deletedAt: null } as Filter<T>,
      { $set: omit(entity, ['id', 'createdAt', 'deletedAt']) as T },
      { returnDocument: 'after', ...options },
    );
    if (!result) {
      throw new Error('Failed to update entity');
    }
    return this.toEntity(result as unknown as T);
  }

  async delete(id: string): Promise<void> {
    try {
      const col = await this.collection;
      const deletedAt = new Date();
      await col.updateOne(
        { id, deletedAt: null } as Filter<T>,
        {
          $set: { deletedAt },
        } as UpdateFilter<T>,
      );
    } catch (error) {
      console.error('Error deleting entity:', error);
    }
  }
}
