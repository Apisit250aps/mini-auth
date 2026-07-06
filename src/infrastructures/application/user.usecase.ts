import { userRepository } from '../repositories';

import {
  AllUserUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  FindUserUseCase,
  UpdateUserUseCase,
} from '@/core/infrastructures/applications';

export const createUserUseCase = new CreateUserUseCase(userRepository);
export const updateUserUseCase = new UpdateUserUseCase(userRepository);
export const deleteUserUseCase = new DeleteUserUseCase(userRepository);
export const allUserUseCase = new AllUserUseCase(userRepository);
export const findUserUseCase = new FindUserUseCase(userRepository);
