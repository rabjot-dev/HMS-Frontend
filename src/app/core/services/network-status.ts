import { Injectable, NgZone, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {
  readonly online = signal<boolean>(navigator.onLine);

  constructor(private readonly zone: NgZone) {
    window.addEventListener('online', () => this.update(true));
    window.addEventListener('offline', () => this.update(false));
  }

  private update(online: boolean): void {
    this.zone.run(() => this.online.set(online));
  }
}
