import {
  Component,
  OnInit,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';
import {
  FormsModule,
} from '@angular/forms';

import {
  PatientService,
} from '../../../core/services/patient';
import { RouterLink } from "@angular/router";

@Component({
  selector:
    'app-patient-list',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
],

  templateUrl:
    './patient-list.html',

  styleUrls: [
    './patient-list.css',
  ],
})
export class PatientList
implements OnInit {

  patients: any[] = [];

  filteredPatients:
  any[] = [];

  searchTerm = '';

  constructor(

    private patientService:
      PatientService,
  ) {}

  /*
  |--------------------------------------------------------------------------
  | On Init
  |--------------------------------------------------------------------------
  */
  ngOnInit(): void {

    this.loadPatients();
  }

  /*
  |--------------------------------------------------------------------------
  | Load Patients
  |--------------------------------------------------------------------------
  */
  loadPatients(): void {

    this.patientService
      .getPatients()

      .subscribe({

        next: (
          response,
        ) => {

          console.log(
            response,
          );

          this.patients =
            response.data;

          this.filteredPatients =
            response.data;
        },

        error: (
          error,
        ) => {

          console.log(
            error,
          );
        },
      });
  }

  /*
  |--------------------------------------------------------------------------
  | Search Patients
  |--------------------------------------------------------------------------
  */
  searchPatients(): void {

    const search =

      this.searchTerm
        .toLowerCase();

    this.filteredPatients =

      this.patients.filter(

        (patient) => {

          return (

            patient.firstName
              ?.toLowerCase()
              .includes(search)

            ||

            patient.lastName
              ?.toLowerCase()
              .includes(search)

            ||

            patient.patientId
              ?.toLowerCase()
              .includes(search)

            ||

            patient.phone
              ?.includes(search)
          );
        },
      );
  }
}