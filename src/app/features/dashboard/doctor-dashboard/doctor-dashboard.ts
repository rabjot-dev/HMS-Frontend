import {
  Component,
  OnInit,
} from '@angular/core';

import {
  RouterLink,
} from '@angular/router';

import {
  DashboardService,
} from '../../../core/services/dashboard';

@Component({
  selector:
    'app-doctor-dashboard',

  standalone: true,

  imports: [
    RouterLink,
  ],

  templateUrl:
    './doctor-dashboard.html',

  styleUrl:
    './doctor-dashboard.css',
})
export class DoctorDashboard
implements OnInit {

  stats: any = {};

  todayAppointments:
  any[] = [];

  constructor(

    private dashboardService:
      DashboardService,
  ) {}

  /*
  |------------------------------------------------------------------
  | On Init
  |------------------------------------------------------------------
  */
  ngOnInit(): void {

    this.loadDoctorStats();

    this.loadTodayAppointments();
  }

  /*
  |------------------------------------------------------------------
  | Load Stats
  |------------------------------------------------------------------
  */
  loadDoctorStats():
  void {

    this.dashboardService
      .getDoctorStats()

      .subscribe({

        next: (
          response,
        ) => {

          console.log(
            response,
          );

          this.stats =
            response.data;
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
  |------------------------------------------------------------------
  | Load Today Appointments
  |------------------------------------------------------------------
  */
  loadTodayAppointments():
  void {

    this.dashboardService
      .getTodayAppointments()

      .subscribe({

        next: (
          response,
        ) => {

          console.log(
            response,
          );

          this.todayAppointments =
            response.data;
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