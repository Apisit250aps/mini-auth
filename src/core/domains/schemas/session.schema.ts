import {
  BaseEntity,
  DateField,
  StringField,
  UUIDField,
} from '@/lib/repository';
import type z from 'zod';

const sessionSchema = BaseEntity({
  userId: UUIDField(),
  token: StringField(),
  expiresAt: DateField(),
  ipAddress: StringField({ required: false, nullable: true }),
  userAgent: StringField({ required: false, nullable: true }),
});

const createSessionSchema = sessionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

const updateSessionSchema = createSessionSchema.partial();

type BaseSession = z.infer<typeof sessionSchema>;
type CreateSessionSchema = z.infer<typeof createSessionSchema>;
type UpdateSessionSchema = z.infer<typeof updateSessionSchema>;

export { sessionSchema, createSessionSchema, updateSessionSchema };
export type { BaseSession, CreateSessionSchema, UpdateSessionSchema };
