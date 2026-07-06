import type { BaseRepository } from '@/lib/repository';
import type { Jwk } from '../entities/jwk';
import type {
  CreateJwkSchema as JwkCreate,
  UpdateJwkSchema as JwkUpdate,
} from '../schemas';

type IJwkRepository = BaseRepository<Jwk, JwkCreate, JwkUpdate>;

export type { IJwkRepository, JwkCreate, JwkUpdate };
