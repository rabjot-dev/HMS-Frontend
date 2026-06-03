import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  readonly apiUrl = 'http://localhost:5000/api/dashboard';

  constructor(readonly http: HttpClient) {}

  /*
  |--------------------------------------------------------------------------
  | Admin Stats
  |--------------------------------------------------------------------------
  */
  getAdminStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin-stats`);
  }

  /*
  |--------------------------------------------------------------------------
  | Recent Employees
  |--------------------------------------------------------------------------
  */
  getRecentEmployees(): Observable<any> {
    return this.http.get(`${this.apiUrl}/recent-employees`);
  }

  /*
  |--------------------------------------------------------------------------
  | Doctor Stats
  |--------------------------------------------------------------------------
  */
  getDoctorStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/doctor-stats`);
  }

  /*
  |--------------------------------------------------------------------------
  | Receptionist Stats
  |--------------------------------------------------------------------------
  */
  getReceptionistStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/receptionist-stats`);
  }

  /*
  |--------------------------------------------------------------------------
  | Today Appointments
  |--------------------------------------------------------------------------
  */
  getTodayAppointments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/today-appointments`);
  }
}
