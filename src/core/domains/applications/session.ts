import { BaseUseCase } from '@/lib/applications';
import { Session } from '../entities/session';
import { SessionCreate, SessionUpdate } from '../repositories/session';

type UniqueContext = { id: string };
type CreateContext = { data: SessionCreate };
type UpdateContext = { id: string; data: SessionUpdate };
type FilterContext = { filter?: Partial<SessionCreate> };

type ICreateSessionUseCase = BaseUseCase<CreateContext, Session>;
type IUpdateSessionUseCase = BaseUseCase<UpdateContext, Session | null>;
type IDeleteSessionUseCase = BaseUseCase<UniqueContext, boolean>;
type IAllSessionUseCase = BaseUseCase<FilterContext, Session[]>;
type IFindSessionUseCase = BaseUseCase<UniqueContext, Session | null>;

export type {
  UniqueContext,
  CreateContext,
  UpdateContext,
  FilterContext,
  //
  ICreateSessionUseCase,
  IUpdateSessionUseCase,
  IDeleteSessionUseCase,
  IAllSessionUseCase,
  IFindSessionUseCase,
};
