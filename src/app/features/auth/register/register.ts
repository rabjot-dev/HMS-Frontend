import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  /*
  |--------------------------------------------------------------------------
  | Multi Step — 3 steps total
  |--------------------------------------------------------------------------
  */
  currentStep = 1;
  totalSteps = 3;

  /*
  |--------------------------------------------------------------------------
  | Security Questions
  |--------------------------------------------------------------------------
  */
  securityQuestions = [
    'What is your favourite color?',
    'What is your pet name?',
    'What is your birth city?',
    'What is your favourite food?',
    'What is your school name?'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      /*
      |--------------------------------------------------------------------------
      | Step 1 — Basic Info
      |--------------------------------------------------------------------------
      */
      name:        ['', Validators.required],
      email:       ['', [Validators.required, Validators.email]],
      gender:      ['', Validators.required],
      countryCode: ['+91', Validators.required],
      phone:       ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      department:  ['', Validators.required],
      designation: ['', Validators.required],

      /*
      |--------------------------------------------------------------------------
      | Doctor Fields (part of Step 1 when designation = DOCTOR)
      |--------------------------------------------------------------------------
      */
      qualification:         [''],
      specialization:        [''],
      medicalRegistrationNo: [''],
      consultationFee:       [''],

      /*
      |--------------------------------------------------------------------------
      | Step 2 — Work Details
      |--------------------------------------------------------------------------
      */
      joiningDate: ['', Validators.required],

      /*
      |--------------------------------------------------------------------------
      | Step 3 — Account & Security
      |--------------------------------------------------------------------------
      */
      securityQuestion: ['', Validators.required],
      securityAnswer:   ['', Validators.required],
      password:         ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword:  ['', Validators.required]
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Step 1 Fields
  |--------------------------------------------------------------------------
  */
  private step1Fields = [
    'name', 'email', 'gender', 'countryCode',
    'phone', 'department', 'designation'
  ];

  private step1DoctorFields = [
    'specialization', 'qualification', 'medicalRegistrationNo'
  ];

  /*
  |--------------------------------------------------------------------------
  | Step 2 Fields
  |--------------------------------------------------------------------------
  */
  private step2Fields = ['joiningDate'];

  /*
  |--------------------------------------------------------------------------
  | Step 3 Fields
  |--------------------------------------------------------------------------
  */
  private step3Fields = [
    'password', 'confirmPassword', 'securityQuestion', 'securityAnswer'
  ];

  /*
  |--------------------------------------------------------------------------
  | Check Doctor
  |--------------------------------------------------------------------------
  */
  isDoctor(): boolean {
    return this.registerForm.value.designation === 'DOCTOR';
  }

  /*
  |--------------------------------------------------------------------------
  | Step Label
  |--------------------------------------------------------------------------
  */
  getStepLabel(step: number): string {
    const labels: Record<number, string> = {
      1: 'Basic Info',
      2: 'Work Details',
      3: 'Account & Security'
    };
    return labels[step] ?? '';
  }

  /*
  |--------------------------------------------------------------------------
  | Validate Current Step & Advance
  |--------------------------------------------------------------------------
  */
  nextStep(): void {
    this.errorMessage = '';

    let fieldsToValidate: string[] = [];

    if (this.currentStep === 1) {
      fieldsToValidate = [...this.step1Fields];
      if (this.isDoctor()) {
        fieldsToValidate = [...fieldsToValidate, ...this.step1DoctorFields];
      }
    } else if (this.currentStep === 2) {
      fieldsToValidate = [...this.step2Fields];
    }

    // Mark fields for the current step as touched so errors show
    fieldsToValidate.forEach(field => this.registerForm.get(field)?.markAsTouched());

    const stepInvalid = fieldsToValidate.some(
      field => this.registerForm.get(field)?.invalid
    );

    if (stepInvalid) {
      this.errorMessage = 'Please fill in all required fields before proceeding.';
      return;
    }

    this.currentStep++;
  }

  /*
  |--------------------------------------------------------------------------
  | Prev Step
  |--------------------------------------------------------------------------
  */
  prevStep(): void {
    this.errorMessage = '';
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Submit Form (Step 3)
  |--------------------------------------------------------------------------
  */
  onSubmit(): void {
    this.step3Fields.forEach(field => this.registerForm.get(field)?.markAsTouched());

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Password Match Validation
    |--------------------------------------------------------------------------
    */
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = { ...this.registerForm.value };

    this.authService.register(payload).subscribe({
      next: (response: any) => {
        console.log(response);
        this.isSubmitting = false;
        this.successMessage = 'Registration submitted successfully. Wait for admin approval.';
        this.registerForm.reset();
        this.currentStep = 1;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2500);
      },
      error: (error) => {
        console.log(error);
        this.isSubmitting = false;
        this.errorMessage = error?.error?.message || 'Registration failed';
      }
    });
  }
}
