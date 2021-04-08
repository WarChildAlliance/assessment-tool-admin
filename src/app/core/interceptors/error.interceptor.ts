import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private alertService: AlertService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(
        (err: any) => {
          const message = this.formatError(err);
          this.alertService.error(message);
          return throwError(err);
        }
      )
    );
  }

  private formatError(err: any): string {
    if (typeof err === 'string') {
      return err;
    }
    if (err.error) {
      if (typeof err.error === 'string') {
        return err.error;
      }
      if (err.error.non_field_errors && Array.isArray(err.error.non_field_errors)) {
        return err.error.non_field_errors[0];
      }
    }
    return 'An error occured';
  }
}
