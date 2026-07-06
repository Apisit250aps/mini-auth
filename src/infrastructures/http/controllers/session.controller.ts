import {
  allSessionUseCase,
  createSessionUseCase,
  deleteSessionUseCase,
  findSessionUseCase,
  updateSessionUseCase,
} from '@/infrastructures/application';
import Controller from '@/lib/applications/controller';
import {
  createSessionSchema,
  updateSessionSchema,
} from '@/core/domains/schemas';
import { omit } from 'lodash';
import z from 'zod';

class SessionController extends Controller {
  listSessions() {
    return this.validator(
      {
        query: z.record(z.string(), z.unknown()).optional(),
      },
      async (c) => {
        const query = (c.get('query') || {}) as Record<string, unknown>;
        const filter = omit(query, ['take', 'skip', 'page', 'limit']);
        const sessions = await allSessionUseCase.execute({ filter });
        return this.success(c, 'Sessions retrieved successfully', sessions);
      },
    );
  }

  findSession() {
    return this.validator(
      {
        params: z.object({
          id: z.string().uuid(),
        }),
      },
      async (c) => {
        const { id } = c.get('params');
        const session = await findSessionUseCase.execute({ id });
        return this.success(c, 'Session retrieved successfully', session);
      },
    );
  }

  createSession() {
    return this.validator(
      {
        body: createSessionSchema,
      },
      async (c) => {
        const body = c.get('body');
        const session = await createSessionUseCase.execute({ data: body });
        return this.created(c, 'Session created successfully', session);
      },
    );
  }

  updateSession() {
    return this.validator(
      {
        params: z.object({
          id: z.string().uuid(),
        }),
        body: updateSessionSchema,
      },
      async (c) => {
        const { id } = c.get('params');
        const body = c.get('body');
        const updatedSession = await updateSessionUseCase.execute({
          id,
          data: body,
        });
        return this.success(c, 'Session updated successfully', updatedSession);
      },
    );
  }

  deleteSession() {
    return this.validator(
      {
        params: z.object({
          id: z.string().uuid(),
        }),
      },
      async (c) => {
        const { id } = c.get('params');
        await deleteSessionUseCase.execute({ id });
        return this.success(c, 'Session deleted successfully');
      },
    );
  }
}

export default SessionController;
