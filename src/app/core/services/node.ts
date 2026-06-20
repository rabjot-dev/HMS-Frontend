import {
  Injectable,
} from '@angular/core';

import {
  HttpClient,
} from '@angular/common/http';

import {
  BehaviorSubject,
} from 'rxjs';

import { API_BASE_URL } from '../constants/api.constants';

@Injectable({
  providedIn:
    'root',
})
export class NodeService {
  nodes =
    new BehaviorSubject<
      any[]
    >([]);

  constructor(
    private readonly http: HttpClient,
  ) {
    const storedNodes =
      localStorage.getItem(
        'nodes',
      );

    if (
      storedNodes
    ) {
      this.nodes.next(
        JSON.parse(
          storedNodes,
        ),
      );
    }
  }

  getNodes() {
    return this.http.get<any>(
      `${API_BASE_URL}/nodes`,
    );
  }

  loadNodes(): void {
    this.getNodes()
      .subscribe({
        next: (
          response,
        ) => {
          this.nodes.next(
            response.data,
          );
          console.log(
        JSON.stringify(
          this.nodes.value,
          null,
          2
        )
    );

          localStorage.setItem(
            'nodes',
            JSON.stringify(
              response.data,
            ),
            
          );
        },

        error: () => {
          this.nodes.next(
            [],
          );

          localStorage.removeItem(
            'nodes',
          );
        },
      });
  }

  clearNodes(): void {
    this.nodes.next([]);

    localStorage.removeItem(
      'nodes',
    );
  }
}