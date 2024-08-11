import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return data;
      }),
      catchError((err) => {
        let response;

        if (err instanceof HttpException) {
          const status = err.getStatus();
          const errorResponse = err.getResponse();

          let errorMessage;

          if (typeof errorResponse === 'string') {
            errorMessage = errorResponse;
          } else if (Array.isArray(errorResponse['message'])) {
            errorMessage = errorResponse['message'][0];
          } else if (typeof errorResponse['message'] === 'string') {
            errorMessage = errorResponse['message'];
          } else {
            errorMessage = 'An unknown error occurred';
          }

          response = {
            status: 'error',
            statusCode: status,
            message: errorMessage,
          };
        } else {
          response = {
            status: 'error',
            statusCode: 500,
            message: 'Internal server error',
          };
        }

        return throwError(() => response);
      }),
    );
  }
}
