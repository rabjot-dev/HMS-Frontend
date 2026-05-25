import {
  Component,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  Router,
  RouterLink,
} from '@angular/router';

import {
  AuthService,
} from '../../../core/services/auth';

@Component({
  selector:
    'app-register',

  standalone: true,

  imports: [

    CommonModule,

    ReactiveFormsModule,

    RouterLink,
  ],

  templateUrl:
    './register.html',

  styleUrl:
    './register.css',
})
export class Register {

  registerForm:
    FormGroup;

  isSubmitting =
    false;

  successMessage =
    '';

  errorMessage =
    '';

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

    'What is your school name?',
  ];

  constructor(

    private fb:
      FormBuilder,

    private authService:
      AuthService,

    private router:
      Router,
  ) {

    this.registerForm =
      this.fb.group({

        /*
        |--------------------------------------------------------------------------
        | Basic Details
        |--------------------------------------------------------------------------
        */
        name: [

          '',

          Validators.required,
        ],

        email: [

          '',

          [
            Validators.required,

            Validators.email,
          ],
        ],

        countryCode: [

          '+91',

          Validators.required,
        ],
        phone: [

          '',

          [

            Validators.required,

            Validators.pattern(
              '^[0-9]{10}$'
            ),
          ],
        ],

        department: [

          '',

          Validators.required,
        ],

        designation: [

          '',

          Validators.required,
        ],

        joiningDate: [

          '',

          Validators.required,
        ],

        /*
        |--------------------------------------------------------------------------
        | Doctor Fields
        |--------------------------------------------------------------------------
        */
        qualification: [''],

        specialization: [''],

        medicalRegistrationNo: [''],

        consultationFee: [''],

        /*
        |--------------------------------------------------------------------------
        | Security Question
        |--------------------------------------------------------------------------
        */
        securityQuestion: [

          '',

          Validators.required,
        ],

        securityAnswer: [

          '',

          Validators.required,
        ],

        /*
        |--------------------------------------------------------------------------
        | Password
        |--------------------------------------------------------------------------
        */
        password: [

          '',

          [
            Validators.required,

            Validators.minLength(6),
          ],
        ],

        confirmPassword: [

          '',

          Validators.required,
        ],
        gender: [

          '',

          Validators.required,
        ],
      });
  }

  /*
  |--------------------------------------------------------------------------
  | Check Doctor
  |--------------------------------------------------------------------------
  */
  isDoctor(): boolean {

    return (

      this.registerForm.value
        .designation ===
      'DOCTOR'
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Submit Form
  |--------------------------------------------------------------------------
  */
  onSubmit(): void {

    /*
    |--------------------------------------------------------------------------
    | Form Validation
    |--------------------------------------------------------------------------
    */
    if (
      this.registerForm.invalid
    ) {

      this.registerForm
        .markAllAsTouched();

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Password Match Validation
    |--------------------------------------------------------------------------
    */
    if (

      this.registerForm.value
        .password

      !==

      this.registerForm.value
        .confirmPassword
    ) {

      this.errorMessage =

        'Passwords do not match';

      return;
    }

    this.isSubmitting =
      true;

    this.errorMessage =
      '';

    this.successMessage =
      '';

    /*
    |--------------------------------------------------------------------------
    | Payload
    |--------------------------------------------------------------------------
    */
    const payload = {

      ...this.registerForm
        .value,
    };

    /*
    |--------------------------------------------------------------------------
    | Register API
    |--------------------------------------------------------------------------
    */
    this.authService
      .register(
        payload,
      )

      .subscribe({

        next: (
          response: any,
        ) => {

          console.log(
            response,
          );

          this.isSubmitting =
            false;

          this.successMessage =

            'Registration submitted successfully. Wait for admin approval.';

          /*
          |--------------------------------------------------------------------------
          | Reset Form
          |--------------------------------------------------------------------------
          */
          this.registerForm
            .reset();

          /*
          |--------------------------------------------------------------------------
          | Redirect
          |--------------------------------------------------------------------------
          */
          setTimeout(() => {

            this.router.navigate([
              '/login',
            ]);

          }, 2500);
        },

        error: (
          error,
        ) => {

          console.log(
            error,
          );

          this.isSubmitting =
            false;

          this.errorMessage =

            error
              ?.error
              ?.message

            ||

            'Registration failed';
        },
      });
  }
}