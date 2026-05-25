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
    'app-receptionist-dashboard',

  standalone: true,

  imports: [
    RouterLink,
  ],

  templateUrl:
    './receptionist-dashboard.html',

  styleUrl:
    './receptionist-dashboard.css',
})
export class ReceptionistDashboard
implements OnInit {

  stats: any = {};

  todayAppointments:
  any[] = [];

  constructor(

    private dashboardService:
      DashboardService,
  ) {}

  /*
  |--------------------------------------------------------------------------
  | On Init
  |--------------------------------------------------------------------------
  */
  ngOnInit(): void {

    this.loadReceptionStats();

    this.loadTodayAppointments();
  }

  /*
  |--------------------------------------------------------------------------
  | Load Stats
  |--------------------------------------------------------------------------
  */
  loadReceptionStats():
  void {

    this.dashboardService
      .getReceptionistStats()

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
  |--------------------------------------------------------------------------
  | Load Today Appointments
  |--------------------------------------------------------------------------
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