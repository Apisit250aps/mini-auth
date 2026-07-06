import { auth } from '@/lib/auth';
import { unauthorized } from '@/lib/applications/response';
import { createMiddleware } from 'hono/factory';

export const authMiddleware = createMiddleware(async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (session?.user) {
    c.set('user', session.user as never);
    return await next();
  }

  const authHeader =
    c.req.header('Authorization') || c.req.header('authorization');
  if (authHeader?.toLowerCase().startsWith('bearer ')) {
    const token = authHeader.slice(7).trim();
    const jwtRes = await auth.api.verifyJWT({ body: { token } });
    if (jwtRes?.payload?.sub) {
      c.set('user', { id: jwtRes.payload.sub, ...jwtRes.payload } as never);
      return await next();
    }
  }

  return unauthorized(c, 'Unauthorized');
});
