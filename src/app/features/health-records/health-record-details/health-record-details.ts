import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../core/services/toast';
import { HealthRecordService } from '../../../core/services/health-record';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { ConsultationService } from '../../../core/services/consultation';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader';

@Component({
  selector: 'app-health-record-details',

  standalone: true,

  imports: [CommonModule, ReactiveFormsModule, PaginationComponent, SkeletonLoaderComponent],

  templateUrl: './health-record-details.html',

  styleUrls: ['./health-record-details.css'],

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HealthRecordDetails implements OnInit {
  labReportForm!: FormGroup;

  medicalDocumentForm!: FormGroup;

  editingLabReportId: string | null = null;

  editingMedicalDocumentId: string | null = null;
  patient: any;

  consultations: any[] = [];

  expandedTimeline: Record<string, boolean> = {};

  isLoading = true;

  showLabReportModal = false;

  showMedicalDocumentModal = false;
  selectedLabFile: File | null = null;
  labFileError = '';
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  selectedMedicalFile: File | null = null;
  medicalFileError = '';
  isUploadingLabReport = false;

  isUploadingDocument = false;
  isDownloadingRecord = false;
  timelinePage = 1;
  labPage = 1;
  documentPage = 1;

  readonly pageSize = 5;
  readonly maxUploadSizeBytes = 5 * 1024 * 1024;
  readonly maxUploadSizeLabel = '5 MB';

  timelineMeta: any = {};
  labMeta: any = {};
  documentMeta: any = {};
  readonly todayDate = this.formatDateInputValue(new Date());
  readonly canDeleteHealthRecordDocuments = ['SUPER_ADMIN', 'ADMIN'].includes(
    localStorage.getItem('role') || ''
  );
  constructor(
    private readonly route: ActivatedRoute,

    private readonly fb: FormBuilder,

    private readonly healthRecordService: HealthRecordService,

    private readonly consultationService: ConsultationService,

    private readonly cdr: ChangeDetectorRef,
    private readonly toast: ToastService,
    private readonly confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    const patientId = this.route.snapshot.paramMap.get('patientId');
    this.initializeForms();

    if (patientId) {
      this.loadHealthRecord(patientId);
    }
  }

  initializeForms(): void {
    this.labReportForm = this.fb.group({
      title: ['', Validators.required],

      reportType: ['', Validators.required],

      reportDate: ['', [Validators.required, this.notFutureDateValidator]],

      labName: [''],

      doctorName: [''],

      notes: ['']
    });

    this.medicalDocumentForm = this.fb.group({
      title: ['', Validators.required],

      documentType: ['', Validators.required],

      hospitalName: [''],

      doctorName: [''],

      recordDate: ['', [Validators.required, this.notFutureDateValidator]],

      notes: ['']
    });
  }

  notFutureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(control.value);
    const today = new Date();

    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return selectedDate > today ? { futureDate: true } : null;
  }

  private formatDateInputValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  loadHealthRecord(patientId: string, showPageLoader = true): void {
    if (showPageLoader) {
      this.isLoading = true;
    }

    const params = {
      timelinePage: this.timelinePage,

      labPage: this.labPage,

      documentPage: this.documentPage,

      limit: this.pageSize
    };

    this.healthRecordService.getHealthRecordDetails(patientId, params).subscribe({
      next: (response) => {
        this.patient = response.data.patient;

        this.consultations = response.data.consultations ?? [];

        this.patient.labReports = response.data.labReports ?? [];

        this.patient.medicalDocuments = response.data.medicalDocuments ?? [];

        this.timelineMeta = response.data.meta.consultations;

        this.labMeta = response.data.meta.labReports;

        this.documentMeta = response.data.meta.medicalDocuments;

        if (this.correctEmptyPagesAfterLoad()) {
          return;
        }

        this.isLoading = false;

        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error(error);

        this.isLoading = false;

        this.cdr.markForCheck();
      }
    });
  }

  toggleTimeline(consultationId: string): void {
    this.expandedTimeline[consultationId] = !this.expandedTimeline[consultationId];
  }

  /*
  |----------------------------------------------------------
  | Lab Report Modal
  |----------------------------------------------------------
  */
  openLabModal(): void {
    this.editingLabReportId = null;

    this.labReportForm.reset();

    this.selectedLabFile = null;
    this.labFileError = '';

    this.showLabReportModal = true;
  }
  onTimelinePageChange(page: number): void {
    if (page < 1 || page > this.timelineMeta?.totalPages) {
      return;
    }

    this.timelinePage = page;

    this.loadHealthRecord(this.patient._id, false);
  }

  onLabPageChange(page: number): void {
    if (page < 1 || page > this.labMeta?.totalPages) {
      return;
    }

    this.labPage = page;

    this.loadHealthRecord(this.patient._id, false);
  }

  onDocumentPageChange(page: number): void {
    if (page < 1 || page > this.documentMeta?.totalPages) {
      return;
    }

    this.documentPage = page;

    this.loadHealthRecord(this.patient._id, false);
  }
  editLabReport(report: any): void {
    this.editingLabReportId = report._id;

    this.labReportForm.patchValue({
      title: report.title,

      reportType: report.reportType,

      reportDate: report.reportDate?.split('T')[0],

      labName: report.labName,

      doctorName: report.doctorName,

      notes: report.notes
    });

    this.selectedLabFile = null;
    this.labFileError = '';

    this.showLabReportModal = true;
  }
  async deleteLabReport(reportId: string): Promise<void> {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete lab report?',
      message: 'This report will be removed from the patient record.',
      confirmText: 'Delete',
      tone: 'danger'
    });

    if (!confirmed) {
      return;
    }

    this.healthRecordService.deleteLabReport(this.patient._id, reportId).subscribe({
      next: () => {
        this.toast.success('Lab report deleted successfully');

        this.labPage = this.getPageAfterDelete(this.labMeta);

        this.loadHealthRecord(this.patient._id, false);
      },

      error: (error) => {
        console.error(error);

        this.toast.error('Unable to delete lab report');
      }
    });
  }

  closeLabModal(): void {
    this.showLabReportModal = false;

    this.labReportForm.reset();

    this.selectedLabFile = null;
    this.labFileError = '';
  }
  saveLabReport(): void {
    this.labFileError = this.getFileValidationError(
      this.selectedLabFile,
      !this.editingLabReportId,
      'Report file is required'
    );

    if (this.labReportForm.invalid || this.labFileError) {
      this.labReportForm.markAllAsTouched();
      this.cdr.markForCheck();
      return;
    }

    const formData = new FormData();
    const value = this.labReportForm.value;

    formData.append('title', value.title);

    formData.append('reportType', value.reportType);

    formData.append('reportDate', value.reportDate);

    formData.append('labName', value.labName || '');

    formData.append('doctorName', value.doctorName || '');

    formData.append('notes', value.notes || '');

    if (this.selectedLabFile) {
      formData.append('document', this.selectedLabFile);
    }

    this.isUploadingLabReport = true;
    const request$ = this.editingLabReportId
      ? this.healthRecordService.updateLabReport(this.patient._id, this.editingLabReportId, formData)
      : this.healthRecordService.addLabReport(this.patient._id, formData);

    request$.subscribe({
      next: (response) => {
        this.toast.success(
          this.editingLabReportId ? 'Lab report updated successfully' : 'Lab report added successfully'
        );

        this.closeLabModal();

        this.isUploadingLabReport = false;

        this.loadHealthRecord(this.patient._id);
      },
      error: (error) => {
        console.error(error);

        this.isUploadingLabReport = false;

        this.cdr.markForCheck();

        this.toast.error(
          this.getHttpErrorMessage(
            error,
            this.editingLabReportId ? 'Unable to update lab report' : 'Unable to add lab report'
          )
        );
      }
    });
  }
  /*
  |----------------------------------------------------------
  | Medical Document Modal
  |----------------------------------------------------------
  */

  openDocumentModal(): void {
    this.editingMedicalDocumentId = null;

    this.medicalDocumentForm.reset();

    this.selectedMedicalFile = null;
    this.medicalFileError = '';

    this.showMedicalDocumentModal = true;
  }
  editMedicalDocument(document: any): void {
    this.editingMedicalDocumentId = document._id;

    this.medicalDocumentForm.patchValue({
      title: document.title,

      documentType: document.documentType,

      hospitalName: document.hospitalName,

      doctorName: document.doctorName,

      recordDate: document.recordDate?.split('T')[0],

      notes: document.notes
    });

    this.selectedMedicalFile = null;
    this.medicalFileError = '';

    this.showMedicalDocumentModal = true;
  }
  async deleteMedicalDocument(documentId: string): Promise<void> {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete medical document?',
      message: 'This document will be removed from the patient record.',
      confirmText: 'Delete',
      tone: 'danger'
    });

    if (!confirmed) {
      return;
    }

    this.healthRecordService.deleteMedicalDocument(this.patient._id, documentId).subscribe({
      next: () => {
        this.toast.success('Medical document deleted successfully');

        this.documentPage = this.getPageAfterDelete(this.documentMeta);

        this.loadHealthRecord(this.patient._id, false);
      },

      error: (error) => {
        console.error(error);

        this.toast.error('Unable to delete document');
      }
    });
  }

  closeDocumentModal(): void {
    this.showMedicalDocumentModal = false;

    this.medicalDocumentForm.reset();

    this.selectedMedicalFile = null;
    this.medicalFileError = '';
  }
  saveMedicalDocument(): void {
    this.medicalFileError = this.getFileValidationError(
      this.selectedMedicalFile,
      !this.editingMedicalDocumentId,
      'Document file is required'
    );

    if (this.medicalDocumentForm.invalid || this.medicalFileError) {
      this.medicalDocumentForm.markAllAsTouched();

      this.cdr.markForCheck();
      return;
    }

    const formData = new FormData();

    const value = this.medicalDocumentForm.value;

    formData.append('title', value.title);

    formData.append('documentType', value.documentType);

    formData.append('hospitalName', value.hospitalName || '');

    formData.append('doctorName', value.doctorName || '');

    formData.append('recordDate', value.recordDate);

    formData.append('notes', value.notes || '');

    if (this.selectedMedicalFile) {
      formData.append('document', this.selectedMedicalFile);
    }

    this.isUploadingDocument = true;

    const request$ = this.editingMedicalDocumentId
      ? this.healthRecordService.updateMedicalDocument(this.patient._id, this.editingMedicalDocumentId, formData)
      : this.healthRecordService.addMedicalDocument(this.patient._id, formData);

    request$.subscribe({
      next: (response) => {
        this.toast.success(
          this.editingMedicalDocumentId
            ? 'Medical document updated successfully'
            : 'Medical document added successfully'
        );

        this.closeDocumentModal();

        this.isUploadingDocument = false;

        this.loadHealthRecord(this.patient._id);
      },

      error: (error) => {
        console.error(error);

        this.toast.error(
          this.getHttpErrorMessage(
            error,
            this.editingMedicalDocumentId ? 'Unable to update document' : 'Unable to add document'
          )
        );

        this.isUploadingDocument = false;
        this.cdr.markForCheck();
      }
    });
  }
  viewFile(url: string): void {
    window.open(`http://localhost:5000${url}`, '_blank');
  }

  downloadFile(url: string): void {
    const link = document.createElement('a');

    link.href = `http://localhost:5000${url}`;

    link.download = '';

    link.click();
  }
  downloadPdf(consultationId: string): void {
    this.consultationService.downloadPrescriptionPdf(consultationId).subscribe({
      next: (response: Blob) => {
        const fileUrl = URL.createObjectURL(response);

        window.open(fileUrl);
      },

      error: (error) => {
        console.log(error);
      }
    });
  }

  downloadCompleteRecord(): void {
    if (!this.patient?._id || this.isDownloadingRecord) {
      return;
    }

    this.isDownloadingRecord = true;

    this.healthRecordService
      .getHealthRecordDetails(this.patient._id, {
        timelinePage: 1,
        labPage: 1,
        documentPage: 1,
        limit: 10000
      })
      .subscribe({
        next: (response) => {
          const record = response.data;
          const blob = new Blob([JSON.stringify(record, null, 2)], {
            type: 'application/json'
          });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');

          link.href = url;
          link.download = `${record.patient?.patientId || 'patient'}-health-record.json`;
          link.click();
          URL.revokeObjectURL(url);

          this.toast.success('Complete health record downloaded');
          this.isDownloadingRecord = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error(error);
          this.toast.error('Unable to download complete health record');
          this.isDownloadingRecord = false;
          this.cdr.markForCheck();
        }
      });
  }
  onLabFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.selectedLabFile = input.files?.[0] ?? null;
    this.labFileError = this.getFileValidationError(
      this.selectedLabFile,
      !this.editingLabReportId,
      'Report file is required'
    );

    if (this.labFileError && this.selectedLabFile) {
      this.selectedLabFile = null;
      input.value = '';
    }
  }
  onMedicalFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.selectedMedicalFile = input.files?.[0] ?? null;
    this.medicalFileError = this.getFileValidationError(
      this.selectedMedicalFile,
      !this.editingMedicalDocumentId,
      'Document file is required'
    );

    if (this.medicalFileError && this.selectedMedicalFile) {
      this.selectedMedicalFile = null;
      input.value = '';
    }
  }

  private getFileValidationError(file: File | null, isRequired: boolean, requiredMessage: string): string {
    if (!file) {
      return isRequired ? requiredMessage : '';
    }

    if (file.size > this.maxUploadSizeBytes) {
      return `File size must not exceed ${this.maxUploadSizeLabel}`;
    }

    return '';
  }

  private getHttpErrorMessage(error: any, fallback: string): string {
    return error?.error?.message || error?.message || fallback;
  }

  private getPageAfterDelete(meta: any): number {
    const totalAfterDelete = Math.max((meta?.totalRecords || 0) - 1, 0);
    const nextTotalPages = Math.max(Math.ceil(totalAfterDelete / this.pageSize), 1);

    return Math.min(meta?.page || 1, nextTotalPages);
  }

  private correctEmptyPagesAfterLoad(): boolean {
    if (this.timelinePage > 1 && !this.consultations.length) {
      this.timelinePage = Math.max((this.timelineMeta?.totalPages || 1), 1);
      this.loadHealthRecord(this.patient._id, false);
      return true;
    }

    if (this.labPage > 1 && !this.patient.labReports?.length) {
      this.labPage = Math.max((this.labMeta?.totalPages || 1), 1);
      this.loadHealthRecord(this.patient._id, false);
      return true;
    }

    if (this.documentPage > 1 && !this.patient.medicalDocuments?.length) {
      this.documentPage = Math.max((this.documentMeta?.totalPages || 1), 1);
      this.loadHealthRecord(this.patient._id, false);
      return true;
    }

    return false;
  }
  printPage(): void {
    globalThis.print();
  }
}
