import {
  allAccountUseCase,
  createAccountUseCase,
  deleteAccountUseCase,
  findAccountUseCase,
  updateAccountUseCase,
} from '@/infrastructures/application';
import Controller from '@/lib/applications/controller';
import {
  createAccountSchema,
  updateAccountSchema,
} from '@/core/domains/schemas';
import { omit } from 'lodash';
import z from 'zod';

class AccountController extends Controller {
  listAccounts() {
    return this.validator(
      {
        query: z.record(z.string(), z.unknown()).optional(),
      },
      async (c) => {
        const query = (c.get('query') || {}) as Record<string, unknown>;
        const filter = omit(query, ['take', 'skip', 'page', 'limit']);
        const accounts = await allAccountUseCase.execute({ filter });
        return this.success(c, 'Accounts retrieved successfully', accounts);
      },
    );
  }

  findAccount() {
    return this.validator(
      {
        params: z.object({
          id: z.string().uuid(),
        }),
      },
      async (c) => {
        const { id } = c.get('params');
        const account = await findAccountUseCase.execute({ id });
        return this.success(c, 'Account retrieved successfully', account);
      },
    );
  }

  createAccount() {
    return this.validator(
      {
        body: createAccountSchema,
      },
      async (c) => {
        const body = c.get('body');
        const account = await createAccountUseCase.execute({ data: body });
        return this.created(c, 'Account created successfully', account);
      },
    );
  }

  updateAccount() {
    return this.validator(
      {
        params: z.object({
          id: z.string().uuid(),
        }),
        body: updateAccountSchema,
      },
      async (c) => {
        const { id } = c.get('params');
        const body = c.get('body');
        const updatedAccount = await updateAccountUseCase.execute({
          id,
          data: body,
        });
        return this.success(c, 'Account updated successfully', updatedAccount);
      },
    );
  }

  deleteAccount() {
    return this.validator(
      {
        params: z.object({
          id: z.string().uuid(),
        }),
      },
      async (c) => {
        const { id } = c.get('params');
        await deleteAccountUseCase.execute({ id });
        return this.success(c, 'Account deleted successfully');
      },
    );
  }
}

export default AccountController;
