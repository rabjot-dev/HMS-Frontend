import {
  Component,
  OnInit,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';

import {
  PatientService,
} from '../../../core/services/patient';

import {
  EmployeeService,
} from '../../../core/services/employee';

import {
  AppointmentService,
} from '../../../core/services/appointment';

@Component({
  selector:
    'app-book-appointment',

  standalone: true,

  imports: [

    CommonModule,

    ReactiveFormsModule,
  ],

  templateUrl:
    './book-appointment.html',

  styleUrls: [
    './book-appointment.css',
  ],
})
export class BookAppointment
  implements OnInit {

  patients: any[] = [];

  doctors: any[] = [];

  filteredDoctors:
    any[] = [];

  availableSlots:
    string[] = [];

  isSubmitting =
    false;

  appointmentForm: any;

  constructor(

    private fb:
      FormBuilder,

    private patientService:
      PatientService,

    private employeeService:
      EmployeeService,

    private appointmentService:
      AppointmentService,
  ) {

    this.appointmentForm =
      this.fb.group({

        patientId: [

          '',

          Validators.required,
        ],

        department: [

          '',

          Validators.required,
        ],

        doctorId: [

          '',

          Validators.required,
        ],

        appointmentDate: [

          '',

          Validators.required,
        ],

        appointmentTime: [

          '',

          Validators.required,
        ],

        reason: [''],

        notes: [''],
        /*
|--------------------------------------------------------------------------
| Professional Fields
|--------------------------------------------------------------------------
*/

        appointmentType:
          [
            'CONSULTATION'
          ],

        priority:
          [
            'NORMAL'
          ],

        paymentStatus:
          [
            'PENDING'
          ],

        visitMode:
          [
            'OFFLINE'
          ],

        symptoms:
          [
            ''
          ],
      });
  }

  /*
  |--------------------------------------------------------------------------
  | On Init
  |--------------------------------------------------------------------------
  */
  ngOnInit(): void {

    this.loadPatients();

    this.loadDoctors();
  }

  /*
  |--------------------------------------------------------------------------
  | Load Patients
  |--------------------------------------------------------------------------
  */
  loadPatients(): void {

    this.patientService
      .getPatients()

      .subscribe({

        next: (
          response,
        ) => {

          this.patients =
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
  | Load Doctors
  |--------------------------------------------------------------------------
  */
  loadDoctors(): void {

    this.employeeService
      .getDoctors()

      .subscribe({

        next: (
          response,
        ) => {

          this.doctors =
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
  | Filter Doctors By Department
  |--------------------------------------------------------------------------
  */
  filterDoctors(): void {

    const department =

      this.appointmentForm
        .get('department')
        ?.value;

    this.filteredDoctors =

      this.doctors.filter(

        (doctor) =>

          doctor.department
          === department,
      );
  }

  /*
  |--------------------------------------------------------------------------
  | Fetch Available Slots
  |--------------------------------------------------------------------------
  */
  fetchAvailableSlots():
    void {

    const doctorId =

      this.appointmentForm
        .get('doctorId')
        ?.value;

    const appointmentDate =

      this.appointmentForm
        .get('appointmentDate')
        ?.value;

    if (

      !doctorId

      ||

      !appointmentDate
    ) {

      return;
    }

    this.appointmentService
      .getAvailableSlots(

        doctorId,

        appointmentDate,
      )

      .subscribe({

        next: (
          response,
        ) => {

          console.log(
            response,
          );

          this.availableSlots =
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
  | Submit
  |--------------------------------------------------------------------------
  */
  onSubmit(): void {

    if (
      this.appointmentForm
        .invalid
    ) {

      return;
    }

    this.isSubmitting =
      true;
    const formData = {

      ...this.appointmentForm
        .value,

      symptoms:

        this.appointmentForm
          .value
          .symptoms

          ?.split(',')

          .map(
            (
              symptom:
                string,
            ) =>

              symptom.trim(),
          ),
    };

    this.appointmentService
      .bookAppointment(

       formData
      )

      .subscribe({

        next: (
          response,
        ) => {

          console.log(
            response,
          );

          alert(
            'Appointment booked successfully',
          );

          this.appointmentForm
            .reset();

          this.availableSlots =
            [];

          this.isSubmitting =
            false;
        },

        error: (
          error,
        ) => {

          console.log(
            error,
          );

          this.isSubmitting =
            false;
        },
      });
  }
}