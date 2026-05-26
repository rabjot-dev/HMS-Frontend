import { Component }
  from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  CommonModule,
} from '@angular/common';

import { EmployeeService }
  from '../../../core/services/employee';

@Component({
  selector: 'app-add-employee',

  standalone: true,

  imports: [

    ReactiveFormsModule,

    CommonModule,
  ],

  templateUrl:
    './add-employee.html',

  styleUrl:
    './add-employee.css',
})
export class AddEmployee {

  employeeForm: FormGroup;

  successMessage = '';

  errorMessage = '';

  isSubmitting = false;

  constructor(

    private fb: FormBuilder,

    private employeeService:
      EmployeeService,
  ) {

    this.employeeForm =
      this.fb.group({

        /*
        |--------------------------------------------------------------------------
        | Basic Details
        |--------------------------------------------------------------------------
        */
        name: [

          '',
          Validators.required,
        ],

        email: [

          '',

          [

            Validators.required,

            Validators.email,
          ],
        ],

        countryCode: [

          '+91',

          Validators.required,
        ],

        phone: [

          '',

          [

            Validators.required,

            Validators.pattern(
              '^[0-9]{10}$'
            ),
          ],
        ],

        gender: [

          '',

          Validators.required,
        ],

        designation: [

          '',

          Validators.required,
        ],

        department: [

          '',

          Validators.required,
        ],

        joiningDate: [

          '',

          Validators.required,
        ],

        /*
        |--------------------------------------------------------------------------
        | Doctor Fields
        |--------------------------------------------------------------------------
        */
        medicalRegistrationNo: [
          '',
        ],

        specialization: [
          '',
        ],

        qualification: [
          '',
        ],

        consultationFee: [
          0,
        ],

        availabilitySlots: [
          '',
        ],

        /*
        |--------------------------------------------------------------------------
        | Doctor Availability
        |--------------------------------------------------------------------------
        */
        workingDays: [[]],

        startTime: [''],

        endTime: [''],

        slotDuration: [15],

        breakStartTime: [''],

        breakEndTime: [''],

        maxPatientsPerDay: [40],
      });
  }

  /*
  |--------------------------------------------------------------------------
  | Designation Getter
  |--------------------------------------------------------------------------
  */
  get designation():
  string {

    return this.employeeForm
      .get('designation')
      ?.value;
  }

  /*
  |--------------------------------------------------------------------------
  | Submit Form
  |--------------------------------------------------------------------------
  */
  onSubmit(): void {

    console.log(
      'Create Employee Clicked'
    );

    console.log(
      this.employeeForm.value
    );

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */
    if (
      this.employeeForm.invalid
    ) {

      this.employeeForm
        .markAllAsTouched();

      return;
    }

    this.isSubmitting =
      true;

    this.successMessage =
      '';

    this.errorMessage =
      '';

    /*
    |--------------------------------------------------------------------------
    | Remove Doctor Fields
    |--------------------------------------------------------------------------
    */
    if (
      this.designation !==
      'DOCTOR'
    ) {

      this.employeeForm.patchValue({

        medicalRegistrationNo:
          '',

        specialization:
          '',

        qualification:
          '',

        consultationFee:
          0,

        availabilitySlots:
          '',

        workingDays:
          [],

        startTime:
          '',

        endTime:
          '',

        breakStartTime:
          '',

        breakEndTime:
          '',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Payload
    |--------------------------------------------------------------------------
    */
    const payload = {

      ...this.employeeForm.value,

      qualification:
        this.employeeForm.value
          .qualification

          ? [

            this.employeeForm.value
              .qualification,
          ]

          : [],

      role:
        this.employeeForm.value
          .designation,
    };

    console.log(
      'FINAL PAYLOAD'
    );

    console.log(
      JSON.stringify(
        payload,
        null,
        2,
      )
    );

    /*
    |--------------------------------------------------------------------------
    | API Call
    |--------------------------------------------------------------------------
    */
    this.employeeService
      .createEmployee(
        payload,
      )

      .subscribe({

        next: (
          response,
        ) => {

          console.log(
            response,
          );

          this.isSubmitting =
            false;

          this.successMessage =

            'Employee created successfully';

          this.employeeForm
            .reset();

          this.employeeForm
            .patchValue({

              countryCode:
                '+91',
            });
        },

        error: (
          error,
        ) => {

          console.log(
            'FULL ERROR',
          );

          console.log(
            error,
          );

          console.log(
            'BACKEND RESPONSE',
          );

          console.log(
            error?.error,
          );

          console.log(
            'VALIDATION',
          );

          console.log(
            error?.error?.errors,
          );

          this.isSubmitting =
            false;

          this.errorMessage =

            error?.error?.message

            ||

            'Failed to create employee';
        },
      });
  }

  /*
  |--------------------------------------------------------------------------
  | Working Days Selection
  |--------------------------------------------------------------------------
  */
  onWorkingDayChange(
    event: any,
  ): void {

    const workingDays =

      this.employeeForm
        .get('workingDays')
        ?.value || [];

    if (
      event.target.checked
    ) {

      workingDays.push(
        event.target.value,
      );

    } else {

      const index =

        workingDays.indexOf(
          event.target.value,
        );

      if (
        index > -1
      ) {

        workingDays.splice(
          index,
          1,
        );
      }
    }

    this.employeeForm
      .get('workingDays')
      ?.setValue(
        workingDays,
      );
  }
}