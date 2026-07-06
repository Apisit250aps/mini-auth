import type { BaseRepository } from '@/lib/repository';
import type { Verification } from '../entities/verification';
import type {
  CreateVerificationSchema as VerificationCreate,
  UpdateVerificationSchema as VerificationUpdate,
} from '../schemas';

type IVerificationRepository = BaseRepository<
  Verification,
  VerificationCreate,
  VerificationUpdate
>;

export type { IVerificationRepository, VerificationCreate, VerificationUpdate };
