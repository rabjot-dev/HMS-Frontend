import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AppointmentService } from '../../../core/services/appointment';
import { AuthService } from '../../../core/services/auth';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent],
  templateUrl: './appointment-list.html',
  styleUrls: ['./appointment-list.css']
})
export class AppointmentList implements OnInit, OnDestroy {
  appointments: any[] = [];

  filteredAppointments: any[] = [];

  searchTerm = '';

  selectedStatus = '';
  fromDate = '';
  toDate = '';
  sortBy = 'appointmentDate';
  sortOrder = 'asc';

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
    private readonly appointmentService: AppointmentService,
    public readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  ngOnDestroy(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  loadAppointments(page = this.pagination.page): void {
    const filters = {
      search: this.searchTerm,
      status: this.selectedStatus,
      fromDate: this.fromDate,
      toDate: this.toDate,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    };

    this.appointmentService.getAppointments(page, this.pagination.limit, filters).subscribe({
      next: (response) => {
        this.appointments = response.data || [];
        this.filteredAppointments = response.data || [];
        this.pagination = response.pagination || this.pagination;

        this.cdr.detectChanges();
      },

      error: (error) => {
      }
    });
  }
  previousPage(): void {
    if (this.pagination.hasPreviousPage) {
      this.loadAppointments(this.pagination.page - 1);
    }
  }

  nextPage(): void {
    if (this.pagination.hasNextPage) {
      this.loadAppointments(this.pagination.page + 1);
    }
  }

  changeLimit(limit: number): void {
    this.pagination.limit = Number(limit);
    this.loadAppointments(1);
  }

  onSearchInput(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.loadAppointments(1);
    }, 500);
  }

  onFilterChange(): void {
    this.loadAppointments(1);
  }

  deleteAppointment(id: string): void {
    const confirmDelete = confirm('Delete this appointment?');

    if (!confirmDelete) {
      return;
    }

    this.appointmentService.deleteAppointment(id).subscribe({
      next: () => {
        alert('Appointment deleted successfully');

        this.loadAppointments();
      },

      error: (error) => {
      }
    });
  }
}
