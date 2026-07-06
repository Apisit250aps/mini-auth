import {
  CreateContext,
  FilterContext,
  IAllAccountUseCase,
  ICreateAccountUseCase,
  IDeleteAccountUseCase,
  IFindAccountUseCase,
  IUpdateAccountUseCase,
  UniqueContext,
  UpdateContext,
} from '@/core/domains/applications/account';
import { Account } from '@/core/domains/entities/account';
import { IAccountRepository } from '@/core/domains/repositories/account';
import { createAccountSchema } from '@/core/domains/schemas';
import {
  NotFoundError,
  throwAppError,
  ValidationError,
} from '@/lib/applications';

class CreateAccountUseCase implements ICreateAccountUseCase {
  constructor(private readonly repository: IAccountRepository) {}

  async execute(input: CreateContext): Promise<Account> {
    try {
      const parsed = await createAccountSchema.safeParseAsync(input.data);
      if (!parsed.success) {
        throw new ValidationError(parsed.error.message);
      }
      const account = await this.repository.create(input.data);
      return account;
    } catch (error) {
      return throwAppError(error);
    }
  }
}

class UpdateAccountUseCase implements IUpdateAccountUseCase {
  constructor(private readonly repository: IAccountRepository) {}

  async execute(input: UpdateContext): Promise<Account | null> {
    try {
      const account = await this.repository.findById(input.id);
      if (!account) {
        throw new NotFoundError('Account not found');
      }

      return await this.repository.update(input.id, input.data);
    } catch (error) {
      return throwAppError(error);
    }
  }
}

class DeleteAccountUseCase implements IDeleteAccountUseCase {
  constructor(private readonly repository: IAccountRepository) {}

  async execute(input: UniqueContext): Promise<boolean> {
    try {
      const account = await this.repository.findById(input.id);
      if (!account) {
        throw new NotFoundError('Account not found');
      }

      await this.repository.delete(input.id);
      return true;
    } catch (error) {
      return throwAppError(error);
    }
  }
}

class AllAccountUseCase implements IAllAccountUseCase {
  constructor(private readonly repository: IAccountRepository) {}

  async execute(input: FilterContext): Promise<Account[]> {
    try {
      return await this.repository.findAll(input.filter);
    } catch (error) {
      return throwAppError(error);
    }
  }
}

class FindAccountUseCase implements IFindAccountUseCase {
  constructor(private readonly repository: IAccountRepository) {}

  async execute(input: UniqueContext): Promise<Account | null> {
    try {
      const account = await this.repository.findById(input.id);
      if (!account) {
        throw new NotFoundError('Account not found');
      }
      return account;
    } catch (error) {
      return throwAppError(error);
    }
  }
}

export {
  CreateAccountUseCase,
  UpdateAccountUseCase,
  DeleteAccountUseCase,
  AllAccountUseCase,
  FindAccountUseCase,
};
