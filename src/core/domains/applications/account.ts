import { BaseUseCase } from '@/lib/applications';
import { Account } from '../entities/account';
import { AccountCreate, AccountUpdate } from '../repositories/account';

type UniqueContext = { id: string };
type CreateContext = { data: AccountCreate };
type UpdateContext = { id: string; data: AccountUpdate };
type FilterContext = { filter?: Partial<AccountCreate> };

type ICreateAccountUseCase = BaseUseCase<CreateContext, Account>;
type IUpdateAccountUseCase = BaseUseCase<UpdateContext, Account | null>;
type IDeleteAccountUseCase = BaseUseCase<UniqueContext, boolean>;
type IAllAccountUseCase = BaseUseCase<FilterContext, Account[]>;
type IFindAccountUseCase = BaseUseCase<UniqueContext, Account | null>;

export type {
  UniqueContext,
  CreateContext,
  UpdateContext,
  FilterContext,
  //
  ICreateAccountUseCase,
  IUpdateAccountUseCase,
  IDeleteAccountUseCase,
  IAllAccountUseCase,
  IFindAccountUseCase,
};
