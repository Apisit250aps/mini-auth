import client from '@/lib/client';

import UserRepository from '@/core/infrastructures/repositories/user.repo';
import AccountRepository from '@/core/infrastructures/repositories/account.repo';
import SessionRepository from '@/core/infrastructures/repositories/session.repo';
import VerificationRepository from '@/core/infrastructures/repositories/verification.repo';

export const userRepository = new UserRepository(client);
export const accountRepository = new AccountRepository(client);
export const sessionRepository = new SessionRepository(client);
export const verificationRepository = new VerificationRepository(client);
