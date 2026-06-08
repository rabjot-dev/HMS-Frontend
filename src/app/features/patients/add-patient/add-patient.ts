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
  /*
  |--------------------------------------------------------------------------
  | Basic Information
  |--------------------------------------------------------------------------
  */
  firstName: [
    '',
    [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
      Validators.pattern(/^[A-Za-z\s'-]+$/)
    ]
  ],

  lastName: [
    '',
    [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
      Validators.pattern(/^[A-Za-z\s'-]+$/)
    ]
  ],

  dateOfBirth: ['', Validators.required],

  gender: ['', Validators.required],

  bloodGroup: [
    '',
    Validators.pattern(/^(A|B|AB|O)[+-]$/)
  ],

  maritalStatus: ['', Validators.required],

  /*
  |--------------------------------------------------------------------------
  | Contact Information
  |--------------------------------------------------------------------------
  */
  countryCode: [
    '+91',
    [
      Validators.required,
      Validators.pattern(/^\+\d{1,4}$/)
    ]
  ],

  phone: [
    '',
    [
      Validators.required,
      Validators.pattern(/^[0-9]{10}$/)
    ]
  ],

  email: [
    '',
    [
      Validators.required,
      Validators.email
    ]
  ],

  address: [
    '',
    [
      Validators.required,
      Validators.maxLength(250)
    ]
  ],

  city: [
    '',
    [
      Validators.required,
      Validators.maxLength(100),
      Validators.pattern(/^[A-Za-z\s'-]+$/)
    ]
  ],

  state: [
    '',
    [
      Validators.required,
      Validators.maxLength(100),
      Validators.pattern(/^[A-Za-z\s'-]+$/)
    ]
  ],

  pincode: [
    '',
    [
      Validators.required,
      Validators.pattern(/^[0-9]{6}$/)
    ]
  ],

  country: [
    'India',
    [
      Validators.maxLength(100),
      Validators.pattern(/^[A-Za-z\s'-]+$/)
    ]
  ],

  /*
  |--------------------------------------------------------------------------
  | Emergency Contact
  |--------------------------------------------------------------------------
  */
  emergencyContactName: [
    '',
    [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
      Validators.pattern(/^[A-Za-z\s'-]+$/)
    ]
  ],

  emergencyContactPhone: [
    '',
    [
      Validators.required,
      Validators.pattern(/^[0-9]{10}$/)
    ]
  ],

  relationship: [
    '',
    [
      Validators.maxLength(50),
      Validators.pattern(/^[A-Za-z\s'-]*$/)
    ]
  ],

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

  insuranceCoverageAmount: [
    '',
    Validators.pattern(/^\d+(\.\d{1,2})?$/)
  ],

  /*
  |--------------------------------------------------------------------------
  | Hospital Information
  |--------------------------------------------------------------------------
  */
  department: [''],

  patientType: [
    '',
    Validators.required
  ]
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

    let isStepValid = true;

    for (const field of fieldsToValidate) {
      const control = this.patientForm.get(field);
      control?.markAsTouched();

      if (!control?.valid) {
        isStepValid = false;
        break;
      }
    }

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
