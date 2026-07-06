import type { BaseRepository } from '@/lib/repository';
import type { User } from '../entities/user';
import type {
  CreateUserSchema as UserCreate,
  UpdateUserSchema as UserUpdate,
} from '../schemas';

type IUserRepository = BaseRepository<User, UserCreate, UserUpdate>;

export type { IUserRepository, UserCreate, UserUpdate };
