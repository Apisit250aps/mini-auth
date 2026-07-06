import { MongoDBAdapterConfig } from '@better-auth/mongo-adapter';
import { BetterAuthOptions } from 'better-auth';
import { createAdapterFactory } from 'better-auth/adapters';
import { CleanedWhere, CustomAdapter } from 'better-auth/adapters';
import { Db, MongoClient } from 'mongodb';

import {
  AllAccountUseCase,
  AllSessionUseCase,
  AllUserUseCase,
  AllVerificationUseCase,
  AllJwkUseCase,
  CreateAccountUseCase,
  CreateSessionUseCase,
  CreateUserUseCase,
  CreateVerificationUseCase,
  CreateJwkUseCase,
  DeleteAccountUseCase,
  DeleteSessionUseCase,
  DeleteUserUseCase,
  DeleteVerificationUseCase,
  DeleteJwkUseCase,
  UpdateAccountUseCase,
  UpdateSessionUseCase,
  UpdateUserUseCase,
  UpdateVerificationUseCase,
  UpdateJwkUseCase,
} from '@/core/infrastructures/applications';
import AccountRepository from '@/core/infrastructures/repositories/account.repo';
import SessionRepository from '@/core/infrastructures/repositories/session.repo';
import UserRepository from '@/core/infrastructures/repositories/user.repo';
import VerificationRepository from '@/core/infrastructures/repositories/verification.repo';
import JwkRepository from '@/core/infrastructures/repositories/jwk.repo';

type AdapterEntity = Record<string, unknown> & { id: string };
type AdapterPatch = Record<string, unknown>;
type AdapterModel = 'user' | 'session' | 'account' | 'verification' | 'jwk';

type ModelUseCase = {
  create: (data: AdapterPatch) => Promise<AdapterEntity>;
  all: (filter?: AdapterPatch) => Promise<AdapterEntity[]>;
  updateById: (id: string, data: AdapterPatch) => Promise<AdapterEntity | null>;
  deleteById: (id: string) => Promise<boolean>;
};

const normalizeModel = (model: string): AdapterModel => {
  const normalized = model.toLowerCase();
  if (normalized === 'users' || normalized === 'user') return 'user';
  if (normalized === 'sessions' || normalized === 'session') return 'session';
  if (normalized === 'accounts' || normalized === 'account') return 'account';
  if (normalized === 'verifications' || normalized === 'verification') {
    return 'verification';
  }
  if (normalized === 'jwks' || normalized === 'jwk') {
    return 'jwk';
  }

  throw new Error(`Unsupported model: ${model}`);
};

const toPatch = (value: unknown): AdapterPatch => {
  if (value && typeof value === 'object') {
    return value as AdapterPatch;
  }

  return {};
};

const toAdapterEntity = (value: unknown): AdapterEntity => {
  const entity = toPatch(value);
  const id = entity.id;
  return {
    ...entity,
    id: typeof id === 'string' ? id : String(id ?? ''),
  };
};

const toAdapterEntities = (value: unknown[]): AdapterEntity[] => {
  return value.map((item) => toAdapterEntity(item));
};

const buildEqFilter = (where?: CleanedWhere[]): AdapterPatch | undefined => {
  if (!where?.length) return undefined;

  const filter: AdapterPatch = {};
  for (const clause of where) {
    if (clause.operator !== 'eq' || clause.connector === 'OR') {
      continue;
    }

    filter[clause.field] = clause.value;
  }

  return Object.keys(filter).length > 0 ? filter : undefined;
};

const toComparable = (
  value: unknown,
): string | number | boolean | Date | null => {
  if (value === null) return null;
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }
  if (value instanceof Date) return value;
  return String(value);
};

const testClause = (record: AdapterEntity, where: CleanedWhere): boolean => {
  const left = toComparable(record[where.field]);
  const right = where.value;

  const isOrderedComparable = (
    input: unknown,
  ): input is string | number | boolean | Date => {
    return (
      input instanceof Date ||
      typeof input === 'string' ||
      typeof input === 'number' ||
      typeof input === 'boolean'
    );
  };

  const canOrder = isOrderedComparable(left) && isOrderedComparable(right);

  switch (where.operator) {
    case 'eq':
      return left === right;
    case 'ne':
      return left !== right;
    case 'lt':
      return canOrder ? left < right : false;
    case 'lte':
      return canOrder ? left <= right : false;
    case 'gt':
      return canOrder ? left > right : false;
    case 'gte':
      return canOrder ? left >= right : false;
    case 'in':
      return Array.isArray(right) ? right.includes(left as never) : false;
    case 'not_in':
      return Array.isArray(right) ? !right.includes(left as never) : true;
    case 'contains':
      return String(left ?? '').includes(String(right));
    case 'starts_with':
      return String(left ?? '').startsWith(String(right));
    case 'ends_with':
      return String(left ?? '').endsWith(String(right));
    default:
      return false;
  }
};

const applyWhere = (
  records: AdapterEntity[],
  where?: CleanedWhere[],
): AdapterEntity[] => {
  if (!where?.length) return records;

  return records.filter((record) => {
    let result = testClause(record, where[0]);

    for (let i = 1; i < where.length; i++) {
      const clauseResult = testClause(record, where[i]);
      if (where[i].connector === 'OR') {
        result = result || clauseResult;
      } else {
        result = result && clauseResult;
      }
    }

    return result;
  });
};

const applySelect = <T extends AdapterEntity>(
  item: T,
  select?: string[],
): T => {
  if (!select?.length) return item;

  const selected: AdapterPatch = {};
  for (const field of select) {
    if (field in item) {
      selected[field] = item[field];
    }
  }

  return selected as T;
};

const toId = (item: AdapterEntity): string | null => {
  return typeof item.id === 'string' ? item.id : null;
};

const sortRecords = (
  records: AdapterEntity[],
  sortBy?: { field: string; direction: 'asc' | 'desc' },
): AdapterEntity[] => {
  if (!sortBy) return records;

  const sorted = [...records];
  sorted.sort((a, b) => {
    const aValue = toComparable(a[sortBy.field]);
    const bValue = toComparable(b[sortBy.field]);

    if (aValue === bValue) return 0;
    if (aValue === null) return sortBy.direction === 'asc' ? -1 : 1;
    if (bValue === null) return sortBy.direction === 'asc' ? 1 : -1;

    if (aValue < bValue) return sortBy.direction === 'asc' ? -1 : 1;
    return sortBy.direction === 'asc' ? 1 : -1;
  });

  return sorted;
};

const paginate = (
  records: AdapterEntity[],
  limit: number,
  offset?: number,
): AdapterEntity[] => {
  const start = offset ?? 0;
  const end = start + limit;
  return records.slice(start, end);
};

const resolveClient = (db: Db, config?: MongoDBAdapterConfig): MongoClient => {
  const dbWithClient = db as Db & { client?: MongoClient };
  const client = config?.client ?? dbWithClient.client;
  if (!client) {
    throw new Error('MongoClient is required for AppAdapter');
  }

  return client;
};

const buildUseCases = (
  client: MongoClient,
): Record<AdapterModel, ModelUseCase> => {
  const userRepository = new UserRepository(client);
  const sessionRepository = new SessionRepository(client);
  const accountRepository = new AccountRepository(client);
  const verificationRepository = new VerificationRepository(client);
  const jwkRepository = new JwkRepository(client);

  return {
    user: {
      create: async (data) =>
        toAdapterEntity(
          await new CreateUserUseCase(userRepository).execute({
            data: toPatch(data) as never,
          }),
        ),
      all: async (filter) =>
        toAdapterEntities(
          await new AllUserUseCase(userRepository).execute({
            filter: toPatch(filter) as never,
          }),
        ),
      updateById: (id, data) =>
        new UpdateUserUseCase(userRepository).execute({
          id,
          data: toPatch(data) as never,
        }) as Promise<AdapterEntity | null>,
      deleteById: (id) => new DeleteUserUseCase(userRepository).execute({ id }),
    },
    session: {
      create: async (data) =>
        toAdapterEntity(
          await new CreateSessionUseCase(sessionRepository).execute({
            data: toPatch(data) as never,
          }),
        ),
      all: async (filter) =>
        toAdapterEntities(
          await new AllSessionUseCase(sessionRepository).execute({
            filter: toPatch(filter) as never,
          }),
        ),
      updateById: (id, data) =>
        new UpdateSessionUseCase(sessionRepository).execute({
          id,
          data: toPatch(data) as never,
        }) as Promise<AdapterEntity | null>,
      deleteById: (id) =>
        new DeleteSessionUseCase(sessionRepository).execute({ id }),
    },
    account: {
      create: async (data) =>
        toAdapterEntity(
          await new CreateAccountUseCase(accountRepository).execute({
            data: toPatch(data) as never,
          }),
        ),
      all: async (filter) =>
        toAdapterEntities(
          await new AllAccountUseCase(accountRepository).execute({
            filter: toPatch(filter) as never,
          }),
        ),
      updateById: (id, data) =>
        new UpdateAccountUseCase(accountRepository).execute({
          id,
          data: toPatch(data) as never,
        }) as Promise<AdapterEntity | null>,
      deleteById: (id) =>
        new DeleteAccountUseCase(accountRepository).execute({ id }),
    },
    verification: {
      create: async (data) =>
        toAdapterEntity(
          await new CreateVerificationUseCase(verificationRepository).execute({
            data: toPatch(data) as never,
          }),
        ),
      all: async (filter) =>
        toAdapterEntities(
          await new AllVerificationUseCase(verificationRepository).execute({
            filter: toPatch(filter) as never,
          }),
        ),
      updateById: (id, data) =>
        new UpdateVerificationUseCase(verificationRepository).execute({
          id,
          data: toPatch(data) as never,
        }) as Promise<AdapterEntity | null>,
      deleteById: (id) =>
        new DeleteVerificationUseCase(verificationRepository).execute({ id }),
    },
    jwk: {
      create: async (data) =>
        toAdapterEntity(
          await new CreateJwkUseCase(jwkRepository).execute({
            data: toPatch(data) as never,
          }),
        ),
      all: async (filter) =>
        toAdapterEntities(
          await new AllJwkUseCase(jwkRepository).execute({
            filter: toPatch(filter) as never,
          }),
        ),
      updateById: (id, data) =>
        new UpdateJwkUseCase(jwkRepository).execute({
          id,
          data: toPatch(data) as never,
        }) as Promise<AdapterEntity | null>,
      deleteById: (id) => new DeleteJwkUseCase(jwkRepository).execute({ id }),
    },
  };
};

export const adapter =
  (db: Db, config?: MongoDBAdapterConfig) => (options: BetterAuthOptions) => {
    const client = resolveClient(db, config);
    const useCases = buildUseCases(client);

    const customAdapter: CustomAdapter = {
      create: async <T extends Record<string, unknown>>({
        data,
        model,
        select,
      }: {
        model: string;
        data: T;
        select?: string[];
      }): Promise<T> => {
        const entry = await useCases[normalizeModel(model)].create(data);
        return applySelect(entry, select) as unknown as T;
      },

      findOne: async <T>({
        model,
        where,
        select,
      }: {
        model: string;
        where: CleanedWhere[];
        select?: string[];
      }): Promise<T | null> => {
        const list = await useCases[normalizeModel(model)].all(
          buildEqFilter(where),
        );
        const filtered = applyWhere(list, where);
        const first = filtered[0];
        if (!first) return null;

        return applySelect(first, select) as unknown as T;
      },

      findMany: async <T>({
        model,
        where,
        limit,
        select,
        sortBy,
        offset,
      }: {
        model: string;
        where?: CleanedWhere[];
        limit: number;
        select?: string[];
        sortBy?: { field: string; direction: 'asc' | 'desc' };
        offset?: number;
      }): Promise<T[]> => {
        const list = await useCases[normalizeModel(model)].all(
          buildEqFilter(where),
        );
        const filtered = applyWhere(list, where);
        const sorted = sortRecords(filtered, sortBy);
        const paged = paginate(sorted, limit, offset);

        return paged.map((item) => applySelect(item, select) as unknown as T);
      },

      count: async ({ model, where }) => {
        const list = await useCases[normalizeModel(model)].all(
          buildEqFilter(where),
        );
        return applyWhere(list, where).length;
      },

      update: async <T>({
        model,
        where,
        update,
      }: {
        model: string;
        where: CleanedWhere[];
        update: T;
      }): Promise<T | null> => {
        const list = await useCases[normalizeModel(model)].all(
          buildEqFilter(where),
        );
        const target = applyWhere(list, where)[0];
        if (!target) return null;

        const id = toId(target);
        if (!id) return null;

        const updated = await useCases[normalizeModel(model)].updateById(
          id,
          toPatch(update),
        );

        return updated as unknown as T | null;
      },

      updateMany: async ({ model, where, update }) => {
        const list = await useCases[normalizeModel(model)].all(
          buildEqFilter(where),
        );
        const targets = applyWhere(list, where);

        let updatedCount = 0;
        for (const target of targets) {
          const id = toId(target);
          if (!id) continue;

          const updated = await useCases[normalizeModel(model)].updateById(
            id,
            update,
          );
          if (updated) {
            updatedCount++;
          }
        }

        return updatedCount;
      },

      delete: async ({ model, where }) => {
        const list = await useCases[normalizeModel(model)].all(
          buildEqFilter(where),
        );
        const target = applyWhere(list, where)[0];
        if (!target) return;

        const id = toId(target);
        if (!id) return;

        await useCases[normalizeModel(model)].deleteById(id);
      },

      deleteMany: async ({ model, where }) => {
        const list = await useCases[normalizeModel(model)].all(
          buildEqFilter(where),
        );
        const targets = applyWhere(list, where);

        let deletedCount = 0;
        for (const target of targets) {
          const id = toId(target);
          if (!id) continue;

          const deleted = await useCases[normalizeModel(model)].deleteById(id);
          if (deleted) {
            deletedCount++;
          }
        }

        return deletedCount;
      },

      consumeOne: async <T>({
        model,
        where,
      }: {
        model: string;
        where: CleanedWhere[];
      }): Promise<T | null> => {
        const list = await useCases[normalizeModel(model)].all(
          buildEqFilter(where),
        );
        const target = applyWhere(list, where)[0];
        if (!target) return null;

        const id = toId(target);
        if (!id) return null;

        const deleted = await useCases[normalizeModel(model)].deleteById(id);
        return (deleted ? target : null) as unknown as T | null;
      },

      incrementOne: async <T>({
        model,
        where,
        increment,
        set,
      }: {
        model: string;
        where: CleanedWhere[];
        increment: Record<string, number>;
        set?: Record<string, unknown>;
      }): Promise<T | null> => {
        const list = await useCases[normalizeModel(model)].all(
          buildEqFilter(where),
        );
        const target = applyWhere(list, where)[0];
        if (!target) return null;

        const id = toId(target);
        if (!id) return null;

        const patch: AdapterPatch = { ...(set ?? {}) };
        for (const [key, delta] of Object.entries(increment)) {
          const currentValue = Number(target[key] ?? 0);
          patch[key] = currentValue + delta;
        }

        const updated = await useCases[normalizeModel(model)].updateById(
          id,
          patch,
        );
        return updated as unknown as T | null;
      },
    };

    const factory = createAdapterFactory({
      config: {
        adapterId: 'app-adapter',
        adapterName: 'App Adapter',
        usePlural: config?.usePlural ?? false,
        debugLogs: config?.debugLogs ?? false,
        transaction: false,
        supportsArrays: true,
        supportsDates: true,
        supportsBooleans: true,
        supportsJSON: true,
      },
      adapter: () => customAdapter,
    });

    return factory(options);
  };
