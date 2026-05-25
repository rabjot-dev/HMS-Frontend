import {
  Component,
  OnInit,
} from '@angular/core';

import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';

import {
  CommonModule,
} from '@angular/common';

import {
  PatientService,
} from '../../../core/services/patient';

@Component({
  selector:
    'app-add-patient',

  standalone: true,

  imports: [

    ReactiveFormsModule,

    CommonModule,
  ],

  templateUrl:
    './add-patient.html',

  styleUrls: [
    './add-patient.css',
  ],
})
export class AddPatient
  implements OnInit {

  /*
  |--------------------------------------------------------------------------
  | Current Step
  |--------------------------------------------------------------------------
  */
  currentStep = 1;

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */
  isSubmitting = false;

  /*
  |--------------------------------------------------------------------------
  | Doctors
  |--------------------------------------------------------------------------
  */
  doctors: any[] = [];

  /*
  |--------------------------------------------------------------------------
  | Patient Form
  |--------------------------------------------------------------------------
  */
  patientForm: any;

  constructor(

    private fb:
      FormBuilder,

    private patientService:
      PatientService,
  ) {

    this.patientForm =
      this.fb.group({

        /*
        |--------------------------------------------------------------------------
        | Basic Information
        |--------------------------------------------------------------------------
        */
        firstName: [

          '',

          Validators.required,
        ],

        lastName: [

          '',

          Validators.required,
        ],

        dateOfBirth: [

          '',

          Validators.required,
        ],
        countryCode: [

          '+91',

          Validators.required,
        ],

        gender: [

          '',

          Validators.required,
        ],

        bloodGroup: [''],

        maritalStatus: [''],

        /*
        |--------------------------------------------------------------------------
        | Contact Information
        |--------------------------------------------------------------------------
        */
       phone: [

  '',

  [

    Validators.required,

    Validators.pattern(
      '^[0-9]{10}$'
    ),
  ],
],

        email: [''],

        address: [''],

        city: [''],

        state: [''],

        pincode: [''],

        country: ['India'],

        /*
        |--------------------------------------------------------------------------
        | Emergency Contact
        |--------------------------------------------------------------------------
        */
        emergencyContactName:
          [''],

        emergencyContactPhone:
          [''],

        relationship: [''],

        /*
        |--------------------------------------------------------------------------
        | Medical Information
        |--------------------------------------------------------------------------
        */
        medicalHistory: [''],

        allergies: [''],

        chronicDiseases: [''],

        currentMedications:
          [''],

        pastSurgeries: [''],

        familyMedicalHistory:
          [''],

        /*
        |--------------------------------------------------------------------------
        | Insurance Information
        |--------------------------------------------------------------------------
        */
        insuranceProvider:
          [''],

        insurancePolicyNumber:
          [''],

        insuranceExpiryDate:
          [''],

        insuranceCoverageAmount:
          [''],

        /*
        |--------------------------------------------------------------------------
        | Hospital Information
        |--------------------------------------------------------------------------
        */
        assignedDoctor: [''],

        department: [''],

        patientType: ['OPD'],
      });
  }

  /*
  |--------------------------------------------------------------------------
  | On Init
  |--------------------------------------------------------------------------
  */
  ngOnInit(): void {

    this.loadDoctors();
  }

  /*
  |--------------------------------------------------------------------------
  | Load Doctors
  |--------------------------------------------------------------------------
  */
  loadDoctors(): void {

    this.patientService
      .getDoctors()

      .subscribe({

        next: (
          response,
        ) => {

          console.log(
            response,
          );

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
  | Next Step
  |--------------------------------------------------------------------------
  */
  nextStep(): void {

    if (
      this.currentStep < 4
    ) {

      this.currentStep++;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Previous Step
  |--------------------------------------------------------------------------
  */
  previousStep(): void {

    if (
      this.currentStep > 1
    ) {

      this.currentStep--;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */
  onSubmit(): void {

    if (
      this.patientForm.invalid
    ) {

      this.patientForm
        .markAllAsTouched();

      return;
    }

    this.isSubmitting =
      true;

    console.log(
      this.patientForm.value,
    );

    this.patientService
      .createPatient(

        this.patientForm.value,
      )

      .subscribe({

        next: (
          response,
        ) => {

          console.log(
            response,
          );

          alert(
            'Patient Registered Successfully',
          );

          this.patientForm
            .reset();

          this.currentStep =
            1;

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