import { inject }
from '@angular/core';

import {
  CanActivateFn,
  Router,
} from '@angular/router';

import { AuthService }
from '../services/auth';

import { map }
from 'rxjs';

export const adminGuard:
CanActivateFn = () => {

  const authService =
    inject(AuthService);

  const router =
    inject(Router);

  return authService
    .currentUser
    .pipe(

      map((user) => {

        if (
          user?.roles?.includes(
            'ADMIN',
          )
        ) {

          return true;
        }

        router.navigate([
          '/dashboard',
        ]);

        return false;
      }),
    );
};