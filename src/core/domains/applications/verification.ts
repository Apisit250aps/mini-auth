import { BaseUseCase } from '@/lib/applications';
import { Verification } from '../entities/verification';
import {
  VerificationCreate,
  VerificationUpdate,
} from '../repositories/verification';

type UniqueContext = { id: string };
type CreateContext = { data: VerificationCreate };
type UpdateContext = { id: string; data: VerificationUpdate };
type FilterContext = { filter?: Partial<VerificationCreate> };

type ICreateVerificationUseCase = BaseUseCase<CreateContext, Verification>;
type IUpdateVerificationUseCase = BaseUseCase<
  UpdateContext,
  Verification | null
>;
type IDeleteVerificationUseCase = BaseUseCase<UniqueContext, boolean>;
type IAllVerificationUseCase = BaseUseCase<FilterContext, Verification[]>;
type IFindVerificationUseCase = BaseUseCase<UniqueContext, Verification | null>;

export type {
  UniqueContext,
  CreateContext,
  UpdateContext,
  FilterContext,
  //
  ICreateVerificationUseCase,
  IUpdateVerificationUseCase,
  IDeleteVerificationUseCase,
  IAllVerificationUseCase,
  IFindVerificationUseCase,
};
