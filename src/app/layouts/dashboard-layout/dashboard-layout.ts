import { Component }
from '@angular/core';
import { Router }
from '@angular/router';
import { TokenService }
from '../../core/services/token';
import { ChangeDetectorRef } from '@angular/core';
import {
  RouterLinkActive,
} from '@angular/router';

import {
  RouterLink,
  RouterOutlet,
} from '@angular/router';

import {
  AsyncPipe,
} from '@angular/common';

import { AuthService }
from '../../core/services/auth';

@Component({
  selector: 'app-dashboard-layout',

  imports: [
    RouterOutlet,
    RouterLink,
    AsyncPipe,
    RouterLinkActive,

      
  ],

  templateUrl:
    './dashboard-layout.html',

  styleUrl:
    './dashboard-layout.css',
})
export class DashboardLayout {

constructor(

  public authService:
    AuthService,

  private tokenService:
    TokenService,

  private router: Router,
  private cdr: ChangeDetectorRef,

) {}
logout(): void {

  this.tokenService.removeToken();

  this.authService.currentUser
    .next(null);

  this.router.navigate(['/login']);
  this.cdr.detectChanges();
}
}