import {
  BaseEntity,
  DateField,
  StringField,
  UUIDField,
} from '@/lib/repository';
import type z from 'zod';

const accountSchema = BaseEntity({
  userId: UUIDField(),
  accountId: StringField(),
  providerId: StringField(),
  accessToken: StringField({ required: false, nullable: true, max: 2048 }),
  refreshToken: StringField({ required: false, nullable: true, max: 2048 }),
  accessTokenExpiresAt: DateField({ required: false, nullable: true }),
  refreshTokenExpiresAt: DateField({ required: false, nullable: true }),
  scope: StringField({ required: false, nullable: true }),
  idToken: StringField({ required: false, nullable: true, max: 2048 }),
  password: StringField({ required: false, nullable: true, max: 2048 }),
});

const createAccountSchema = accountSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

const updateAccountSchema = createAccountSchema.partial();

type BaseAccount = z.infer<typeof accountSchema>;
type CreateAccountSchema = z.infer<typeof createAccountSchema>;
type UpdateAccountSchema = z.infer<typeof updateAccountSchema>;

export { accountSchema, createAccountSchema, updateAccountSchema };
export type { BaseAccount, CreateAccountSchema, UpdateAccountSchema };
