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
export class DashboardService {

  private apiUrl =

    'http://localhost:5000/api/dashboard';

  constructor(

    private http:
      HttpClient,
  ) {}

  /*
  |--------------------------------------------------------------------------
  | Admin Stats
  |--------------------------------------------------------------------------
  */
  getAdminStats():
  Observable<any> {

    return this.http.get(

      `${this.apiUrl}/admin-stats`,
    );
  }
  /*
|--------------------------------------------------------------------------
| Recent Employees
|--------------------------------------------------------------------------
*/
getRecentEmployees():
Observable<any> {

  return this.http.get(

    `${this.apiUrl}/recent-employees`,
  );
}
}