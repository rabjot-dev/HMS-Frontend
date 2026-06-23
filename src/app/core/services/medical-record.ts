import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {
  private readonly apiUrl = `${API_BASE_URL}/medical-records`;

  constructor(private readonly http: HttpClient) {}

  getPrescriptions(
    page = 1,
    limit = 10,
    filters: any = {}
  ): Observable<any> {
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

    if (filters.fromDate) {
      params.fromDate = filters.fromDate;
    }

    if (filters.toDate) {
      params.toDate = filters.toDate;
    }

    if (filters.sortBy) {
      params.sortBy = filters.sortBy;
      params.sortOrder = filters.sortOrder || 'desc';
    }

    return this.http.get(`${this.apiUrl}/prescriptions`, { params });
  }

  getPatientPrescriptions(
    patientId: string,
    page = 1,
    limit = 10,
    filters: any = {}
  ): Observable<any> {
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

    if (filters.fromDate) {
      params.fromDate = filters.fromDate;
    }

    if (filters.toDate) {
      params.toDate = filters.toDate;
    }

    return this.http.get(
      `${this.apiUrl}/prescriptions/patient/${patientId}`,
      { params }
    );
  }

  getMyPrescriptions(page = 1, limit = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/prescriptions/my`, {
      params: {
        page,
        limit
      }
    });
  }

  getPrescriptionById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/prescriptions/${id}`);
  }

  getHealthRecords(
    page = 1,
    limit = 10,
    filters: any = {}
  ): Observable<any> {
    const params = this.buildRecordParams(page, limit, filters);

    return this.http.get(`${this.apiUrl}/health-records`, { params });
  }

  getPatientHealthRecords(
    patientId: string,
    page = 1,
    limit = 10,
    filters: any = {}
  ): Observable<any> {
    const params = this.buildRecordParams(page, limit, filters);

    return this.http.get(
      `${this.apiUrl}/health-records/patient/${patientId}`,
      { params }
    );
  }

  createHealthRecord(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/health-records`, data);
  }

  updateHealthRecord(id: string, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/health-records/${id}`, data);
  }

  deleteHealthRecord(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/health-records/${id}`);
  }

  getLabReports(): Observable<any> {
    return this.http.get(`${this.apiUrl}/lab-reports`);
  }

  private buildRecordParams(page: number, limit: number, filters: any): any {
    const params: any = {
      page,
      limit
    };

    if (filters.search?.trim()) {
      params.search = filters.search.trim();
    }

    if (filters.documentType) {
      params.documentType = filters.documentType;
    }

    if (filters.sortBy) {
      params.sortBy = filters.sortBy;
      params.sortOrder = filters.sortOrder || 'desc';
    }

    return params;
  }
}
