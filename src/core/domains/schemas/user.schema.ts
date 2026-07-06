import {
  BaseEntity,
  BooleanField,
  DateField,
  EmailField,
  StringField,
} from '@/lib/repository';
import type z from 'zod';

const userSchema = BaseEntity({
  name: StringField(),
  email: EmailField(),
  emailVerified: BooleanField({ required: false, nullable: true }),
  image: StringField({ required: false, nullable: true }),
  firstName: StringField({ required: false, nullable: true }),
  lastName: StringField({ required: false, nullable: true }),
  nickname: StringField({ required: false, nullable: true }),
  birthday: StringField({ required: false, nullable: true }),
  lastLoginAt: DateField({ required: false, nullable: true }),
  isActive: BooleanField({ default: () => true, nullable: false }),
  isAdmin: BooleanField({ default: () => false, nullable: false }),
  isSuperAdmin: BooleanField({ default: () => false, nullable: false }),
});

const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

const updateUserSchema = createUserSchema.partial();

type BaseUser = z.infer<typeof userSchema>;
type CreateUserSchema = z.infer<typeof createUserSchema>;
type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export { userSchema, createUserSchema, updateUserSchema };
export type { BaseUser, CreateUserSchema, UpdateUserSchema };
