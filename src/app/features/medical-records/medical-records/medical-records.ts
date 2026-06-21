import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';

import { MedicalRecordService } from '../../../core/services/medical-record';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-medical-records',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent],
  templateUrl: './medical-records.html',
  styleUrl: './medical-records.css'
})
export class MedicalRecords implements OnInit, OnDestroy {
  activeTab: 'prescriptions' | 'labReports' = 'prescriptions';
  prescriptions: any[] = [];
  labReports: any[] = [];
  isLoading = false;
  patientId = '';

  searchTerm = '';
  fromDate = '';
  toDate = '';
  sortBy = 'createdAt';
  sortOrder = 'desc';

  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

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
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('patientId') || '';
    this.loadPrescriptions();
  }

  ngOnDestroy(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  setActiveTab(tab: 'prescriptions' | 'labReports'): void {
    this.activeTab = tab;

    if (tab === 'prescriptions') {
      this.loadPrescriptions(1);
      return;
    }

    this.loadLabReports();
  }

  loadPrescriptions(page = this.pagination.page): void {
    this.isLoading = true;

    const filters = {
      search: this.searchTerm,
      fromDate: this.fromDate,
      toDate: this.toDate,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    };

    const request$ = this.patientId
      ? this.medicalRecordService.getPatientPrescriptions(
          this.patientId,
          page,
          this.pagination.limit,
          filters
        )
      : this.medicalRecordService.getPrescriptions(
          page,
          this.pagination.limit,
          filters
        );

    request$.subscribe({
        next: (response) => {
          this.prescriptions = response.data || [];
          this.pagination = response.pagination || this.pagination;
          this.isLoading = false;
        },
        error: (error) => {
          console.log(error);
          this.isLoading = false;
        }
      });
  }

  loadLabReports(): void {
    this.isLoading = true;

    this.medicalRecordService.getLabReports().subscribe({
      next: (response) => {
        this.labReports = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
        this.labReports = [];
        this.isLoading = false;
      }
    });
  }

  previousPage(): void {
    if (this.pagination.hasPreviousPage) {
      this.loadPrescriptions(this.pagination.page - 1);
    }
  }

  nextPage(): void {
    if (this.pagination.hasNextPage) {
      this.loadPrescriptions(this.pagination.page + 1);
    }
  }

  changeLimit(limit: number): void {
    this.pagination.limit = Number(limit);
    this.loadPrescriptions(1);
  }

  onSearchInput(value: string): void {
    this.searchTerm = value;

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.loadPrescriptions(1);
    }, 500);
  }

  onFilterChange(): void {
    this.loadPrescriptions(1);
  }
}
