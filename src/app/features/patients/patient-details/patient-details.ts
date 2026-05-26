import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { PatientService } from '../../../core/services/patient';

@Component({
  selector: 'app-patient-details',

  standalone: true,

  imports: [CommonModule],

  templateUrl: './patient-details.html',

  styleUrls: ['./patient-details.css']
})
export class PatientDetails implements OnInit {
  patient: any = {};

  constructor(
    private route: ActivatedRoute,

    private patientService: PatientService,
    private cdr: ChangeDetectorRef
  ) {}

  /*
  |--------------------------------------------------------------------------
  | On Init
  |--------------------------------------------------------------------------
  */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadPatient(id);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Load Patient
  |--------------------------------------------------------------------------
  */
  loadPatient(id: string): void {
    this.patientService
      .getPatientById(id)

      .subscribe({
        next: (response) => {
          console.log(response);

          this.patient = response.data;
          this.cdr.detectChanges();
        },

        error: (error) => {
          console.log(error);
        }
      });
  }
}
