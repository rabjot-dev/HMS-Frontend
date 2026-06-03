import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  readonly apiUrl = 'http://localhost:5000/api/consultations';

  constructor(readonly http: HttpClient) {}

  /*
  |--------------------------------------------------------------------------
  | Create Consultation
  |--------------------------------------------------------------------------
  */
  createConsultation(data: any): Observable<any> {
    return this.http.post(
      this.apiUrl,

      data
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Get All Consultations
  |--------------------------------------------------------------------------
  */
  getConsultations(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  /*
  |--------------------------------------------------------------------------
  | Get Consultation By Appointment
  |--------------------------------------------------------------------------
  */
  getConsultationByAppointment(appointmentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/appointment/${appointmentId}`);
  }

  /*
  |--------------------------------------------------------------------------
  | Update Consultation
  |--------------------------------------------------------------------------
  */
  updateConsultation(
    id: string,

    data: any
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}`,

      data
    );
  }
  /*
|--------------------------------------------------------------------------
| Download Prescription PDF
|--------------------------------------------------------------------------
*/
  downloadPrescriptionPdf(consultationId: string) {
    return this.http.get(
      `${this.apiUrl}/prescription/${consultationId}`,

      {
        responseType: 'blob'
      }
    );
  }
  /*
|--------------------------------------------------------------------------
| Get Consultation By Id
|--------------------------------------------------------------------------
*/
  getConsultationById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
