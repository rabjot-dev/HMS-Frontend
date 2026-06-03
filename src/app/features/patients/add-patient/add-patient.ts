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
  currentStep = 1;

  isSubmitting = false;

  patientForm!: FormGroup;

  constructor(
    private fb: FormBuilder,

    private patientService: PatientService
  ) {
    this.patientForm = this.fb.group({
      firstName: ['', Validators.required],

      lastName: ['', Validators.required],

      dateOfBirth: ['', Validators.required],

      gender: ['', Validators.required],

      bloodGroup: ['', Validators.required],

      maritalStatus: ['', Validators.required],

      /*
      |--------------------------------------------------------------------------
      | Contact Information
      |--------------------------------------------------------------------------
      */
      countryCode: ['+91', Validators.required],

      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],

      email: ['', Validators.required],

      address: ['', Validators.required],

      city: ['', Validators.required],

      state: ['', Validators.required],

      pincode: ['', Validators.required],

      country: ['India'],

      /*
      |--------------------------------------------------------------------------
      | Emergency Contact
      |--------------------------------------------------------------------------
      */
      emergencyContactName: ['', Validators.required],

      emergencyContactPhone: ['', Validators.required],

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

      patientType: ['', Validators.required]
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Next Step — Validates only current step fields before proceeding
  |--------------------------------------------------------------------------
  */
  nextStep(): void {
    const stepFields: { [key: number]: string[] } = {
      1: ['firstName', 'lastName', 'dateOfBirth', 'gender', 'bloodGroup', 'maritalStatus'],
      2: ['phone', 'email', 'address', 'city', 'state', 'pincode', 'emergencyContactName', 'emergencyContactPhone'],
      3: [],
      4: ['patientType']
    };

    const fieldsToValidate = stepFields[this.currentStep] || [];

    // Mark only current step fields as touched to show errors
    fieldsToValidate.forEach((field) => {
      this.patientForm.get(field)?.markAsTouched();
    });

    // Check if all current step fields are valid
    const isStepValid = fieldsToValidate.every((field) => this.patientForm.get(field)?.valid);

    if (!isStepValid) {
      return; // Block navigation if invalid
    }

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

    // Mark patientType as touched to show error if not selected
    this.patientForm.get('patientType')?.markAsTouched();

    if (this.patientForm.get('patientType')?.invalid) {
      return;
    }

    if (this.patientForm.invalid) {
      console.log('FORM INVALID');

      Object.keys(this.patientForm.controls).forEach((key) => {
        const control = this.patientForm.get(key);

        if (control?.invalid) {
          console.log(key, control.errors);
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

            patientType: ''
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
          alert(error?.error?.message || 'Failed to register patient');
        }
      });
  }
}
