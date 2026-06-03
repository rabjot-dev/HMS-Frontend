import { Component } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { PatientService } from '../../../core/services/patient';

@Component({
  selector: 'app-add-patient',

  standalone: true,

  imports: [ReactiveFormsModule, CommonModule],

  templateUrl: './add-patient.html',

  styleUrls: ['./add-patient.css']
})
export class AddPatient {
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
  | Patient Form
  |--------------------------------------------------------------------------
  */
  patientForm!: FormGroup;

  constructor(
    readonly fb: FormBuilder,

    readonly patientService: PatientService
  ) {
    this.patientForm = this.fb.group({
      /*
        |--------------------------------------------------------------------------
        | Basic Information
        |--------------------------------------------------------------------------
        */
      firstName: ['', Validators.required],

      lastName: ['', Validators.required],

      dateOfBirth: ['', Validators.required],

      gender: ['', Validators.required],

      bloodGroup: [''],

      maritalStatus: [''],

      /*
        |--------------------------------------------------------------------------
        | Contact Information
        |--------------------------------------------------------------------------
        */
      countryCode: ['+91', Validators.required],

      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],

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
      emergencyContactName: [''],

      emergencyContactPhone: [''],

      relationship: [''],

      /*
        |--------------------------------------------------------------------------
        | Medical Information
        |--------------------------------------------------------------------------
        */
      medicalHistory: [''],

      allergies: [''],

      chronicDiseases: [''],

      currentMedications: [''],

      pastSurgeries: [''],

      familyMedicalHistory: [''],

      /*
        |--------------------------------------------------------------------------
        | Insurance Information
        |--------------------------------------------------------------------------
        */
      insuranceProvider: [''],

      insurancePolicyNumber: [''],

      insuranceExpiryDate: [''],

      insuranceCoverageAmount: [''],

      /*
        |--------------------------------------------------------------------------
        | Hospital Information
        |--------------------------------------------------------------------------
        */
      department: [''],

      patientType: ['OPD']
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Next Step
  |--------------------------------------------------------------------------
  */
  nextStep(): void {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Previous Step
  |--------------------------------------------------------------------------
  */
  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */
  onSubmit(): void {
    console.log('Register Patient Clicked');

    console.log(this.patientForm.value);

    if (this.patientForm.invalid) {
      console.log('FORM INVALID');

      Object.keys(this.patientForm.controls).forEach((key) => {
        const control = this.patientForm.get(key);

        if (control?.invalid) {
          console.log(
            key,

            control.errors
          );
        }
      });

      this.patientForm.markAllAsTouched();

      return;
    }

    this.isSubmitting = true;

    this.patientService
      .createPatient(this.patientForm.value)

      .subscribe({
        next: (response) => {
          console.log(response);

          alert('Patient Registered Successfully');

          /*
          |--------------------------------------------------------------------------
          | Reset Form
          |--------------------------------------------------------------------------
          */
          this.patientForm.reset();

          /*
          |--------------------------------------------------------------------------
          | Default Values After Reset
          |--------------------------------------------------------------------------
          */
          this.patientForm.patchValue({
            countryCode: '+91',

            country: 'India',

            patientType: 'OPD'
          });

          /*
          |--------------------------------------------------------------------------
          | Reset UI
          |--------------------------------------------------------------------------
          */
          this.currentStep = 1;

          this.isSubmitting = false;
        },

        error: (error) => {
          console.log(error);

          this.isSubmitting = false;
        }
      });
  }
}
