import {
  CreateContext,
  FilterContext,
  IAllJwkUseCase,
  ICreateJwkUseCase,
  IDeleteJwkUseCase,
  IFindJwkUseCase,
  IUpdateJwkUseCase,
  UniqueContext,
  UpdateContext,
} from '@/core/domains/applications/jwk';
import { Jwk } from '@/core/domains/entities/jwk';
import { IJwkRepository } from '@/core/domains/repositories/jwk';
import { createJwkSchema } from '@/core/domains/schemas';
import {
  NotFoundError,
  throwAppError,
  ValidationError,
} from '@/lib/applications';

class CreateJwkUseCase implements ICreateJwkUseCase {
  constructor(private readonly repository: IJwkRepository) {}

  async execute(input: CreateContext): Promise<Jwk> {
    try {
      const parsed = await createJwkSchema.safeParseAsync(input.data);
      if (!parsed.success) {
        throw new ValidationError(parsed.error.message);
      }
      return await this.repository.create(input.data);
    } catch (error) {
      return throwAppError(error);
    }
  }
}

class UpdateJwkUseCase implements IUpdateJwkUseCase {
  constructor(private readonly repository: IJwkRepository) {}

  async execute(input: UpdateContext): Promise<Jwk | null> {
    try {
      const jwk = await this.repository.findById(input.id);
      if (!jwk) {
        throw new NotFoundError('Jwk not found');
      }

      return await this.repository.update(input.id, input.data);
    } catch (error) {
      return throwAppError(error);
    }
  }
}

class DeleteJwkUseCase implements IDeleteJwkUseCase {
  constructor(private readonly repository: IJwkRepository) {}

  async execute(input: UniqueContext): Promise<boolean> {
    try {
      const jwk = await this.repository.findById(input.id);
      if (!jwk) {
        throw new NotFoundError('Jwk not found');
      }

      await this.repository.delete(input.id);
      return true;
    } catch (error) {
      return throwAppError(error);
    }
  }
}

class AllJwkUseCase implements IAllJwkUseCase {
  constructor(private readonly repository: IJwkRepository) {}

  async execute(input: FilterContext): Promise<Jwk[]> {
    try {
      return await this.repository.findAll(input.filter);
    } catch (error) {
      return throwAppError(error);
    }
  }
}

class FindJwkUseCase implements IFindJwkUseCase {
  constructor(private readonly repository: IJwkRepository) {}

  async execute(input: UniqueContext): Promise<Jwk | null> {
    try {
      const jwk = await this.repository.findById(input.id);
      if (!jwk) {
        throw new NotFoundError('Jwk not found');
      }

      return jwk;
    } catch (error) {
      return throwAppError(error);
    }
  }
}

export {
  CreateJwkUseCase,
  UpdateJwkUseCase,
  DeleteJwkUseCase,
  AllJwkUseCase,
  FindJwkUseCase,
};
