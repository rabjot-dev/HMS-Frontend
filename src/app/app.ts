import { Component, OnInit } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { AuthService } from './core/services/auth';

import { TokenService } from './core/services/token';

@Component({
  selector: 'app-root',

  imports: [RouterOutlet],

  templateUrl: './app.html',

  styleUrl: './app.css'
})
export class App implements OnInit {
  constructor(
    private authService: AuthService,

    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    const token = this.tokenService.getToken();

    if (token) {
      this.authService.loadCurrentUser();
    }
  }
}
