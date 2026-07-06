import { BaseEntity, DateField, StringField } from '@/lib/repository';
import type z from 'zod';

const jwkSchema = BaseEntity({
  publicKey: StringField({ max: 16384 }),
  privateKey: StringField({ max: 16384 }),
  expiresAt: DateField({ required: false, nullable: true }),
  alg: StringField({ required: false, nullable: true }),
  crv: StringField({ required: false, nullable: true }),
});

const createJwkSchema = jwkSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

const updateJwkSchema = createJwkSchema.partial();

type BaseJwk = z.infer<typeof jwkSchema>;
type CreateJwkSchema = z.infer<typeof createJwkSchema>;
type UpdateJwkSchema = z.infer<typeof updateJwkSchema>;

export { jwkSchema, createJwkSchema, updateJwkSchema };
export type { BaseJwk, CreateJwkSchema, UpdateJwkSchema };
