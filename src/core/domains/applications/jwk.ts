import { BaseUseCase } from '@/lib/applications';
import { Jwk } from '../entities/jwk';
import { JwkCreate, JwkUpdate } from '../repositories/jwk';

type UniqueContext = { id: string };
type CreateContext = { data: JwkCreate };
type UpdateContext = { id: string; data: JwkUpdate };
type FilterContext = { filter?: Partial<JwkCreate> };

type ICreateJwkUseCase = BaseUseCase<CreateContext, Jwk>;
type IUpdateJwkUseCase = BaseUseCase<UpdateContext, Jwk | null>;
type IDeleteJwkUseCase = BaseUseCase<UniqueContext, boolean>;
type IAllJwkUseCase = BaseUseCase<FilterContext, Jwk[]>;
type IFindJwkUseCase = BaseUseCase<UniqueContext, Jwk | null>;

export type {
  UniqueContext,
  CreateContext,
  UpdateContext,
  FilterContext,
  //
  ICreateJwkUseCase,
  IUpdateJwkUseCase,
  IDeleteJwkUseCase,
  IAllJwkUseCase,
  IFindJwkUseCase,
};
