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
export class AppointmentService {

  apiUrl =
    'http://localhost:5000/api/appointments';

  constructor(

    private http:
      HttpClient,
  ) {}

  /*
  |--------------------------------------------------------------------------
  | Get Available Slots
  |--------------------------------------------------------------------------
  */
  getAvailableSlots(

    doctorId: string,

    appointmentDate:
      string,
  ): Observable<any> {

    return this.http.get(

      `${this.apiUrl}/available-slots`,

      {
        params: {

          doctorId,

          appointmentDate,
        },
      },
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Book Appointment
  |--------------------------------------------------------------------------
  */
  bookAppointment(
    appointmentData: any,
  ): Observable<any> {

    return this.http.post(

      this.apiUrl,

      appointmentData,
    );
  }
  /*
|--------------------------------------------------------------------------
| Get Appointments
|--------------------------------------------------------------------------
*/
getAppointments():
Observable<any> {

  return this.http.get(
    this.apiUrl,
  );
}

/*
|--------------------------------------------------------------------------
| Delete Appointment
|--------------------------------------------------------------------------
*/
deleteAppointment(
  id: string,
): Observable<any> {

  return this.http.delete(

    `${this.apiUrl}/${id}`,
  );
}
/*
|--------------------------------------------------------------------------
| Get Appointment By ID
|--------------------------------------------------------------------------
*/
getAppointmentById(
  id: string,
): Observable<any> {

  return this.http.get(

    `${this.apiUrl}/${id}`,
  );
}

/*
|--------------------------------------------------------------------------
| Update Appointment
|--------------------------------------------------------------------------
*/
updateAppointment(

  id: string,

  appointmentData: any,
): Observable<any> {

  return this.http.put(

    `${this.apiUrl}/${id}`,

    appointmentData,
  );
}
/*
|--------------------------------------------------------------------------
| Doctor Queue
|--------------------------------------------------------------------------
*/
getDoctorQueue(
  doctorEmployeeId:
  string,
): Observable<any> {

  return this.http.get(

    `${this.apiUrl}/doctor-queue`,

    {
      params: {

        doctorEmployeeId,
      },
    },
  );
}
}