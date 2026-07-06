import { verificationRepository } from '../repositories';

import {
  AllVerificationUseCase,
  CreateVerificationUseCase,
  DeleteVerificationUseCase,
  FindVerificationUseCase,
  UpdateVerificationUseCase,
} from '@/core/infrastructures/applications';

export const createVerificationUseCase = new CreateVerificationUseCase(
  verificationRepository,
);
export const updateVerificationUseCase = new UpdateVerificationUseCase(
  verificationRepository,
);
export const deleteVerificationUseCase = new DeleteVerificationUseCase(
  verificationRepository,
);
export const allVerificationUseCase = new AllVerificationUseCase(
  verificationRepository,
);
export const findVerificationUseCase = new FindVerificationUseCase(
  verificationRepository,
);
