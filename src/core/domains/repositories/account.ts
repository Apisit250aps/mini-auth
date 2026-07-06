import type { BaseRepository } from '@/lib/repository';
import type { Account } from '../entities/account';
import type {
  CreateAccountSchema as AccountCreate,
  UpdateAccountSchema as AccountUpdate,
} from '../schemas';

type IAccountRepository = BaseRepository<Account, AccountCreate, AccountUpdate>;

export type { IAccountRepository, AccountCreate, AccountUpdate };
