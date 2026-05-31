import { Component, HostListener, ElementRef } from '@angular/core';

import { Router } from '@angular/router';

import { TokenService } from '../../core/services/token';

import { ChangeDetectorRef } from '@angular/core';

import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { AsyncPipe } from '@angular/common';

import { AuthService } from '../../core/services/auth';
import { ToastService ,ToastState} from '../../core/services/toast.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-dashboard-layout',

  standalone: true,

  imports: [RouterOutlet, RouterLink, AsyncPipe, RouterLinkActive,NgClass],

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
 toastState$: Observable<ToastState | null>;
  constructor(
    public authService: AuthService,

    private tokenService: TokenService,

    private router: Router,

    private cdr: ChangeDetectorRef,

    private elementRef: ElementRef,
     private toastService: ToastService ,
  ) {
    this.toastState$ = this.toastService.toast$;
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
