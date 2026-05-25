import { Component }
  from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { EmployeeService }
  from '../../../core/services/employee';

@Component({
  selector: 'app-add-employee',

  imports: [
    ReactiveFormsModule,
  ],

  templateUrl:
    './add-employee.html',

  styleUrl:
    './add-employee.css',
})
export class AddEmployee {

  employeeForm: FormGroup;

  successMessage = '';
  get designation(): string {

    return this.employeeForm
      .get('designation')
      ?.value;
  }
  onSubmit(): void {

    if (
      this.employeeForm.invalid
    ) {

      this.employeeForm
        .markAllAsTouched();

      return;
    }

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

    this.employeeService
      .createEmployee(payload)
      .subscribe({

        next: (response) => {

          console.log(response);

          this.successMessage =
            'Employee created successfully';
        },

        error: (error) => {

          console.log(error);

          console.log(
            error.error.errors
          );
        },
      });
  }

  constructor(

    private fb: FormBuilder,

    private employeeService:
      EmployeeService,
  ) {
    this.employeeForm =
      this.fb.group({

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