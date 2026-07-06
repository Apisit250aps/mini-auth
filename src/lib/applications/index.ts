export * from './adapter';
export * from './error';

type BaseUseCase<Context, Output> = {
  execute(input: Context): Promise<Output>;
};

export type { BaseUseCase };
