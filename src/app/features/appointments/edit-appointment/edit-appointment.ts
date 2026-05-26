import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { AppointmentService } from '../../../core/services/appointment';

import { EmployeeService } from '../../../core/services/employee';

@Component({
  selector: 'app-edit-appointment',

  standalone: true,

  imports: [CommonModule, ReactiveFormsModule],

  templateUrl: './edit-appointment.html',

  styleUrls: ['./edit-appointment.css']
})
export class EditAppointment implements OnInit {
  appointmentId = '';

  doctors: any[] = [];

  availableSlots: string[] = [];

  isSubmitting = false;

  appointmentForm: any;

  constructor(
    private fb: FormBuilder,

    private route: ActivatedRoute,

    private router: Router,

    private appointmentService: AppointmentService,

    private employeeService: EmployeeService
  ) {
    this.appointmentForm = this.fb.group({
      doctorEmployeeId: ['', Validators.required],

      appointmentDate: ['', Validators.required],

      timeSlot: [''],

      appointmentType: ['CONSULTATION'],

      priority: ['NORMAL'],

      paymentStatus: ['PENDING'],

      visitMode: ['OFFLINE'],

      status: ['BOOKED'],

      reason: [''],

      notes: [''],

      symptoms: ['']
    });
  }

  /*
  |--------------------------------------------------------------------------
  | On Init
  |--------------------------------------------------------------------------
  */
  ngOnInit(): void {
    this.loadDoctors();

    /*
    |--------------------------------------------------------------------------
    | Status Change Logic
    |--------------------------------------------------------------------------
    */
    this.appointmentForm.get('status')?.valueChanges.subscribe({
      next: (status: string) => {
        /*
          |--------------------------------------------------------------------------
          | Hide Slots
          |--------------------------------------------------------------------------
          */
        if (status === 'COMPLETED' || status === 'CANCELLED') {
          this.availableSlots = [];

          this.appointmentForm.patchValue({
            timeSlot: ''
          });
        } else {

        /*
          |--------------------------------------------------------------------------
          | Show Slots Again
          |--------------------------------------------------------------------------
          */
          this.fetchAvailableSlots();
        }
      }
    });

    this.appointmentId = this.route.snapshot.paramMap.get('id') || '';

    if (this.appointmentId) {
      this.loadAppointment();
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Load Doctors
  |--------------------------------------------------------------------------
  */
  loadDoctors(): void {
    this.employeeService
      .getDoctors()

      .subscribe({
        next: (response) => {
          console.log(response);

          this.doctors = response.data;
        },

        error: (error) => {
          console.log(error);
        }
      });
  }

  /*
  |--------------------------------------------------------------------------
  | Load Appointment
  |--------------------------------------------------------------------------
  */
  loadAppointment(): void {
    this.appointmentService
      .getAppointmentById(this.appointmentId)

      .subscribe({
        next: (response) => {
          console.log(response);

          const appointment = response.data;

          this.appointmentForm.patchValue({
            doctorEmployeeId: appointment?.doctorEmployeeId?._id,

            appointmentDate: appointment?.appointmentDate?.split('T')[0],

            timeSlot: appointment?.timeSlot,

            appointmentType: appointment?.appointmentType,

            priority: appointment?.priority,

            paymentStatus: appointment?.paymentStatus,

            visitMode: appointment?.visitMode,

            status: appointment?.status,

            reason: appointment?.reason,

            notes: appointment?.notes,

            symptoms: appointment?.symptoms?.join(', ')
          });

          /*
          |--------------------------------------------------------------------------
          | Fetch Slots Only If Needed
          |--------------------------------------------------------------------------
          */
          if (appointment?.status !== 'COMPLETED' && appointment?.status !== 'CANCELLED') {
            this.fetchAvailableSlots();
          }
        },

        error: (error) => {
          console.log(error);
        }
      });
  }

  /*
  |--------------------------------------------------------------------------
  | Fetch Available Slots
  |--------------------------------------------------------------------------
  */
  fetchAvailableSlots(): void {
    const status = this.appointmentForm.get('status')?.value;

    /*
    |--------------------------------------------------------------------------
    | Don't Fetch For Completed/Cancelled
    |--------------------------------------------------------------------------
    */
    if (status === 'COMPLETED' || status === 'CANCELLED') {
      return;
    }

    const doctorEmployeeId = this.appointmentForm.get('doctorEmployeeId')?.value;

    const appointmentDate = this.appointmentForm.get('appointmentDate')?.value;

    if (!doctorEmployeeId || !appointmentDate) {
      return;
    }

    this.appointmentService
      .getAvailableSlots(
        doctorEmployeeId,

        appointmentDate
      )

      .subscribe({
        next: (response) => {
          console.log(response);

          this.availableSlots = response.data;
        },

        error: (error) => {
          console.log(error);
        }
      });
  }

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */
  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();

      return;
    }

    this.isSubmitting = true;

    const formData = {
      ...this.appointmentForm.value,

      symptoms: this.appointmentForm.value.symptoms

        ?.split(',')

        .map((symptom: string) => symptom.trim())
    };

    this.appointmentService
      .updateAppointment(
        this.appointmentId,

        formData
      )

      .subscribe({
        next: (response) => {
          console.log(response);

          alert('Appointment updated successfully');

          this.router.navigate(['/appointments']);

          this.isSubmitting = false;
        },

        error: (error) => {
          console.log(error);

          this.isSubmitting = false;
        }
      });
  }
}
