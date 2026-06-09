import { Component, HostListener, ElementRef, ChangeDetectorRef, OnInit } from '@angular/core';

import { Router, RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';

import { TokenService } from '../../core/services/token';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { ToastService } from '../../core/services/toast';

@Component({
  selector: 'app-dashboard-layout',

  standalone: true,

  imports: [RouterOutlet, RouterLink, AsyncPipe, RouterLinkActive,],

  templateUrl: './dashboard-layout.html',

  styleUrl: './dashboard-layout.css'
})
export class DashboardLayout implements OnInit {
  /*
  |--------------------------------------------------------------------------
  | Profile Dropdown
  |--------------------------------------------------------------------------
  */
  isProfileOpen = false;

  constructor(
    public authService: AuthService,

    private readonly tokenService: TokenService,

    private readonly router: Router,
    private readonly toastService: ToastService,

    private readonly cdr: ChangeDetectorRef,

    private readonly elementRef: ElementRef
  ) {}
  ngOnInit(): void {
    this.authService.loadCurrentUser();
  }

  dismissToast(): void {
    this.toastService.toast$.next(null);
  }
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
