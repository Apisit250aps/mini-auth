import { BaseEntity, DateField, StringField } from '@/lib/repository';
import type z from 'zod';

const verificationSchema = BaseEntity({
  identifier: StringField(),
  value: StringField({ max: 1024 }),
  expiresAt: DateField(),
});

const createVerificationSchema = verificationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

const updateVerificationSchema = createVerificationSchema.partial();

type BaseVerification = z.infer<typeof verificationSchema>;
type CreateVerificationSchema = z.infer<typeof createVerificationSchema>;
type UpdateVerificationSchema = z.infer<typeof updateVerificationSchema>;

export {
  verificationSchema,
  createVerificationSchema,
  updateVerificationSchema,
};
export type {
  BaseVerification,
  CreateVerificationSchema,
  UpdateVerificationSchema,
};
