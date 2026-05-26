import { Component, HostListener, ElementRef } from '@angular/core';

import { Router } from '@angular/router';

import { TokenService } from '../../core/services/token';

import { ChangeDetectorRef } from '@angular/core';

import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';

import { AsyncPipe } from '@angular/common';

import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-dashboard-layout',

  standalone: true,

  imports: [RouterOutlet, RouterLink, AsyncPipe, RouterLinkActive],

  templateUrl: './dashboard-layout.html',

  styleUrl: './dashboard-layout.css'
})
export class DashboardLayout {
  /*
  |--------------------------------------------------------------------------
  | Profile Dropdown
  |--------------------------------------------------------------------------
  */
  isProfileOpen = false;

  constructor(
    public authService: AuthService,

    private tokenService: TokenService,

    private router: Router,

    private cdr: ChangeDetectorRef,

    private elementRef: ElementRef
  ) {}

  /*
  |--------------------------------------------------------------------------
  | Toggle Dropdown
  |--------------------------------------------------------------------------
  */
  toggleProfile(): void {
    this.isProfileOpen = !this.isProfileOpen;
  }

  /*
  |--------------------------------------------------------------------------
  | Close On Outside Click
  |--------------------------------------------------------------------------
  */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.isProfileOpen = false;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */
  logout(): void {
    this.tokenService.removeToken();

    this.authService.currentUser.next(null);

    this.router.navigate(['/login']);

    this.cdr.detectChanges();
  }
}
