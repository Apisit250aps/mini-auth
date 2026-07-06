import { Context, Next } from 'hono';
import { z, ZodType } from 'zod';
import { ApiResponse, AppError, ValidationError } from './error';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { User } from 'better-auth/types';

export type RequestSchema = {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
  responseBody?: ZodType;
};

export type InferVariables<S extends RequestSchema> = {
  body: S['body'] extends ZodType ? z.infer<S['body']> : never;
  query: S['query'] extends ZodType ? z.infer<S['query']> : never;
  params: S['params'] extends ZodType ? z.infer<S['params']> : never;
  user?: User & { id: string };
};

export type InferEnv<S extends RequestSchema> = {
  Variables: InferVariables<S>;
};

export type HonoHandler<S extends RequestSchema> = (
  c: Context<InferEnv<S>>,
  next: Next,
) => Response | Promise<Response>;

export function response<T>(
  c: Context,
  body: ApiResponse<T>,
  httpStatus: ContentfulStatusCode = 200,
) {
  return c.json<ApiResponse<T>>(body, httpStatus);
}

export function validator<S extends RequestSchema>(
  schema: S,
  handler: HonoHandler<S>,
): (c: Context, next: Next) => Promise<Response | void> {
  return async (c: Context, next: Next) => {
    if (schema.body) {
      const body = await c.req.json().catch(() => undefined);
      const result = schema.body.safeParse(body);
      if (!result.success) {
        throw new ValidationError(result.error.message);
      }
      c.set('body', result.data);
    }

    if (schema.query) {
      const result = schema.query.safeParse(c.req.query());
      if (!result.success) {
        throw new ValidationError('Invalid query parameters');
      }
      const queryData = result.data as Record<string, unknown>;
      const page = Number(queryData.page);
      const limit = Number(queryData.limit);
      c.set('query', {
        ...queryData,
        take: limit,
        skip: (page - 1) * limit,
      });
    }

    if (schema.params) {
      const result = schema.params.safeParse(c.req.param());
      if (!result.success) {
        throw new ValidationError('Invalid path parameters');
      }
      c.set('params', result.data);
    }

    return handler(c as Context<InferEnv<S>>, next);
  };
}

export function success<T>(c: Context, message: string, data?: T): Response {
  return c.json<ApiResponse<T>>(
    {
      success: true,
      message,
      data,
    },
    200,
  );
}

// created response with data
export function created<T>(c: Context, message: string, data?: T): Response {
  return c.json<ApiResponse<T>>(
    {
      success: true,
      message,
      data,
    },
    201,
  );
}

// error response
export function error(c: Context, message: string): Response {
  return c.json<ApiResponse<never>>(
    {
      success: false,
      message,
      error: 'INTERNAL_SERVER_ERROR',
    },
    500,
  );
}

// bad request response
export function badRequest(c: Context, message: string): Response {
  return c.json<ApiResponse<never>>(
    {
      success: false,
      message,
      error: 'INVALID_DATA',
    },
    400,
  );
}

// not found response
export function notFound(c: Context, message: string): Response {
  return c.json<ApiResponse<never>>(
    {
      success: false,
      message,
      error: 'NOT_FOUND',
    },
    404,
  );
}

// unauthorized response
export function unauthorized(c: Context, message: string): Response {
  return c.json<ApiResponse<never>>(
    {
      success: false,
      message,
      error: 'UNAUTHORIZED',
    },
    401,
  );
}

// forbidden response
export function forbidden(c: Context, message: string): Response {
  return c.json<ApiResponse<never>>(
    {
      success: false,
      message,
      error: 'FORBIDDEN',
    },
    403,
  );
}

export function onApiError(err: Error, ctx: Context): Response {
  if (err instanceof AppError) {
    return ctx.json(
      {
        success: false,
        message: err.message,
        error: err.message,
        code: err.code,
      },
      err.statusCode as ContentfulStatusCode,
    );
  }
  return ctx.json(
    {
      success: false,
      message: 'Internal Server Error',
      error: 'Internal Server Error',
    },
    500,
  );
}
