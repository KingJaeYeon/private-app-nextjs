import { InternalAxiosRequestConfig } from 'axios';

export interface ServerErrorResponse {
  success: false;
  statusCode: number;
  code: string;
  message: string;
  timestamp: string;
  path: string;
  details?: unknown;
}

export type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export interface SuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}
