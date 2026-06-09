import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { API_BASE_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  createEmployee(data: any): Observable<any> {
    return this.http.post(`${API_BASE_URL}/employees`, data);
  }

  getEmployees(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/employees`);
  }
  getEmployeeById(id: string): Observable<any> {
    return this.http.get(`${API_BASE_URL}/employees/${id}`);
  }

  updateEmployee(id: string, data: any): Observable<any> {
    return this.http.put(
      `${API_BASE_URL}/employees/${id}`,

      data
    );
  }
  deactivateEmployee(id: string): Observable<any> {
    return this.http.patch(
      `${API_BASE_URL}/employees/${id}/deactivate`,

      {}
    );
  }
  activateEmployee(id: string): Observable<any> {
    return this.http.patch(
      `${API_BASE_URL}/employees/${id}/activate`,

      {}
    );
  }
  getPendingEmployees() {
    return this.http.get(`${API_BASE_URL}/employees/pending-employees`);
  }

  approveEmployee(employeeId: string, data: any) {
    return this.http.patch(`${API_BASE_URL}/employees/${employeeId}/approve-employee`, data);
  }

  rejectEmployee(employeeId: string) {
    return this.http.patch(
      `${API_BASE_URL}/employees/${employeeId}/reject-employee`,

      {}
    );
  }
  /*
|--------------------------------------------------------------------------
| Get Doctors
|--------------------------------------------------------------------------
*/
  getDoctors(): Observable<any> {
    return this.http.get(`${API_BASE_URL}/employees/doctors`);
  }
  /*
|--------------------------------------------------------------------------
| Get Doctor Availability
|--------------------------------------------------------------------------
*/
  getDoctorAvailability() {
    return this.http.get(`${API_BASE_URL}/employees/doctor/availability`);
  }

  /*
|--------------------------------------------------------------------------
| Update Doctor Availability
|--------------------------------------------------------------------------
*/
  updateDoctorAvailability(data: any) {
    return this.http.patch(
      `${API_BASE_URL}/employees/doctor/availability`,

      data
    );
  }
}
