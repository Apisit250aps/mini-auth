import {
  CreateContext,
  FilterContext,
  IAllSessionUseCase,
  ICreateSessionUseCase,
  IDeleteSessionUseCase,
  IFindSessionUseCase,
  IUpdateSessionUseCase,
  UniqueContext,
  UpdateContext,
} from '@/core/domains/applications/session';
import { Session } from '@/core/domains/entities/session';
import { ISessionRepository } from '@/core/domains/repositories/session';
import { createSessionSchema } from '@/core/domains/schemas';
import {
  NotFoundError,
  throwAppError,
  ValidationError,
} from '@/lib/applications';

class CreateSessionUseCase implements ICreateSessionUseCase {
  constructor(private readonly repository: ISessionRepository) {}

  async execute(input: CreateContext): Promise<Session> {
    try {
      const parsed = await createSessionSchema.safeParseAsync(input.data);
      if (!parsed.success) {
        throw new ValidationError(parsed.error.message);
      }
      return await this.repository.create(input.data);
    } catch (error) {
      return throwAppError(error);
    }
  }
}

class DeleteSessionUseCase implements IDeleteSessionUseCase {
  constructor(private readonly repository: ISessionRepository) {}

  async execute(input: UniqueContext): Promise<boolean> {
    try {
      const session = await this.repository.findById(input.id);
      if (!session) {
        throw new NotFoundError('Session not found');
      }

      await this.repository.delete(input.id);
      return true;
    } catch (error) {
      return throwAppError(error);
    }
  }
}

class UpdateSessionUseCase implements IUpdateSessionUseCase {
  constructor(private readonly repository: ISessionRepository) {}

  async execute(input: UpdateContext): Promise<Session | null> {
    try {
      const session = await this.repository.findById(input.id);
      if (!session) {
        throw new NotFoundError('Session not found');
      }

      return await this.repository.update(input.id, input.data);
    } catch (error) {
      return throwAppError(error);
    }
  }
}

class AllSessionUseCase implements IAllSessionUseCase {
  constructor(private readonly repository: ISessionRepository) {}

  async execute(input: FilterContext): Promise<Session[]> {
    try {
      return await this.repository.findAll(input.filter);
    } catch (error) {
      return throwAppError(error);
    }
  }
}

class FindSessionUseCase implements IFindSessionUseCase {
  constructor(private readonly repository: ISessionRepository) {}

  async execute(input: UniqueContext): Promise<Session | null> {
    try {
      const session = await this.repository.findById(input.id);
      if (!session) {
        throw new NotFoundError('Session not found');
      }

      return session;
    } catch (error) {
      return throwAppError(error);
    }
  }
}

export {
  CreateSessionUseCase,
  UpdateSessionUseCase,
  DeleteSessionUseCase,
  AllSessionUseCase,
  FindSessionUseCase,
};
