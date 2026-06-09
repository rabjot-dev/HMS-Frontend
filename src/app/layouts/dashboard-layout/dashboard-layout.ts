import { Component, HostListener, ElementRef } from '@angular/core';
import { Router,RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { TokenService } from '../../core/services/token';
import { ChangeDetectorRef } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import { AuthService } from '../../core/services/auth';
import { ToastService,} from '../../core/services/toast';

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

    private elementRef: ElementRef,
    private toastService: ToastService
 
  ) {
    
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
