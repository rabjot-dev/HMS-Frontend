import { Component, HostListener, ElementRef, ChangeDetectorRef, OnInit } from '@angular/core';

import { Router, RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';

import { AuthService } from '../../core/services/auth';
import { TokenService } from '../../core/services/token';
import { ToastService } from '../../core/services/toast';
import { MenuNode, MenuNodeService } from '../../core/services/menu-node';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, AsyncPipe, RouterLinkActive],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css'
})
export class DashboardLayout implements OnInit {
  isProfileOpen = false;
  menuNodes: MenuNode[] = [];

  constructor(
    public authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly menuNodeService: MenuNodeService,
    private readonly router: Router,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
    private readonly elementRef: ElementRef
  ) {}

  // Load current user details
  ngOnInit(): void {
    this.authService.loadCurrentUser();
    this.loadMenuNodes();
  }

  loadMenuNodes(): void {
    this.menuNodeService.getMyMenu().subscribe({
      next: (response) => {
        this.menuNodes = response.data;
      },
      error: () => {
        this.menuNodes = [];
      }
    });
  }

  // Close active toast
  dismissToast(): void {
    this.toastService.toast$.next(null);
  }

  // Toggle profile dropdown
  toggleProfile(): void {
    this.isProfileOpen = !this.isProfileOpen;
  }

  // Close dropdown when clicked outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.isProfileOpen = false;
    }
  }

  // Logout user
  logout(): void {
   const refreshToken =
  this.tokenService.getRefreshToken();

this.authService
  .logout(refreshToken!)
  .subscribe();

this.tokenService.removeTokens();

    this.authService.currentUser.next(null);

    this.router.navigate(['/login']);

    this.cdr.detectChanges();
  }
}
