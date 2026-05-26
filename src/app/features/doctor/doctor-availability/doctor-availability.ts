import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { EmployeeService } from '../../../core/services/employee';

@Component({
  selector: 'app-doctor-availability',

  standalone: true,

  imports: [CommonModule, ReactiveFormsModule],

  templateUrl: './doctor-availability.html',

  styleUrls: ['./doctor-availability.css']
})
export class DoctorAvailability implements OnInit {
  isSubmitting = false;

  availabilityForm: any;

  workingDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  constructor(
    private fb: FormBuilder,

    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) {
    this.availabilityForm = this.fb.group({
      workingDays: [[]],

      startTime: ['', Validators.required],

      endTime: ['', Validators.required],

      slotDuration: [15, Validators.required],

      breakStartTime: [''],

      breakEndTime: [''],

      maxPatientsPerDay: [40, Validators.required],

      isAvailable: [true]
    });
  }

  /*
  |--------------------------------------------------------------------------
  | On Init
  |--------------------------------------------------------------------------
  */
  ngOnInit(): void {
    this.loadAvailability();
  }

  /*
  |--------------------------------------------------------------------------
  | Load Availability
  |--------------------------------------------------------------------------
  */
  loadAvailability(): void {
    this.employeeService
      .getDoctorAvailability()

      .subscribe({
        next: (response: any) => {
          console.log(response);

          this.availabilityForm.patchValue({
            workingDays: response?.data?.workingDays,

            startTime: response?.data?.startTime,

            endTime: response?.data?.endTime,

            slotDuration: response?.data?.slotDuration,

            breakStartTime: response?.data?.breakStartTime,

            breakEndTime: response?.data?.breakEndTime,

            maxPatientsPerDay: response?.data?.maxPatientsPerDay,

            isAvailable: response?.data?.isAvailable
          });
          this.cdr.detectChanges();
        },

        error: (error) => {
          console.log(error);
        }
      });
  }

  /*
  |--------------------------------------------------------------------------
  | Toggle Working Day
  |--------------------------------------------------------------------------
  */
  toggleDay(day: string): void {
    const currentDays = this.availabilityForm.value.workingDays;

    const exists = currentDays.includes(day);

    if (exists) {
      this.availabilityForm.patchValue({
        workingDays: currentDays.filter((d: string) => d !== day)
      });
    } else {
      this.availabilityForm.patchValue({
        workingDays: [...currentDays, day]
      });
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */
  onSubmit(): void {
    if (this.availabilityForm.invalid) {
      this.availabilityForm.markAllAsTouched();

      return;
    }

    this.isSubmitting = true;

    this.employeeService
      .updateDoctorAvailability(this.availabilityForm.value)

      .subscribe({
        next: (response) => {
          console.log(response);

          alert('Availability updated successfully');

          this.isSubmitting = false;
        },

        error: (error) => {
          console.log(error);

          this.isSubmitting = false;
        }
      });
  }
}
