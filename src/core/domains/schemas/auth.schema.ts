import { EmailField, StringField } from '@/lib/repository';
import z from 'zod';

const loginSchema = z.object({
  email: EmailField(),
  password: StringField(),
});

const signupSchema = z
  .object({
    name: StringField(),
    email: EmailField(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(255)
      .trim(),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password')
      .max(255)
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type BaseLogin = z.infer<typeof loginSchema>;
type BaseSignup = z.infer<typeof signupSchema>;

export { loginSchema, signupSchema };
export type { BaseLogin, BaseSignup };
