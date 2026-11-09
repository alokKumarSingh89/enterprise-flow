export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export interface ApiError {
  readonly code: ApiErrorCode;
  readonly message: string;
  readonly requestId?: string;
}

export type ApiSuccess<T> = {
  readonly success: true;
  readonly data: T;
  readonly error?: never;
};

export type ApiFailure = {
  readonly success: false;
  readonly error: ApiError;
  readonly data?: never;
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export function success<T>(data: T): ApiSuccess<T> {
  return {
    success: true,
    data,
  };
}

export function failure(code: ApiErrorCode, message: string): ApiFailure {
  return {
    success: false,
    error: {
      code,
      message,
    },
  };
}

export function unwrap<T>(result: ApiResult<T>): T {
  if (!result.success) {
    throw new Error(result.error.message);
  }

  return result.data;
}
