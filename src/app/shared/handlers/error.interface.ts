import { ErrorTypeEnum } from './error-type.enum';

export interface IError {
  error: any;
  statusCode: number;
  message: string;
}
