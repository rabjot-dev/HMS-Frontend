import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  readonly apiUrl = 'http://localhost:5000/api/patients';

  constructor(readonly http: HttpClient) {}

  /*
  |--------------------------------------------------------------------------
  | Register Patient
  |--------------------------------------------------------------------------
  */
  createPatient(patientData: any): Observable<any> {
    return this.http.post(
      this.apiUrl,

      patientData
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Get All Patients
  |--------------------------------------------------------------------------
  */
  getPatients(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  /*
|--------------------------------------------------------------------------
| Get Doctors
|--------------------------------------------------------------------------
*/
  getDoctors(): Observable<any> {
    return this.http.get('http://localhost:5000/api/employees/doctors');
  }
  /*
|--------------------------------------------------------------------------
| Get Patient By ID
|--------------------------------------------------------------------------
*/
  getPatientById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  /*
|--------------------------------------------------------------------------
| Update Patient
|--------------------------------------------------------------------------
*/
  updatePatient(id: string, patientData: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}`,

      patientData
    );
  }
}
