import {
  Injectable,
} from '@angular/core';

import {
  HttpClient,
} from '@angular/common/http';

import {
  Observable,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HealthRecordService {
  private readonly apiUrl =
    'http://localhost:5000/api/health-records';
    

  constructor(
    private readonly http: HttpClient
  ) {}

  /*
  |----------------------------------------------------------
  | Health Records List
  |----------------------------------------------------------
  */

  getHealthRecords(
    params?: any
  ): Observable<any> {
    return this.http.get(
      this.apiUrl,
      {
        params,
      }
    );
  }

  /*
  |----------------------------------------------------------
  | Health Record Details
  |----------------------------------------------------------
  */

 getHealthRecordDetails(
  patientId: string,
  params?: any
): Observable<any> {
  return this.http.get(
    `${this.apiUrl}/${patientId}`,
    {
      params,
    }
  );
}
  /*
  |----------------------------------------------------------
  | Lab Reports
  |----------------------------------------------------------
  */

  addLabReport(
    patientId: string,
    data: any
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${patientId}/lab-reports`,
      data
    );
  }
updateLabReport(
  patientId: string,
  reportId: string,
  data: FormData
): Observable<any> {
  return this.http.put(
    `${this.apiUrl}/${patientId}/lab-reports/${reportId}`,
    data
  );
}
  deleteLabReport(
    patientId: string,
    reportId: string
  ): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${patientId}/lab-reports/${reportId}`
    );
  }

  /*
  |----------------------------------------------------------
  | Medical Documents
  |----------------------------------------------------------
  */

  addMedicalDocument(
    patientId: string,
    data: any
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${patientId}/medical-documents`,
      data
    );
  }
  updateMedicalDocument(
  patientId: string,
  documentId: string,
  data: FormData
): Observable<any> {
  return this.http.put(
    `${this.apiUrl}/${patientId}/medical-documents/${documentId}`,
    data
  );
}
  deleteMedicalDocument(
    patientId: string,
    documentId: string
  ): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${patientId}/medical-documents/${documentId}`
    );
  }
}