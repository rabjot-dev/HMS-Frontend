import {
  inject,
} from '@angular/core';

import {
  CanActivateFn,
  Router,
} from '@angular/router';

import { NodeService } from '../services/node';

export const nodeGuard:
  CanActivateFn =
  (route) => {
    const router =
      inject(Router);

    const nodeService =
      inject(
        NodeService,
      );

    const url =
      '/' +
      route.url
        .map(
          (
            segment,
          ) =>
            segment.path,
        )
        .join('/');

    const nodes =
      nodeService.nodes
        .value.length
        ? nodeService.nodes
            .value
        : JSON.parse(
            localStorage.getItem(
              'nodes',
            ) || '[]',
          );

    // first load
    if (
      !nodes.length
    ) {
      return true;
    }

    const allowed =
      nodes.some(
        (
          node: any,
        ) =>
          node.path ===
          url,
      );

    if (allowed) {
      return true;
    }

    router.navigate([
      '/',
    ]);

    return false;
  };