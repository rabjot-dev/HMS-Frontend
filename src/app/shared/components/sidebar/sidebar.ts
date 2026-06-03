import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterLink, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-sidebar',

  standalone: true,

  imports: [CommonModule, RouterLink],

  templateUrl: './sidebar.html',

  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {
  role = '';

  constructor(
    readonly router: Router,

    readonly cdr: ChangeDetectorRef
  ) {}

  /*
  |--------------------------------------------------------------------------
  | On Init
  |--------------------------------------------------------------------------
  */
  ngOnInit(): void {
    this.loadRole();

    /*
    |--------------------------------------------------------------------------
    | Detect Route Changes
    |--------------------------------------------------------------------------
    */
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadRole();

        this.cdr.detectChanges();
      }
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Load Role
  |--------------------------------------------------------------------------
  */
  loadRole(): void {
    this.role = localStorage.getItem('role') || '';

    console.log(this.role);
  }

  /*
  |--------------------------------------------------------------------------
  | Role Checks
  |--------------------------------------------------------------------------
  */
  isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  isDoctor(): boolean {
    return this.role === 'DOCTOR';
  }

  isNurse(): boolean {
    return this.role === 'NURSE';
  }

  isReceptionist(): boolean {
    return this.role === 'RECEPTIONIST';
  }

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */
  logout(): void {
    localStorage.clear();

    this.role = '';

    this.cdr.detectChanges();

    this.router.navigate(['/login']);
  }
}
