import {
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import { EmployeeService }
from '../../../core/services/employee';

@Component({
  selector:
    'app-pending-employees',

  imports: [
    CommonModule,
  ],

  templateUrl:
    './pending-employees.html',

  styleUrl:
    './pending-employees.css',
})
export class PendingEmployees
implements OnInit {

  pendingEmployees:
    any[] = [];

  generatedPassword =
    '';

  constructor(

    private employeeService:
      EmployeeService,

    private cdr:
      ChangeDetectorRef,
  ) {}

  /*
  |--------------------------------------------------------------------------
  | On Init
  |--------------------------------------------------------------------------
  */
  ngOnInit(): void {

    this.loadPendingEmployees();
  }

  /*
  |--------------------------------------------------------------------------
  | Load Pending Employees
  |--------------------------------------------------------------------------
  */
  loadPendingEmployees(): void {

    this.employeeService
      .getPendingEmployees()

      .subscribe({

        next: (
          response: any,
        ) => {

          console.log(
            response,
          );

          this.pendingEmployees =

            response.data;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.log(
            error,
          );
        },
      });
  }

  /*
  |--------------------------------------------------------------------------
  | Approve Employee
  |--------------------------------------------------------------------------
  */
  approveEmployee(
    employeeId: string,
  ): void {

    this.employeeService
      .approveEmployee(
        employeeId,
      )

      .subscribe({

        next: (
          response: any,
        ) => {

          console.log(
            response,
          );

          this.generatedPassword =

            response
              .temporaryPassword;

          alert(

            `Employee Approved\n\nTemporary Password: ${this.generatedPassword}`,
          );

          this.loadPendingEmployees();
        },

        error: (error) => {

          console.log(
            error,
          );
        },
      });
  }

  /*
  |--------------------------------------------------------------------------
  | Reject Employee
  |--------------------------------------------------------------------------
  */
  rejectEmployee(
    employeeId: string,
  ): void {

    this.employeeService
      .rejectEmployee(
        employeeId,
      )

      .subscribe({

        next: (
          response: any,
        ) => {

          console.log(
            response,
          );

          alert(
            'Employee Rejected',
          );

          this.loadPendingEmployees();
        },

        error: (error) => {

          console.log(
            error,
          );
        },
      });
  }
}