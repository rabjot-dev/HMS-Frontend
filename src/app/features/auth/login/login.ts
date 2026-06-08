import { Component, ChangeDetectorRef } from '@angular/core';

import { RouterLink, Router } from '@angular/router';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../../core/services/auth';

import { TokenService } from '../../../core/services/token';

@Component({
  selector: 'app-login',

  standalone: true,

  imports: [ReactiveFormsModule, RouterLink],

  templateUrl: './login.html',

  styleUrl: './login.css'
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
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      loginId: ['', Validators.required],

      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    console.log('Login button clicked');

    if (this.loginForm.invalid) {
      console.log('Form invalid');

      this.loginForm.markAllAsTouched();

      return;
    }

    this.isSubmitting = true;

    this.errorMessage = '';

    console.log('Calling login API');

    console.log(this.loginForm.value);

    this.authService
      .login(this.loginForm.value)

      .subscribe({
        next: (response: any) => {
          console.log('API SUCCESS');

          console.log(response);

          const token = response?.data?.token;

          console.log('TOKEN:', token);

          if (!token) {
            console.log('Token missing');

            return;
          }

          this.tokenService.setToken(token);
          this.authService.currentUser.next(
  response.data.user
);

          localStorage.setItem(
            'role',

            response.data.user.roles?.[0]
          );

          localStorage.setItem(
            'loginId',

            this.loginForm.value.loginId
          );

          const isFirstLogin = response.data.user.isFirstLogin;

          if (isFirstLogin) {
            this.router.navigate(['/create-password']);

            return;
          }

          const role = response.data.user.roles?.[0];

          if (role === 'ADMIN') {
            this.router
              .navigate(['/dashboard/admin'])

          } else if (role === 'DOCTOR') {
            this.router
              .navigate(['/dashboard/doctor'])

          } else if (role === 'RECEPTIONIST') {
            this.router
              .navigate(['/dashboard/receptionist'])

          } else {
            this.router.navigate(['/login']);
          }

          this.isSubmitting = false;
        },

        error: (error) => {
          console.log('API ERROR');

          console.log(error);

          this.errorMessage = error?.error?.message || 'Login failed';

          this.isSubmitting = false;
          this.cdr.detectChanges();
        }
      });
  }
}
