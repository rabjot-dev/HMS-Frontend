import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { API_BASE_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class NodeService {
  constructor(
    private readonly http: HttpClient
  ) {}

  getNodes(): Observable<any> {
    return this.http.get(
      `${API_BASE_URL}/nodes`
    );
  }
}