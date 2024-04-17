import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication/authentication.service';

export const authGuard: CanActivateFn = (route, state) => {
  const _auth = inject(AuthenticationService);
  const router = inject(Router);

  if(_auth.isLogged()){
    return true;
  }else{
    router.navigate(['']);
    return false;
  }
};
