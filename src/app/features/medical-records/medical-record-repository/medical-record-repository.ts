import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MedicalRecordService } from '../../../core/services/medical-record';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-medical-record-repository',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginationComponent],
  templateUrl: './medical-record-repository.html',
  styleUrl: './medical-record-repository.css'
})
export class MedicalRecordRepository implements OnInit {
  patients: any[] = [];
  isLoading = false;
  pagination = {
    page: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  };

  constructor(
    private readonly medicalRecordService: MedicalRecordService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.isLoading = true;

    this.medicalRecordService
      .getRecordPatients(this.pagination.page, this.pagination.limit)
      .subscribe({
        next: (response) => {
          this.patients = response.data || [];
          this.pagination = response.pagination || this.pagination;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.patients = [];
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  previousPage(): void {
    if (!this.pagination.hasPreviousPage) {
      return;
    }

    this.pagination.page -= 1;
    this.loadPatients();
  }

  nextPage(): void {
    if (!this.pagination.hasNextPage) {
      return;
    }

    this.pagination.page += 1;
    this.loadPatients();
  }

  onLimitChange(limit: number): void {
    this.pagination = {
      ...this.pagination,
      page: 1,
      limit
    };
    this.loadPatients();
  }
}
