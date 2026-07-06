import {
  allUserUseCase,
  createUserUseCase,
  deleteUserUseCase,
  findUserUseCase,
  updateUserUseCase,
} from '@/infrastructures/application';
import Controller from '@/lib/applications/controller';
import { createUserSchema, updateUserSchema } from '@/core/domains/schemas';
import { omit } from 'lodash';
import z from 'zod';

class UserController extends Controller {
  listUsers() {
    return this.validator(
      {
        query: z.record(z.string(), z.unknown()).optional(),
      },
      async (c) => {
        const query = (c.get('query') || {}) as Record<string, unknown>;
        const filter = omit(query, ['take', 'skip', 'page', 'limit']);
        const users = await allUserUseCase.execute({ filter });
        return this.success(c, 'Users retrieved successfully', users);
      },
    );
  }

  findUser() {
    return this.validator(
      {
        params: z.object({
          id: z.string().uuid(),
        }),
      },
      async (c) => {
        const { id } = c.get('params');
        const user = await findUserUseCase.execute({ id });
        return this.success(c, 'User retrieved successfully', user);
      },
    );
  }

  createUser() {
    return this.validator(
      {
        body: createUserSchema,
      },
      async (c) => {
        const body = c.get('body');
        const user = await createUserUseCase.execute({ data: body });
        return this.created(c, 'User created successfully', user);
      },
    );
  }

  updateUser() {
    return this.validator(
      {
        params: z.object({
          id: z.string().uuid(),
        }),
        body: updateUserSchema,
      },
      async (c) => {
        const { id } = c.get('params');
        const body = c.get('body');
        const updatedUser = await updateUserUseCase.execute({
          id,
          data: body,
        });
        return this.success(c, 'User updated successfully', updatedUser);
      },
    );
  }

  deleteUser() {
    return this.validator(
      {
        params: z.object({
          id: z.string().uuid(),
        }),
      },
      async (c) => {
        const { id } = c.get('params');
        await deleteUserUseCase.execute({ id });
        return this.success(c, 'User deleted successfully');
      },
    );
  }
}

export default UserController;
