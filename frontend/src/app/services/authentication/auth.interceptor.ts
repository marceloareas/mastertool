import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

export function AuthenticationInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
    const authService = inject(AuthenticationService);
    const token = localStorage.getItem('authToken');
    if (token != null) {
      const router = inject(Router)
      console.log(router)
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next(clonedRequest).pipe(
        catchError((error) => {
          if (error.status === 401) {
            authService.logout();
            router.navigate([''])
          }
          return of(error);
        })
      );
    }
    return next(req);
  }
