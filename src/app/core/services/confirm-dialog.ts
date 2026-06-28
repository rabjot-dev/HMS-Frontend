import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ConfirmDialogState {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  tone: 'danger' | 'primary';
  resolve: (confirmed: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  readonly dialog$ = new BehaviorSubject<ConfirmDialogState | null>(null);

  confirm(options: Partial<Omit<ConfirmDialogState, 'resolve'>>): Promise<boolean> {
    return new Promise((resolve) => {
      this.dialog$.next({
        title: options.title || 'Confirm action',
        message: options.message || 'Are you sure you want to continue?',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        tone: options.tone || 'primary',
        resolve
      });
    });
  }

  close(confirmed: boolean): void {
    const current = this.dialog$.value;

    if (!current) {
      return;
    }

    current.resolve(confirmed);
    this.dialog$.next(null);
  }
}
