import { Component,ChangeDetectorRef } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { EmployeeService } from '../../../core/services/employee';

@Component({
  selector: 'app-add-employee',

  standalone: true,

  imports: [ReactiveFormsModule, CommonModule],

  templateUrl: './add-employee.html',

  styleUrl: './add-employee.css'
})
export class AddEmployee {
  employeeForm: FormGroup;

  successMessage = '';

  errorMessage = '';

  isSubmitting = false;

  constructor(
    private fb: FormBuilder,

    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) {
    this.employeeForm = this.fb.group({
      /*
      |--------------------------------------------------------------------------
      | Basic Details
      |--------------------------------------------------------------------------
      */
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
          Validators.pattern(/^[A-Za-z\s]+$/)
        ]
      ],

      email: ['', [Validators.required, Validators.email]],

      countryCode: ['+91', Validators.required],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$')
        ]
      ],

      gender: ['', Validators.required],

      designation: ['', Validators.required],

      department: ['', Validators.required],

      joiningDate: ['', Validators.required],

      /*
      |--------------------------------------------------------------------------
      | Doctor Fields
      |--------------------------------------------------------------------------
      */
      medicalRegistrationNo: [
        '',
        [
          Validators.minLength(5),
          Validators.maxLength(50),
          Validators.pattern(/^[A-Za-z0-9\-\/]+$/)
        ]
      ],

      specialization: [''],

      qualification: [
        '',
        [
          Validators.minLength(2),
          Validators.maxLength(100),
          Validators.pattern(/^[A-Za-z0-9\s.,()-]+$/)
        ]
      ],

      consultationFee: [
        0,
        [
          Validators.min(0)
        ]
      ],

      availabilitySlots: [''],

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

      maxPatientsPerDay: [40]
    });

    /*
    |--------------------------------------------------------------------------
    | Dynamic Doctor Validators
    |--------------------------------------------------------------------------
    */
    this.employeeForm
      .get('designation')
      ?.valueChanges.subscribe((designation) => {
        const doctorFields = [
          'medicalRegistrationNo',
          'specialization',
          'qualification',
          'availabilitySlots',
          'startTime',
          'endTime',
          'breakStartTime',
          'breakEndTime'
        ];

        if (designation === 'DOCTOR') {
          doctorFields.forEach((field) => {
            this.employeeForm
              .get(field)
              ?.setValidators([Validators.required]);

            this.employeeForm
              .get(field)
              ?.updateValueAndValidity();
          });
        } else {
          doctorFields.forEach((field) => {
            this.employeeForm
              .get(field)
              ?.clearValidators();

            this.employeeForm
              .get(field)
              ?.updateValueAndValidity();
          });
        }
      });
  }

  /*
  |--------------------------------------------------------------------------
  | Designation Getter
  |--------------------------------------------------------------------------
  */
  get designation(): string {
    return this.employeeForm.get('designation')?.value;
  }

  /*
  |--------------------------------------------------------------------------
  | Submit Form
  |--------------------------------------------------------------------------
  */
  onSubmit(): void {
    console.log('FORM VALID:', this.employeeForm.valid);

    Object.keys(this.employeeForm.controls).forEach((key) => {
      const control = this.employeeForm.get(key);

      if (control?.invalid) {
        console.log(key, control.errors);
      }
    });

    console.log('Create Employee Clicked');

    console.log(this.employeeForm.value);

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();

      return;
    }

    this.isSubmitting = true;

    this.successMessage = '';

    this.errorMessage = '';

    /*
    |--------------------------------------------------------------------------
    | Remove Doctor Fields
    |--------------------------------------------------------------------------
    */
    if (this.designation !== 'DOCTOR') {
      this.employeeForm.patchValue({
        medicalRegistrationNo: '',

        specialization: '',

        qualification: '',

        consultationFee: 0,

        availabilitySlots: '',

        workingDays: [],

        startTime: '',

        endTime: '',

        breakStartTime: '',

        breakEndTime: ''
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Payload
    |--------------------------------------------------------------------------
    */
    const payload: any = {
  ...this.employeeForm.value,

  qualification: this.employeeForm.value.qualification
    ? [this.employeeForm.value.qualification]
    : [],

  role: this.employeeForm.value.designation
};

if (this.designation !== 'DOCTOR') {
  delete payload.medicalRegistrationNo;
  delete payload.specialization;
  delete payload.qualification;
  delete payload.consultationFee;
  delete payload.availabilitySlots;
  delete payload.workingDays;
  delete payload.startTime;
  delete payload.endTime;
  delete payload.slotDuration;
  delete payload.breakStartTime;
  delete payload.breakEndTime;
  delete payload.maxPatientsPerDay;
}

    console.log('FINAL PAYLOAD');

    console.log(JSON.stringify(payload, null, 2));

    /*
    |--------------------------------------------------------------------------
    | API Call
    |--------------------------------------------------------------------------
    */
    this.employeeService
      .createEmployee(payload)
      .subscribe({
        next: (response) => {
          console.log(response);

          this.isSubmitting = false;

          this.successMessage =
            'Employee created successfully';

          this.errorMessage = '';
          this.cdr.detectChanges();

          this.employeeForm.reset();

          this.employeeForm.patchValue({
            countryCode: '+91',

            designation: ''
          });
        },

        error: (error) => {
  console.log('FULL ERROR');

  console.log(error);

  console.log('BACKEND RESPONSE');

  console.log(error?.error);

  console.log('VALIDATION');

  console.log(error?.error?.errors);

  this.isSubmitting = false;

  this.successMessage = '';

  this.errorMessage =
    error?.error?.message ||
    'Failed to create employee';
  this.cdr.detectChanges();
}
      });
  }

  /*
  |--------------------------------------------------------------------------
  | Working Days Selection
  |--------------------------------------------------------------------------
  */
  onWorkingDayChange(event: any): void {
    const workingDays =
      this.employeeForm.get('workingDays')?.value || [];

    if (event.target.checked) {
      workingDays.push(event.target.value);
    } else {
      const index = workingDays.indexOf(
        event.target.value
      );

      if (index > -1) {
        workingDays.splice(index, 1);
      }
    }

    this.employeeForm
      .get('workingDays')
      ?.setValue(workingDays);
  }
}