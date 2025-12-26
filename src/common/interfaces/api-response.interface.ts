export interface StandardResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface ErrorResponse {
  success: boolean;
  error: {
    statusCode: number;
    message: string | string[];
    path: string;
  };
  timestamp: string;
}
