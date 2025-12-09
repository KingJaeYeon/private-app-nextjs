import { InternalAxiosRequestConfig } from 'axios';

export interface ServerErrorResponse {
  success: false;
  statusCode: number;
  code: string;
  message: string;
  timestamp: string;
  path: string;
  details?: any;
}

export type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};
