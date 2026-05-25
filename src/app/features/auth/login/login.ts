import { Component } from '@angular/core';
import { RouterLink, } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth';

import { TokenService } from '../../../core/services/token';

@Component({
  selector: 'app-login',

  imports: [ReactiveFormsModule, RouterLink],

  templateUrl: './login.html',

  styleUrl: './login.css',
})
export class Login {

  loginForm: FormGroup;

  isSubmitting = false;

  errorMessage = '';

  constructor(
    private fb: FormBuilder,

    private authService: AuthService,

    private tokenService: TokenService,

    private router: Router,
  ) {

    this.loginForm = this.fb.group({
      loginId: ['', Validators.required],

      password: ['', Validators.required],
    });
  }

  onSubmit(): void {

    console.log('Login button clicked');

    if (this.loginForm.invalid) {

      console.log('Form invalid');

      this.loginForm.markAllAsTouched();

      return;
    }

    console.log('Calling login API');
    console.log(
      this.loginForm.value,
    );


    this.authService.login(
      this.loginForm.value,
    ).subscribe({

      next: (response) => {

        console.log('API SUCCESS');

        console.log(response);

        const token =
          response?.data?.token;

        console.log('TOKEN:', token);

        if (!token) {

          console.log('Token missing');

          return;
        }

        this.tokenService.setToken(token);
        localStorage.setItem(

          'role',

          response.data.user
            .roles[0],
        );
        localStorage.setItem(
          'loginId',
          this.loginForm.value.loginId,
        );

        console.log('Navigating dashboard');

        const isFirstLogin =
          response.data.user
            .isFirstLogin;

        if (isFirstLogin) {

          this.router.navigate([
            '/create-password',
          ]);

          return;
        }

        this.router.navigate([
          '/dashboard',
        ]);
      },

      error: (error) => {

        console.log('API ERROR');

        console.log(error);

        this.errorMessage =
          error?.error?.message ||
          'Login failed';
      },
    });
  }
}