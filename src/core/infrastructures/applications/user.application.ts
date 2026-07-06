import {
  CreateContext,
  FilterContext,
  IAllUserUseCase,
  ICreateUserUseCase,
  IDeleteUserUseCase,
  IFindUserUseCase,
  IUpdateUserUseCase,
  UniqueContext,
  UpdateContext,
} from '@/core/domains/applications/user';
import { User } from '@/core/domains/entities/user';
import { IUserRepository } from '@/core/domains/repositories/user';
import { createUserSchema } from '@/core/domains/schemas';
import {
  NotFoundError,
  throwAppError,
  ValidationError,
} from '@/lib/applications';

class CreateUserUseCase implements ICreateUserUseCase {
  constructor(private readonly repository: IUserRepository) {}

  async execute(input: CreateContext): Promise<User> {
    try {
      const parsed = await createUserSchema.safeParseAsync(input.data);
      if (!parsed.success) {
        throw new ValidationError(parsed.error.message);
      }
      return await this.repository.create(input.data);
    } catch (error) {
      return throwAppError(error);
    }
  }
}

class UpdateUserUseCase implements IUpdateUserUseCase {
  constructor(private readonly repository: IUserRepository) {}

  async execute(input: UpdateContext): Promise<User | null> {
    try {
      const user = await this.repository.findById(input.id);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      return await this.repository.update(input.id, input.data);
    } catch (error) {
      return throwAppError(error);
    }
  }
}

class DeleteUserUseCase implements IDeleteUserUseCase {
  constructor(private readonly repository: IUserRepository) {}

  async execute(input: UniqueContext): Promise<boolean> {
    try {
      const user = await this.repository.findById(input.id);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      await this.repository.delete(input.id);
      return true;
    } catch (error) {
      return throwAppError(error);
    }
  }
}

class AllUserUseCase implements IAllUserUseCase {
  constructor(private readonly repository: IUserRepository) {}

  async execute(input: FilterContext): Promise<User[]> {
    try {
      return await this.repository.findAll(input.filter);
    } catch (error) {
      return throwAppError(error);
    }
  }
}

class FindUserUseCase implements IFindUserUseCase {
  constructor(private readonly repository: IUserRepository) {}

  async execute(input: UniqueContext): Promise<User> {
    try {
      const user = await this.repository.findById(input.id);
      if (!user) {
        throw new NotFoundError('User not found');
      }
      return user;
    } catch (error) {
      return throwAppError(error);
    }
  }
}

export {
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  AllUserUseCase,
  FindUserUseCase,
};
