import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ConsultationService } from '../../../core/services/consultation';

@Component({
  selector: 'app-consultation-list',

  standalone: true,

  imports: [CommonModule, RouterLink],

  templateUrl: './consultation-list.html',

  styleUrls: ['./consultation-list.css']
})
export class ConsultationList implements OnInit {
  consultations: any[] = [];

  isLoading = false;

  constructor(readonly consultationService: ConsultationService) {}

  /*
  |--------------------------------------------------------------------------
  | On Init
  |--------------------------------------------------------------------------
  */
  ngOnInit(): void {
    this.loadConsultations();
  }

  /*
  |--------------------------------------------------------------------------
  | Load Consultations
  |--------------------------------------------------------------------------
  */
  loadConsultations(): void {
    this.isLoading = true;

    this.consultationService
      .getConsultations()

      .subscribe({
        next: (response) => {
          console.log(response);

          this.consultations = response.data;

          this.isLoading = false;
        },

        error: (error) => {
          console.log(error);

          this.isLoading = false;
        }
      });
  }

  /*
  |--------------------------------------------------------------------------
  | Download PDF
  |--------------------------------------------------------------------------
  */
  downloadPdf(consultationId: string): void {
    this.consultationService
      .downloadPrescriptionPdf(consultationId)

      .subscribe({
        next: (response: Blob) => {
          const fileURL = window.URL.createObjectURL(response);

          window.open(fileURL);
        },

        error: (error) => {
          console.log(error);
        }
      });
  }
}
