import {
  Component,
  OnInit,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import { EmployeeService }
from '../../../core/services/employee';

@Component({
  selector:
    'app-edit-employee',

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],

  templateUrl:
    './edit-employee.html',

  styleUrl:
    './edit-employee.css',
})
export class EditEmployee
implements OnInit {

  employeeForm:
  FormGroup;

  employeeId = '';

  constructor(

    private fb:
      FormBuilder,

    private route:
      ActivatedRoute,

    private router:
      Router,

    private employeeService:
      EmployeeService,
  ) {

    this.employeeForm =
      this.fb.group({

        name: [''],

        email: [''],

        phone: [''],

        department: [''],

        designation: [''],
      });
  }

  ngOnInit(): void {

    this.employeeId =
      this.route.snapshot
        .paramMap
        .get('id') || '';

    this.loadEmployee();
  }

  loadEmployee(): void {

    this.employeeService
      .getEmployeeById(
        this.employeeId,
      )
      .subscribe({

        next: (
          response: any,
        ) => {

          this.employeeForm
            .patchValue(
              response.data,
            );
        },
      });
  }

  onSubmit(): void {

    this.employeeService
      .updateEmployee(

        this.employeeId,

        this.employeeForm.value,
      )
      .subscribe({

        next: () => {

          this.router.navigate([
            '/employees',
          ]);
        },

        error: (error) => {

          console.log(error);
        },
      });
  }
}