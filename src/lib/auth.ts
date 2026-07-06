import { betterAuth } from 'better-auth';
import { bearer, jwt, oneTap } from 'better-auth/plugins';
import client, { db } from '@/lib/client';
import { adapter } from './applications';

export const auth = betterAuth({
  database: adapter(db, {
    client,
  }),
  user: {
    additionalFields: {
      isActive: {
        type: 'boolean',
        defaultValue: true,
      },
      isAdmin: {
        type: 'boolean',
        defaultValue: false,
      },
      isSuperAdmin: {
        type: 'boolean',
        defaultValue: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    bearer(),
    jwt({
      jwt: {
        definePayload: (session) => {
          const u = session.user as Record<string, unknown>;
          return {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
            emailVerified: session.user.emailVerified,
            isActive: Boolean(u.isActive ?? true),
            isAdmin: Boolean(u.isAdmin ?? false),
            isSuperAdmin: Boolean(u.isSuperAdmin ?? false),
          };
        },
      },
    }),
    oneTap(),
  ],
});
