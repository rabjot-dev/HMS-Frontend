import {
  Component,
  OnInit,
} from '@angular/core';

import {
  AsyncPipe,
} from '@angular/common';
import { RouterLink, } from '@angular/router';

import {
  AuthService,
} from '../../../core/services/auth';

import {
  DashboardService,
} from '../../../core/services/dashboard';

@Component({
  selector:
    'app-dashboard-home',

  imports: [
    AsyncPipe,
    RouterLink,
  ],

  templateUrl:
    './dashboard-home.html',

  styleUrl:
    './dashboard-home.css',
})
export class DashboardHome
implements OnInit {

  stats: any = {};
  recentEmployees:
any[] = [];

  constructor(

    public authService:
      AuthService,

    private dashboardService:
      DashboardService,
  ) {}

  /*
  |--------------------------------------------------------------------------
  | On Init
  |--------------------------------------------------------------------------
  */
  ngOnInit(): void {

    this.loadStats();
    this.loadRecentEmployees();
  }

  /*
  |--------------------------------------------------------------------------
  | Load Stats
  |--------------------------------------------------------------------------
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
|--------------------------------------------------------------------------
| Load Recent Employees
|--------------------------------------------------------------------------
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