import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {
  readonly online$ = new BehaviorSubject<boolean>(navigator.onLine);

  constructor(private readonly zone: NgZone) {
    window.addEventListener('online', () => this.update(true));
    window.addEventListener('offline', () => this.update(false));
  }

  private update(online: boolean): void {
    this.zone.run(() => this.online$.next(online));
  }
}
