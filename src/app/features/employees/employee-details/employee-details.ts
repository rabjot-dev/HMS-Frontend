import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { EmployeeService } from '../../../core/services/employee';

@Component({
  selector: 'app-employee-details',
  standalone: true,

  imports: [CommonModule],

  templateUrl: './employee-details.html',

  styleUrl: './employee-details.css'
})
export class EmployeeDetails implements OnInit {
  employee: any = null;

  constructor(
    readonly route: ActivatedRoute,

    readonly employeeService: EmployeeService,
    readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.employeeService.getEmployeeById(id).subscribe({
        next: (response: any) => {
          console.log(response);

          this.employee = response.data;
          this.cdr.markForCheck();
        },

        error: (error) => {
          console.log(error);
        }
      });
    }
  }
}
