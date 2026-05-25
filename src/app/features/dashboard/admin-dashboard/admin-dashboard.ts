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
    'app-admin-dashboard',

  standalone: true,

  imports: [
    RouterLink,
  ],

  templateUrl:
    './admin-dashboard.html',

  styleUrl:
    './admin-dashboard.css',
})
export class AdminDashboard
implements OnInit {

  stats: any = {};

  recentEmployees:
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

    this.loadStats();

    this.loadRecentEmployees();
  }

  /*
  |------------------------------------------------------------------
  | Load Stats
  |------------------------------------------------------------------
  */
  loadStats(): void {

    this.dashboardService
      .getAdminStats()

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
  | Load Recent Employees
  |------------------------------------------------------------------
  */
  loadRecentEmployees():
  void {

    this.dashboardService
      .getRecentEmployees()

      .subscribe({

        next: (
          response,
        ) => {

          console.log(
            response,
          );

          this.recentEmployees =
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