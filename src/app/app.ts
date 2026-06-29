import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, NgClass } from '@angular/common';
import { Observable } from 'rxjs';
import { ToastService, ToastState } from './core/services/toast';
import { AuthService } from './core/services/auth';
import { NodeService } from './core/services/node';
import { TokenService } from './core/services/token';
import { NetworkStatusService } from './core/services/network-status';
import { OfflineQueueService } from './core/services/offline-queue';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog';
import { InputDialogComponent } from './shared/components/input-dialog/input-dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, NgClass, ConfirmDialogComponent, InputDialogComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit {
  toastState$: Observable<ToastState | null>;
  online$: Observable<boolean>;

  constructor(
    private readonly toastService: ToastService,
    private readonly authService: AuthService,
    private readonly nodeService: NodeService,
    private readonly tokenService: TokenService,
    private readonly networkStatus: NetworkStatusService,
    private readonly offlineQueue: OfflineQueueService
  ) {
    this.toastState$ = this.toastService.toast$;
    this.online$ = this.networkStatus.online$;
  }

  ngOnInit(): void {
    const token = this.tokenService.getAccessToken();

    if (!token) {
      return;
    }

    if (!this.authService.currentUser.value) {
      this.authService.loadCurrentUser();
    }

    if (!this.nodeService.nodes.value.length) {
      this.nodeService.loadNodes();
    }
  }

  dismissToast(): void {
    this.toastService.toast$.next(null);
  }
}
