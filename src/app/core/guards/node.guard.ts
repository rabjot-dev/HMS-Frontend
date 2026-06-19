import {
  inject,
} from '@angular/core';

import {
  CanActivateFn,
  Router,
} from '@angular/router';

import {
  AuthService,
} from '../services/auth';

export const nodeGuard:
  CanActivateFn =
  (route) => {
    const authService =
      inject(
        AuthService
      );

    const router =
      inject(
        Router
      );

    const nodes =
      authService
        .nodes
        .value;

    const path =
      '/' +
      route.routeConfig?.path;

    const hasAccess =
      nodes.some((node) =>
        path.startsWith(
          node.path
        )
      );

    if (
      hasAccess
    ) {
      return true;
    }

    router.navigate([
      '/login',
    ]);

    return false;
  };