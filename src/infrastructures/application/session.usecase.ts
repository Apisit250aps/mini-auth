import { sessionRepository } from '../repositories';

import {
  AllSessionUseCase,
  CreateSessionUseCase,
  DeleteSessionUseCase,
  FindSessionUseCase,
  UpdateSessionUseCase,
} from '@/core/infrastructures/applications';

export const createSessionUseCase = new CreateSessionUseCase(sessionRepository);
export const updateSessionUseCase = new UpdateSessionUseCase(sessionRepository);
export const deleteSessionUseCase = new DeleteSessionUseCase(sessionRepository);
export const allSessionUseCase = new AllSessionUseCase(sessionRepository);
export const findSessionUseCase = new FindSessionUseCase(sessionRepository);
