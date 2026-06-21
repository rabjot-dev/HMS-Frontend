import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';

export interface MenuNode {
  _id: string;
  label: string;
  path: string;
  icon: string;
  allowedRoles: string[];
  order: number;
}

@Injectable({
  providedIn: 'root'
})
export class MenuNodeService {
  private readonly apiUrl = `${API_BASE_URL}/menu-nodes`;

  constructor(private readonly http: HttpClient) {}

  getMyMenu(): Observable<{ success: boolean; data: MenuNode[] }> {
    return this.http.get<{ success: boolean; data: MenuNode[] }>(
      `${this.apiUrl}/my-menu`
    );
  }
}
