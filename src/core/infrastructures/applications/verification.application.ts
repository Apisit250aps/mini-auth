import {
  CreateContext,
  FilterContext,
  IAllVerificationUseCase,
  ICreateVerificationUseCase,
  IDeleteVerificationUseCase,
  IFindVerificationUseCase,
  IUpdateVerificationUseCase,
  UniqueContext,
  UpdateContext,
} from '@/core/domains/applications/verification';
import { Verification } from '@/core/domains/entities/verification';
import { IVerificationRepository } from '@/core/domains/repositories/verification';
import { createVerificationSchema } from '@/core/domains/schemas';
import {
  NotFoundError,
  throwAppError,
  ValidationError,
} from '@/lib/applications';

class CreateVerificationUseCase implements ICreateVerificationUseCase {
  constructor(private readonly repository: IVerificationRepository) {}

  async execute(input: CreateContext): Promise<Verification> {
    try {
      const parsed = await createVerificationSchema.safeParseAsync(input.data);
      if (!parsed.success) {
        throw new ValidationError(parsed.error.message);
      }
      return await this.repository.create(input.data);
    } catch (error) {
      return throwAppError(error);
    }
  }
}

class UpdateVerificationUseCase implements IUpdateVerificationUseCase {
  constructor(private readonly repository: IVerificationRepository) {}

  async execute(input: UpdateContext): Promise<Verification | null> {
    try {
      const verification = await this.repository.findById(input.id);
      if (!verification) {
        throw new NotFoundError('Verification not found');
      }

      return await this.repository.update(input.id, input.data);
    } catch (error) {
      return throwAppError(error);
    }
  }
}

class DeleteVerificationUseCase implements IDeleteVerificationUseCase {
  constructor(private readonly repository: IVerificationRepository) {}

  async execute(input: UniqueContext): Promise<boolean> {
    try {
      const verification = await this.repository.findById(input.id);
      if (!verification) {
        throw new NotFoundError('Verification not found');
      }

      await this.repository.delete(input.id);
      return true;
    } catch (error) {
      return throwAppError(error);
    }
  }
}

class AllVerificationUseCase implements IAllVerificationUseCase {
  constructor(private readonly repository: IVerificationRepository) {}

  async execute(input: FilterContext): Promise<Verification[]> {
    try {
      return await this.repository.findAll(input.filter);
    } catch (error) {
      return throwAppError(error);
    }
  }
}

class FindVerificationUseCase implements IFindVerificationUseCase {
  constructor(private readonly repository: IVerificationRepository) {}

  async execute(input: UniqueContext): Promise<Verification | null> {
    try {
      const verification = await this.repository.findById(input.id);
      if (!verification) {
        throw new NotFoundError('Verification not found');
      }

      return verification;
    } catch (error) {
      return throwAppError(error);
    }
  }
}

export {
  CreateVerificationUseCase,
  UpdateVerificationUseCase,
  DeleteVerificationUseCase,
  AllVerificationUseCase,
  FindVerificationUseCase,
};
