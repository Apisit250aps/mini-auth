import { BaseUseCase } from '@/lib/applications';
import { User } from '../entities/user';
import { UserCreate, UserUpdate } from '../repositories/user';

type UniqueContext = { id: string };
type CreateContext = { data: UserCreate };
type UpdateContext = { id: string; data: UserUpdate };
type FilterContext = { filter?: Partial<UserCreate> };

type ICreateUserUseCase = BaseUseCase<CreateContext, User>;
type IUpdateUserUseCase = BaseUseCase<UpdateContext, User | null>;
type IDeleteUserUseCase = BaseUseCase<UniqueContext, boolean>;
type IAllUserUseCase = BaseUseCase<FilterContext, User[]>;
type IFindUserUseCase = BaseUseCase<UniqueContext, User>;

export type {
  UniqueContext,
  CreateContext,
  UpdateContext,
  FilterContext,
  //
  ICreateUserUseCase,
  IUpdateUserUseCase,
  IDeleteUserUseCase,
  IAllUserUseCase,
  IFindUserUseCase,
};
