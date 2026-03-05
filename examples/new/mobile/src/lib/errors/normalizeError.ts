export type AppError = {
  code: 'NETWORK_ERROR' | 'VALIDATION_ERROR' | 'UNKNOWN_ERROR';
  message: string;
  cause?: unknown;
};

export class AppTypedError extends Error {
  code: AppError['code'];

  constructor(code: AppError['code'], message: string, options?: ErrorOptions) {
    super(message, options);
    this.code = code;
    this.name = 'AppTypedError';
  }
}

type ErrorLike = {
  message?: string;
  code?: string;
};

const isErrorLike = (value: unknown): value is ErrorLike => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as ErrorLike;
  return typeof candidate.message === 'string' || typeof candidate.code === 'string';
};

const getMessage = (value: unknown) => {
  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Error) {
    return value.message;
  }

  if (isErrorLike(value) && value.message) {
    return value.message;
  }

  return null;
};

const classifyCode = (value: unknown): AppError['code'] => {
  if (!isErrorLike(value)) {
    return 'UNKNOWN_ERROR';
  }

  const code = (value.code ?? '').toUpperCase();
  const message = (value.message ?? '').toLowerCase();

  if (code.includes('NETWORK') || message.includes('network') || message.includes('timeout')) {
    return 'NETWORK_ERROR';
  }

  if (code.includes('VALIDATION') || message.includes('invalid') || message.includes('validation')) {
    return 'VALIDATION_ERROR';
  }

  return 'UNKNOWN_ERROR';
};

export function normalizeError(error: unknown): AppError {
  const code = classifyCode(error);
  const message = getMessage(error);

  if (message) {
    return {
      code,
      message,
      cause: error,
    };
  }

  if (code === 'NETWORK_ERROR') {
    return {
      code,
      message: 'common.errors.network',
      cause: error,
    };
  }

  return {
    code,
    message: 'common.errors.unknown',
    cause: error,
  };
}
