import {
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  FormsModule,
} from '@angular/forms';

import {
  RouterLink,
} from '@angular/router';

import {
  PatientService,
} from '../../../core/services/patient';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';

@Component({
  selector:
    'app-patient-list',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink, PaginationComponent
  ],

  templateUrl:
    './patient-list.html',

  styleUrls: [
    './patient-list.css',
  ],
})
export class PatientList
  implements OnInit
{
  patients: any[] = [];

  userRole = '';

  search = '';
  gender = '';
  bloodGroup = '';

  startDate = '';
  endDate = '';

  page = 1;
  limit = 10;

  totalRecords = 0;
  totalPages = 0;

  constructor(
    private readonly patientService:
      PatientService,

    private readonly cdr:
      ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userRole =
      localStorage.getItem(
        'role'
      ) || '';

    this.loadPatients();
  }

  loadPatients(): void {
    const params: any = {
      page: this.page,
      limit: this.limit,
    };

    if (
      this.search.trim()
    ) {
      params.search =
        this.search;
    }

    if (this.gender) {
      params.gender =
        this.gender;
    }

    if (
      this.bloodGroup
    ) {
      params.bloodGroup =
        this.bloodGroup;
    }

    if (
      this.startDate
    ) {
      params.startDate =
        this.startDate;
    }

    if (
      this.endDate
    ) {
      params.endDate =
        this.endDate;
    }

    this.patientService
      .getPatients(
        params
      )
      .subscribe({
        next:
          (
            response
          ) => {
            console.log(
              response
            );

            this.patients =
              response.data;

            this.totalRecords =
              response
                .meta
                ?.total ||
              0;

            this.totalPages =
              response
                .meta
                ?.totalPages ||
              0;

            this.cdr.detectChanges();
          },

        error:
          (
            error
          ) => {
            console.log(
              error
            );
          },
      });
  }

  onFilterChange(): void {
    this.page = 1;

    this.loadPatients();
  }

  previousPage(): void {
    if (
      this.page > 1
    ) {
      this.page--;

      this.loadPatients();
    }
  }

  nextPage(): void {
    if (
      this.page <
      this.totalPages
    ) {
      this.page++;

      this.loadPatients();
    }
  }

  changePageSize(
    event: Event
  ): void {
    const select =
      event.target as HTMLSelectElement;

    this.limit =
      Number(
        select.value
      );

    this.page = 1;

    this.loadPatients();
  }
}