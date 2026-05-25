import {
  Component,
  OnInit,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  RouterLink,
  Router,
} from '@angular/router';

@Component({
  selector:
    'app-sidebar',

  imports: [

    CommonModule,

    RouterLink,
  ],

  templateUrl:
    './sidebar.html',

  styleUrl:
    './sidebar.css',
})
export class Sidebar
implements OnInit {

  role = '';

  constructor(

    private router:
      Router,
  ) {}

  /*
  |--------------------------------------------------------------------------
  | On Init
  |--------------------------------------------------------------------------
  */
  ngOnInit(): void {

    this.role =

      localStorage.getItem(
        'role',
      ) || '';

    console.log(
      this.role,
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Role Checks
  |--------------------------------------------------------------------------
  */
  isAdmin(): boolean {

    return (
      this.role ===
      'ADMIN'
    );
  }

isDoctor(): boolean {

  console.log(
    "Checking Doctor",
  );

  console.log(
    this.role,
  );

  return (
    this.role ===
    'DOCTOR'
  );
}

  isNurse(): boolean {

    return (
      this.role ===
      'NURSE'
    );
  }

  isReceptionist():
  boolean {

    return (
      this.role ===
      'RECEPTIONIST'
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */
  logout(): void {

    localStorage.clear();

    this.router.navigate([
      '/login',
    ]);
  }
}