import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private readonly apiUrl = `${API_BASE_URL}/patients`;

  constructor(private readonly http: HttpClient) {}

  // Register a new patient
  createPatient(patientData: any): Observable<any> {
    return this.http.post(
      this.apiUrl,
      patientData
    );
  }

  // Get all patients
  getPatients(page = 1, limit = 10, filters: any = {}): Observable<any> {
    const params: any = {
      page,
      limit
    };

    if (filters.search?.trim()) {
      params.search = filters.search.trim();
    }

    if (filters.status) {
      params.status = filters.status;
    }

    if (filters.sortBy) {
      params.sortBy = filters.sortBy;
      params.sortOrder = filters.sortOrder || 'desc';
    }

    return this.http.get(this.apiUrl, { params });
  }

  // Get list of doctors for patient assignment
  getDoctors(page = 1, limit = 100): Observable<any> {
  return this.http.get(
    `${API_BASE_URL}/employees/doctors`,
    {
      params: {
        page,
        limit
      }
    }
  );
}

  // Get patient details by ID
  getPatientById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Update patient information
  updatePatient(
    id: string,
    patientData: any
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      patientData
    );
  }

  // Soft delete patient
  deletePatient(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
