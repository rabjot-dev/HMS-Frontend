import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  CommonModule,
} from '@angular/common';

import {
  ActivatedRoute,
} from '@angular/router';
import {
  ToastService
} from '../../../core/services/toast';
import {
  HealthRecordService,
} from '../../../core/services/health-record';

import {
  ConsultationService,
} from '../../../core/services/consultation';

@Component({
  selector:
    'app-health-record-details',

  standalone: true,

  imports: [
    CommonModule,ReactiveFormsModule
  ],

  templateUrl:
    './health-record-details.html',

  styleUrls: [
    './health-record-details.css',
  ],

  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class HealthRecordDetails
  implements OnInit
{
  labReportForm!: FormGroup;

medicalDocumentForm!: FormGroup;

editingLabReportId: string | null =
  null;

editingMedicalDocumentId:
  string | null = null;
  patient: any;

consultations: any[] = [];

expandedTimeline:
  Record<string, boolean> = {};

isLoading = true;

showLabReportModal = false;

showMedicalDocumentModal =
  false;
selectedLabFile:
  File | null = null;
   toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

selectedMedicalFile:
  File | null = null;
isUploadingLabReport =
  false;

isUploadingDocument =
  false;
  constructor(
    private readonly route:
      ActivatedRoute,

  private readonly fb:
    FormBuilder,

    private readonly healthRecordService:
      HealthRecordService,

    private readonly consultationService:
      ConsultationService,

    private readonly cdr:
      ChangeDetectorRef,
        private readonly toast:
    ToastService,
  ) {}

  ngOnInit():
  
    void {
    const patientId =
      this.route.snapshot.paramMap.get(
        'patientId',
      );
      this.initializeForms();

    if (
      patientId
    ) {
      this.loadHealthRecord(
        patientId,
      );
    }
  }

  initializeForms(): void {
this.labReportForm =
  this.fb.group({
    title: [
      '',
      Validators.required,
    ],

    reportType: [
      '',
      Validators.required,
    ],

    reportDate: [
      '',
      Validators.required,
    ],

    labName: [''],

    doctorName: [''],

    notes: [''],
  });

this.medicalDocumentForm =
  this.fb.group({
    title: [
      '',
      Validators.required,
    ],

    documentType: [
      '',
      Validators.required,
    ],

    hospitalName: [''],

    doctorName: [''],

    recordDate: [
      '',
      Validators.required,
    ],

    notes: [''],
  });
}
 loadHealthRecord(
  patientId: string
): void {
  this.isLoading = true;

  this.healthRecordService
    .getHealthRecordDetails(
      patientId
    )
    .subscribe({
      next:
        (
          response
        ) => {
          this.patient =
            response.data.patient;

          this.consultations =
            response.data.consultations;

          this.isLoading =
            false;

          this.cdr.detectChanges();
        },

      error:
        (
          error
        ) => {
          console.log(
            error
          );

          this.isLoading =
            false;

          this.cdr.detectChanges();
        },
    });
}

  toggleTimeline(
    consultationId: string
  ): void {
    this.expandedTimeline[
      consultationId
    ] =
      !this.expandedTimeline[
        consultationId
      ];
  }

  /*
  |----------------------------------------------------------
  | Lab Report Modal
  |----------------------------------------------------------
  */
openLabModal(): void {
  this.editingLabReportId =
    null;

  this.labReportForm.reset();

  this.selectedLabFile =
    null;

  this.showLabReportModal =
    true;
}
editLabReport(
  report: any
): void {
  this.editingLabReportId =
    report._id;

  this.labReportForm.patchValue({
    title:
      report.title,

    reportType:
      report.reportType,

    reportDate:
      report.reportDate
        ?.split('T')[0],

    labName:
      report.labName,

    doctorName:
      report.doctorName,

    notes:
      report.notes,
  });

  this.selectedLabFile =
    null;

  this.showLabReportModal =
    true;
}
deleteLabReport(
  reportId: string
): void {
  if (
    !confirm(
      'Delete report?'
    )
  ) {
    return;
  }

  this.healthRecordService
    .deleteLabReport(
      this.patient._id,
      reportId
    )
    .subscribe({
      next: () => {
        this.patient.labReports =
          this.patient.labReports.filter(
            (
              report: any
            ) =>
              report._id?.toString() !==
              reportId
          );

        this.cdr.markForCheck();

        this.toast.success(
          'Lab report deleted successfully'
        );
      },

      error: (
        error
      ) => {
        console.error(
          error
        );

        this.toast.error(
          'Unable to delete lab report'
        );
      },
    });
}

closeLabModal(): void {
  this.showLabReportModal =
    false;

  this.labReportForm.reset();

  this.selectedLabFile =
    null;
}
saveLabReport(): void {
  if (this.labReportForm.invalid) {
    this.labReportForm.markAllAsTouched();
    return;
  }

  const formData = new FormData();
  const value = this.labReportForm.value;

  formData.append(
    'title',
    value.title
  );

  formData.append(
    'reportType',
    value.reportType
  );

  formData.append(
    'reportDate',
    value.reportDate
  );

  formData.append(
    'labName',
    value.labName || ''
  );

  formData.append(
    'doctorName',
    value.doctorName || ''
  );

  formData.append(
    'notes',
    value.notes || ''
  );

  if (this.selectedLabFile) {
    formData.append(
      'document',
      this.selectedLabFile
    );
  }

  this.isUploadingLabReport =
    true;
const request$ =
  this.editingLabReportId
    ? this.healthRecordService
        .updateLabReport(
          this.patient._id,
          this.editingLabReportId,
          formData
        )
    : this.healthRecordService
        .addLabReport(
          this.patient._id,
          formData
        );

request$.subscribe({
      next: (response) => {
        this.toast.success(
          'Lab report added successfully'
        );

        this.patient.labReports ??= [];

        if (
  this.editingLabReportId
) {
  const index =
    this.patient.labReports.findIndex(
      (
        report: any
      ) =>
        report._id ===
        response.data._id
    );

  if (
    index !== -1
  ) {
    this.patient.labReports[
      index
    ] =
      response.data;

    this.patient.labReports =
      [
        ...this
          .patient
          .labReports,
      ];
  }

  this.toast.success(
    'Lab report updated successfully'
  );
} else {
  this.patient.labReports =
    [
      response.data,
      ...(
        this.patient
          .labReports ??
        []
      ),
    ];
}
this.cdr.markForCheck();
this.closeLabModal();

this.isUploadingLabReport = false;

this.toast.success(
  'Lab report updated successfully'
);
      },
error: (error) => {
  console.error(error);

  this.isUploadingLabReport = false;

  this.cdr.markForCheck();

  this.toast.error(
    'Unable to add lab report'
  );
},
    });
}
  /*
  |----------------------------------------------------------
  | Medical Document Modal
  |----------------------------------------------------------
  */

openDocumentModal(): void {
  this.editingMedicalDocumentId =
    null;

  this.medicalDocumentForm.reset();

  this.selectedMedicalFile =
    null;

  this.showMedicalDocumentModal =
    true;
}
editMedicalDocument(
  document: any
): void {
  this.editingMedicalDocumentId =
    document._id;

  this.medicalDocumentForm.patchValue({
    title:
      document.title,

    documentType:
      document.documentType,

    hospitalName:
      document.hospitalName,

    doctorName:
      document.doctorName,

    recordDate:
      document.recordDate
        ?.split('T')[0],

    notes:
      document.notes,
  });

  this.selectedMedicalFile =
    null;

  this.showMedicalDocumentModal =
    true;
}
deleteMedicalDocument(
  documentId: string
): void {
  if (
    !confirm(
      'Delete document?'
    )
  ) {
    return;
  }

  this.healthRecordService
    .deleteMedicalDocument(
      this.patient._id,
      documentId
    )
    .subscribe({
      next: () => {
        this.patient.medicalDocuments =
          this.patient.medicalDocuments.filter(
            (
              document: any
            ) =>
              document._id?.toString() !==
              documentId
          );

        this.cdr.markForCheck();

        this.toast.success(
          'Medical document deleted successfully'
        );
      },

      error: (
        error
      ) => {
        console.error(
          error
        );

        this.toast.error(
          'Unable to delete document'
        );
      },
    });
}

closeDocumentModal(): void {
  this.showMedicalDocumentModal =
    false;

  this.medicalDocumentForm.reset();

  this.selectedMedicalFile =
    null;
}
saveMedicalDocument(): void {
  if (
    this
      .medicalDocumentForm
      .invalid
  ) {
    this
      .medicalDocumentForm
      .markAllAsTouched();

    return;
  }

  const formData =
    new FormData();

  const value =
    this
      .medicalDocumentForm
      .value;

  formData.append(
    'title',
    value.title
  );

  formData.append(
    'documentType',
    value.documentType
  );

  formData.append(
    'hospitalName',
    value.hospitalName || ''
  );

  formData.append(
    'doctorName',
    value.doctorName || ''
  );

  formData.append(
    'recordDate',
    value.recordDate
  );

  formData.append(
    'notes',
    value.notes || ''
  );

  if (
    this
      .selectedMedicalFile
  ) {
    formData.append(
      'document',
      this
        .selectedMedicalFile
    );
  }

  this.isUploadingDocument =
    true;

 const request$ =
  this
    .editingMedicalDocumentId
    ? this
        .healthRecordService
        .updateMedicalDocument(
          this.patient._id,
          this
            .editingMedicalDocumentId,
          formData
        )
    : this
        .healthRecordService
        .addMedicalDocument(
          this.patient._id,
          formData
        );

request$.subscribe({
      next: (response) => {
        this.toast.success(
          'Medical document added successfully'
        );

        this.patient
          .medicalDocuments ??= [];

     if (
  this
    .editingMedicalDocumentId
) {
  const index =
    this.patient
      .medicalDocuments
      .findIndex(
        (
          document: any
        ) =>
          document._id ===
          response
            .data
            ._id
      );

  if (
    index !== -1
  ) {
    this.patient
      .medicalDocuments[
      index
    ] =
      response.data;

    this.patient
      .medicalDocuments =
      [
        ...this
          .patient
          .medicalDocuments,
      ];
  }

  this.toast.success(
    'Medical document updated successfully'
  );
} else {
  this.patient
    .medicalDocuments =
    [
      response.data,
      ...(
        this.patient
          .medicalDocuments ??
        []
      ),
    ];

  this.toast.success(
    'Medical document added successfully'
  );
}
this.cdr.markForCheck();
        this.closeDocumentModal();

        this
          .medicalDocumentForm
          .reset();

        this
          .selectedMedicalFile =
          null;

        this
          .isUploadingDocument =
          false;

      },

      error: (
        error
      ) => {
      console.error(error);

        this.toast.error(
          'Unable to add document'
        );

        this
          .isUploadingDocument =
          false;
this.cdr.markForCheck();
      },
    });
}
viewFile(
  url: string
): void {
  window.open(
    `http://localhost:5000${url}`,
    '_blank'
  );
}

downloadFile(
  url: string
): void {
  const link =
    document.createElement(
      'a'
    );

  link.href =
    `http://localhost:5000${url}`;

  link.download = '';

  link.click();
}
  downloadPdf(
    consultationId: string,
  ): void {
    this.consultationService
      .downloadPrescriptionPdf(
        consultationId,
      )
      .subscribe({
        next:
          (
            response:
              Blob,
          ) => {
            const fileUrl =
              URL.createObjectURL(
                response,
              );

            window.open(
              fileUrl,
            );
          },

        error:
          (
            error,
          ) => {
            console.log(
              error,
            );
          },
      });
  }
onLabFileChange(
  event: Event
): void {
  const input =
    event.target as HTMLInputElement;

  this.selectedLabFile =
    input.files?.[0] ??
    null;
}
onMedicalFileChange(
  event: Event
): void {
  const input =
    event.target as HTMLInputElement;

  this.selectedMedicalFile =
    input.files?.[0] ??
    null;
}
  printPage():
    void {
    globalThis.print();
  }
}

