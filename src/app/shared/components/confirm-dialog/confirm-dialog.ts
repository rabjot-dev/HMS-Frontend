import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [AsyncPipe, NgClass],
  templateUrl: './confirm-dialog.html',
  styleUrls: ['./confirm-dialog.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {
  readonly dialog$;

  constructor(private readonly confirmDialog: ConfirmDialogService) {
    this.dialog$ = this.confirmDialog.dialog$;
  }

  cancel(): void {
    this.confirmDialog.close(false);
  }

  confirm(): void {
    this.confirmDialog.close(true);
  }
}
