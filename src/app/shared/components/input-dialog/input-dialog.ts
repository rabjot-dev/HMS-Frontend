import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputDialogService } from '../../../core/services/input-dialog';

@Component({
  selector: 'app-input-dialog',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  templateUrl: './input-dialog.html',
  styleUrls: ['./input-dialog.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputDialogComponent {
  readonly dialog$;
  value = '';

  constructor(
    private readonly inputDialog: InputDialogService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.dialog$ = this.inputDialog.dialog$;
    this.dialog$.subscribe(() => {
      this.value = '';
      this.cdr.markForCheck();
    });
  }

  cancel(): void {
    this.inputDialog.close(null);
  }

  submit(): void {
    this.inputDialog.close(this.value.trim());
  }
}
