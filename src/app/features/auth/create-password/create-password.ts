import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../../core/services/token';
import { AuthService } from '../../../core/services/auth';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-password',

  imports: [ReactiveFormsModule],

  templateUrl: './create-password.html',

  styleUrl: './create-password.css'
})
export class CreatePassword {
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private tokenService: TokenService,
    private authService: AuthService
  ) {
    this.passwordForm = this.fb.group({
      temporaryPassword: ['', Validators.required],

      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
        ]
      ],

      confirmPassword: ['', Validators.required],
      securityQuestion: ['', Validators.required],

      securityAnswer: ['', Validators.required]
    });
  }
  onSubmit(): void {
    if (this.passwordForm.invalid) {
      return;
    }
    if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const payload = {
      loginId: localStorage.getItem('loginId'),

      temporaryPassword: this.passwordForm.value.temporaryPassword,

      newPassword: this.passwordForm.value.newPassword,

      confirmPassword: this.passwordForm.value.confirmPassword,
      securityQuestion: this.passwordForm.value.securityQuestion,

      securityAnswer: this.passwordForm.value.securityAnswer
    };

    this.authService.createPassword(payload).subscribe({
      next: (response) => {
        console.log(response);

        this.tokenService.removeToken();

        this.router.navigate(['/login']);
      },

      error: (error) => {
        console.log(error);

        console.log(error.error.errors);
      }
    });
  }
  securityQuestions = [
    'What is your favourite color?',

    'What is your pet name?',

    'What is your birth city?',

    'What is your favourite food?',

    'What is your school name?'
  ];
}
