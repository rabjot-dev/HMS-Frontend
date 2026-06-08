import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
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

  currentStep = 1;

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
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.registerForm = this.fb.group({
      /*
      |------------------------------------------------------------------
      | Basic Details
      |------------------------------------------------------------------
      */
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
          Validators.pattern('^[A-Za-z ]+$')
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      gender: ['', Validators.required],

      countryCode: ['+91', Validators.required],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$')
        ]
      ],

      department: ['', Validators.required],

      designation: ['', Validators.required],

      joiningDate: ['', Validators.required],

      /*
      |------------------------------------------------------------------
      | Doctor Fields
      |------------------------------------------------------------------
      */
      qualification: [''],

      specialization: [''],

      medicalRegistrationNo: [''],

      consultationFee: [''],

      /*
      |------------------------------------------------------------------
      | Security
      |------------------------------------------------------------------
      */
      securityQuestion: ['', Validators.required],

      securityAnswer: ['', Validators.required],

      /*
      |------------------------------------------------------------------
      | Password
      |------------------------------------------------------------------
      */
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            String.raw`^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,20}$`
          )
        ]
      ],

      confirmPassword: ['', Validators.required]
    });

    /*
    |------------------------------------------------------------------
    | Dynamic Doctor Validators
    |------------------------------------------------------------------
    */
    this.registerForm
      .get('designation')
      ?.valueChanges.subscribe((designation) => {
        const doctorFields = [
          'qualification',
          'specialization',
          'medicalRegistrationNo',
          'consultationFee'
        ];

        if (designation === 'DOCTOR') {
          doctorFields.forEach((field) => {
            this.registerForm
              .get(field)
              ?.setValidators([Validators.required]);

            this.registerForm
              .get(field)
              ?.updateValueAndValidity();
          });
        } else {
          doctorFields.forEach((field) => {
            this.registerForm
              .get(field)
              ?.clearValidators();

            this.registerForm
              .get(field)
              ?.setValue('');

            this.registerForm
              .get(field)
              ?.updateValueAndValidity();
          });
        }
      });
  }

  /*
  |------------------------------------------------------------------
  | Check Doctor
  |------------------------------------------------------------------
  */
  isDoctor(): boolean {
    return (
      this.registerForm.get('designation')?.value ===
      'DOCTOR'
    );
  }

  /*
  |------------------------------------------------------------------
  | Previous Step
  |------------------------------------------------------------------
  */
  prevStep(): void {
    this.currentStep--;
  }

  /*
  |------------------------------------------------------------------
  | Submit
  |------------------------------------------------------------------
  */
  onSubmit(): void {
    console.log('REGISTER BUTTON CLICKED');

    console.log(
      'FORM VALID',
      this.registerForm.valid
    );

    Object.keys(this.registerForm.controls).forEach(
      (key) => {
        const control =
          this.registerForm.get(key);

        if (control?.invalid) {
          console.log(
            key,
            control.errors
          );
        }
      }
    );

    const step3Fields = [
      'password',
      'confirmPassword',
      'securityQuestion',
      'securityAnswer'
    ];

    step3Fields.forEach((field) =>
      this.registerForm
        .get(field)
        ?.markAsTouched()
    );

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();

      return;
    }

    if (
      this.registerForm.value.password !==
      this.registerForm.value.confirmPassword
    ) {
      this.errorMessage =
        'Passwords do not match';

      return;
    }

    this.isSubmitting = true;

    this.errorMessage = '';

    this.successMessage = '';

    const payload = {
      ...this.registerForm.value
    };

    this.authService
      .register(payload)
      .subscribe({
        next: (response: any) => {
          console.log(response);

          this.isSubmitting = false;

          this.successMessage =
            'Registration submitted successfully. Wait for admin approval.';
            this.cdr.detectChanges();

          this.registerForm.reset();

          this.registerForm.patchValue({
            countryCode: '+91'
          });

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2500);
        },

        error: (error) => {
  console.log(error);

  this.isSubmitting = false;

  this.successMessage = '';

  this.errorMessage =
    error?.error?.message ||
    'Registration failed';

  console.log('ERROR MESSAGE');
  console.log(this.errorMessage);

  this.cdr.detectChanges();
}
      });
  }
}