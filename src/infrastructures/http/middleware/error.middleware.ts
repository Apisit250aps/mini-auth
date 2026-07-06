import { Context, ErrorHandler, NotFoundHandler } from 'hono';
import { notFound, onApiError } from '@/lib/applications/response';

export const errorHandler: ErrorHandler = (err: Error, c: Context) => {
  return onApiError(err, c);
};

export const notFoundHandler: NotFoundHandler = (c: Context) => {
  return notFound(c, 'Route not found');
};
