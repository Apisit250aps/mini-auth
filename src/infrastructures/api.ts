import { Hono } from 'hono';
import { auth } from '@/lib/auth';
import { handle } from 'hono/vercel';
import routes from '@/infrastructures/http/routes';
import {
  errorHandler,
  notFoundHandler,
} from '@/infrastructures/http/middleware';

const app = new Hono().basePath('/api');

app.onError(errorHandler);
app.notFound(notFoundHandler);

app.on(['POST', 'GET'], '/auth/*', (c) => {
  return auth.handler(c.req.raw);
});

app.route('/', routes);

export default handle(app);
