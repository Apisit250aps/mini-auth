import {
  allVerificationUseCase,
  createVerificationUseCase,
  deleteVerificationUseCase,
  findVerificationUseCase,
  updateVerificationUseCase,
} from '@/infrastructures/application';
import Controller from '@/lib/applications/controller';
import {
  createVerificationSchema,
  updateVerificationSchema,
} from '@/core/domains/schemas';
import { omit } from 'lodash';
import z from 'zod';

class VerificationController extends Controller {
  listVerifications() {
    return this.validator(
      {
        query: z.record(z.string(), z.unknown()).optional(),
      },
      async (c) => {
        const query = (c.get('query') || {}) as Record<string, unknown>;
        const filter = omit(query, ['take', 'skip', 'page', 'limit']);
        const verifications = await allVerificationUseCase.execute({ filter });
        return this.success(
          c,
          'Verifications retrieved successfully',
          verifications,
        );
      },
    );
  }

  findVerification() {
    return this.validator(
      {
        params: z.object({
          id: z.string().uuid(),
        }),
      },
      async (c) => {
        const { id } = c.get('params');
        const verification = await findVerificationUseCase.execute({ id });
        return this.success(
          c,
          'Verification retrieved successfully',
          verification,
        );
      },
    );
  }

  createVerification() {
    return this.validator(
      {
        body: createVerificationSchema,
      },
      async (c) => {
        const body = c.get('body');
        const verification = await createVerificationUseCase.execute({
          data: body,
        });
        return this.created(
          c,
          'Verification created successfully',
          verification,
        );
      },
    );
  }

  updateVerification() {
    return this.validator(
      {
        params: z.object({
          id: z.string().uuid(),
        }),
        body: updateVerificationSchema,
      },
      async (c) => {
        const { id } = c.get('params');
        const body = c.get('body');
        const updatedVerification = await updateVerificationUseCase.execute({
          id,
          data: body,
        });
        return this.success(
          c,
          'Verification updated successfully',
          updatedVerification,
        );
      },
    );
  }

  deleteVerification() {
    return this.validator(
      {
        params: z.object({
          id: z.string().uuid(),
        }),
      },
      async (c) => {
        const { id } = c.get('params');
        await deleteVerificationUseCase.execute({ id });
        return this.success(c, 'Verification deleted successfully');
      },
    );
  }
}

export default VerificationController;
