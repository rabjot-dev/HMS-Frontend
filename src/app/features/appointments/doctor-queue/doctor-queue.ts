import {
  Component,
  OnInit,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';
import {
  RouterLink,
} from '@angular/router';

import {
  AppointmentService,
} from '../../../core/services/appointment';

import {
  AuthService,
} from '../../../core/services/auth';

@Component({
  selector:
    'app-doctor-queue',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
  ],

  templateUrl:
    './doctor-queue.html',

  styleUrls: [
    './doctor-queue.css',
  ],
})
export class DoctorQueue
implements OnInit {

  appointments:
  any[] = [];

  isLoading =
    false;

  doctorEmployeeId =
    '';

  constructor(

    private appointmentService:
      AppointmentService,

    public authService:
      AuthService,
  ) {}

  /*
  |--------------------------------------------------------------------------
  | On Init
  |--------------------------------------------------------------------------
  */
  ngOnInit(): void {

    this.authService
      .currentUser

      .subscribe({

        next: (
          user: any,
        ) => {

          console.log(
            user,
          );

          this.doctorEmployeeId =

            user?.employeeId?._id;

          if (
            this.doctorEmployeeId
          ) {

            this.loadQueue();
          }
        },
      });
  }

  /*
  |--------------------------------------------------------------------------
  | Load Queue
  |--------------------------------------------------------------------------
  */
  loadQueue(): void {

    this.isLoading =
      true;

    this.appointmentService
      .getDoctorQueue(

        this.doctorEmployeeId,
      )

      .subscribe({

        next: (
          response,
        ) => {

          console.log(
            response,
          );

          this.appointments =
            response.data;

          this.isLoading =
            false;
        },

        error: (
          error,
        ) => {

          console.log(
            error,
          );

          this.isLoading =
            false;
        },
      });
  }

  /*
  |--------------------------------------------------------------------------
  | Mark Completed
  |--------------------------------------------------------------------------
  */
  markCompleted(
    appointment: any,
  ): void {

    const updatedData = {

      ...appointment,

      status:
        'COMPLETED',
    };

    this.appointmentService
      .updateAppointment(

        appointment._id,

        updatedData,
      )

      .subscribe({

        next: (
          response,
        ) => {

          console.log(
            response,
          );

          alert(
            'Consultation completed',
          );

          this.loadQueue();
        },

        error: (
          error,
        ) => {

          console.log(
            error,
          );
        },
      });
  }

  /*
  |--------------------------------------------------------------------------
  | Start Consultation
  |--------------------------------------------------------------------------
  */
  startConsultation(
    appointment: any,
  ): void {

    const updatedData = {

      ...appointment,

      status:
        'IN_CONSULTATION',
    };

    this.appointmentService
      .updateAppointment(

        appointment._id,

        updatedData,
      )

      .subscribe({

        next: (
          response,
        ) => {

          console.log(
            response,
          );

          alert(
            'Consultation started',
          );

          this.loadQueue();
        },

        error: (
          error,
        ) => {

          console.log(
            error,
          );
        },
      });
  }
}