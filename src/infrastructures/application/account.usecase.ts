import { accountRepository } from '../repositories';

import {
  AllAccountUseCase,
  CreateAccountUseCase,
  DeleteAccountUseCase,
  FindAccountUseCase,
  UpdateAccountUseCase,
} from '@/core/infrastructures/applications';

export const createAccountUseCase = new CreateAccountUseCase(accountRepository);
export const updateAccountUseCase = new UpdateAccountUseCase(accountRepository);
export const deleteAccountUseCase = new DeleteAccountUseCase(accountRepository);
export const allAccountUseCase = new AllAccountUseCase(accountRepository);
export const findAccountUseCase = new FindAccountUseCase(accountRepository);
