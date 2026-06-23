import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs';

import { AuthService } from '../../../core/services/auth';
import { MedicalRecordService } from '../../../core/services/medical-record';
import { API_BASE_URL } from '../../../core/constants/api.constants';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';

type MedicalRecordTab = 'prescriptions' | 'healthRecords' | 'labReports';

@Component({
  selector: 'app-medical-records',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent],
  templateUrl: './medical-records.html',
  styleUrl: './medical-records.css'
})
export class MedicalRecords implements OnInit, OnDestroy {
  activeTab: MedicalRecordTab = 'prescriptions';
  prescriptions: any[] = [];
  healthRecords: any[] = [];
  labReports: any[] = [];
  isLoading = false;
  isSavingHealthRecord = false;
  editingHealthRecordId = '';
  healthRecordMessage = '';
  healthRecordError = '';
  patientId = '';

  searchTerm = '';
  fromDate = '';
  toDate = '';
  sortBy = 'createdAt';
  sortOrder = 'desc';
  healthDocumentTypeFilter = '';
  selectedHealthRecordFile: File | null = null;

  documentTypes = [
    'PREVIOUS_DISCHARGE_SUMMARY',
    'LAB_REPORT',
    'SCAN_REPORT',
    'OTHER'
  ];

  healthRecordForm: any = {
    title: '',
    documentType: '',
    documentDate: '',
    notes: ''
  };

  private readonly fileBaseUrl = API_BASE_URL.replace('/api', '');
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
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
    public readonly authService: AuthService
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

  setActiveTab(tab: MedicalRecordTab): void {
    this.activeTab = tab;

    if (tab === 'prescriptions') {
      this.loadPrescriptions(1);
      return;
    }

    if (tab === 'healthRecords') {
      this.loadHealthRecords(1);
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
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  loadLabReports(): void {
    this.isLoading = true;

    this.medicalRecordService.getLabReports().subscribe({
      next: (response) => {
        this.labReports = response.data || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.labReports = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadHealthRecords(page = this.pagination.page): void {
    this.isLoading = true;

    const filters = {
      search: this.searchTerm,
      documentType: this.healthDocumentTypeFilter,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    };

    const request$ = this.patientId
      ? this.medicalRecordService.getPatientHealthRecords(
          this.patientId,
          page,
          this.pagination.limit,
          filters
        )
      : this.medicalRecordService.getHealthRecords(
          page,
          this.pagination.limit,
          filters
        );

    request$.subscribe({
      next: (response) => {
        this.healthRecords = response.data || [];
        this.pagination = response.pagination || this.pagination;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.healthRecords = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  previousPage(): void {
    if (this.pagination.hasPreviousPage) {
      this.loadActivePagedRecords(this.pagination.page - 1);
    }
  }

  nextPage(): void {
    if (this.pagination.hasNextPage) {
      this.loadActivePagedRecords(this.pagination.page + 1);
    }
  }

  changeLimit(limit: number): void {
    this.pagination.limit = Number(limit);
    this.loadActivePagedRecords(1);
  }

  onSearchInput(value: string): void {
    this.searchTerm = value;

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.loadActivePagedRecords(1);
    }, 500);
  }

  onFilterChange(): void {
    this.loadActivePagedRecords(1);
  }

  canManageHealthRecords(): boolean {
    return (
      this.authService.hasRole('ADMIN') ||
      this.authService.hasRole('RECEPTIONIST')
    );
  }

  canDeleteHealthRecords(): boolean {
    return (
      this.authService.hasRole('ADMIN') ||
      this.authService.hasRole('RECEPTIONIST')
    );
  }

  startEditHealthRecord(record: any): void {
    this.editingHealthRecordId = record._id;
    this.healthRecordMessage = '';
    this.healthRecordError = '';

    this.healthRecordForm = {
      title: record.title || '',
      documentType: record.documentType || '',
      documentDate: record.documentDate ? record.documentDate.split('T')[0] : '',
      notes: record.notes || ''
    };
    this.selectedHealthRecordFile = null;
  }

  resetHealthRecordForm(): void {
    this.editingHealthRecordId = '';
    this.healthRecordMessage = '';
    this.healthRecordError = '';
    this.selectedHealthRecordFile = null;
    this.healthRecordForm = {
      title: '',
      documentType: '',
      documentDate: '',
      notes: ''
    };
  }

  saveHealthRecord(): void {
    this.healthRecordMessage = '';
    this.healthRecordError = '';

    if (!this.patientId) {
      this.healthRecordError = 'Select a patient before adding health records.';
      return;
    }

    if (
      !this.healthRecordForm.title ||
      !this.healthRecordForm.documentType ||
      !this.healthRecordForm.documentDate
    ) {
      this.healthRecordError = 'Title, document type and document date are required.';
      return;
    }

    if (!this.editingHealthRecordId && !this.selectedHealthRecordFile) {
      this.healthRecordError = 'Document file is required.';
      return;
    }

    this.isSavingHealthRecord = true;

    const payload = this.getHealthRecordPayload();
    const request$ = this.editingHealthRecordId
      ? this.medicalRecordService.updateHealthRecord(
          this.editingHealthRecordId,
          payload
        )
      : this.medicalRecordService.createHealthRecord(payload);

    request$.pipe(
      timeout(30000),
      finalize(() => {
        this.isSavingHealthRecord = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: () => {
        const message = this.editingHealthRecordId
          ? 'Health record updated successfully.'
          : 'Health record created successfully.';
        this.resetHealthRecordForm();
        this.healthRecordMessage = message;
        this.loadHealthRecords(1);
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.healthRecordError =
          error?.name === 'TimeoutError'
            ? 'Saving is taking too long. Please check backend server and try again.'
            : error?.error?.message || 'Failed to save health record.';
        this.cdr.detectChanges();
      }
    });
  }

  deleteHealthRecord(record: any): void {
    if (!confirm('Delete this health record?')) {
      return;
    }

    this.medicalRecordService.deleteHealthRecord(record._id).subscribe({
      next: () => {
        this.healthRecordMessage = 'Health record deleted successfully.';
        this.loadHealthRecords(this.pagination.page);
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.healthRecordError =
          error?.error?.message || 'Failed to delete health record.';
        this.cdr.detectChanges();
      }
    });
  }

  formatOption(value: string): string {
    return value.replace(/_/g, ' ');
  }

  onHealthRecordFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedHealthRecordFile = input.files?.[0] || null;
    this.cdr.detectChanges();
  }

  getDocumentUrl(record: any): string {
    if (!record?.filePath) {
      return '';
    }

    return `${this.fileBaseUrl}${record.filePath}`;
  }

  private loadActivePagedRecords(page: number): void {
    if (this.activeTab === 'healthRecords') {
      this.loadHealthRecords(page);
      return;
    }

    if (this.activeTab === 'prescriptions') {
      this.loadPrescriptions(page);
    }
  }

  private getHealthRecordPayload(): any {
    const formData = new FormData();
    formData.append('patientId', this.patientId);
    formData.append('title', this.healthRecordForm.title);
    formData.append('documentType', this.healthRecordForm.documentType);
    formData.append('documentDate', this.healthRecordForm.documentDate);

    if (this.healthRecordForm.notes) {
      formData.append('notes', this.healthRecordForm.notes);
    }

    if (this.selectedHealthRecordFile) {
      formData.append('documentFile', this.selectedHealthRecordFile);
    }

    return formData;
  }
}
