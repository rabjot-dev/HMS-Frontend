import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { RouterLink } from '@angular/router';

import { EmployeeService } from '../../../core/services/employee';

@Component({
  selector: 'app-employee-list',

  imports: [CommonModule, RouterLink, FormsModule],

  templateUrl: './employee-list.html',

  styleUrl: './employee-list.css'
})
export class EmployeeList implements OnInit {
  employees: any[] = [];

  filteredEmployees: any[] = [];

  searchText = '';

  constructor(
    readonly employeeService: EmployeeService,

    readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (response: any) => {
        console.log(response);

        this.employees = response.data;

        this.filteredEmployees = [...response.data];

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.log(error);
      }
    });
  }

  onSearch(): void {
    const search = this.searchText.toLowerCase();

    this.filteredEmployees = this.employees.filter((employee) => {
      return (
        employee.name.toLowerCase().includes(search) ||
        employee.employeeCode.toLowerCase().includes(search) ||
        employee.designation.toLowerCase().includes(search)
      );
    });
  }
  deactivateEmployee(id: string): void {
    console.log(id);

    this.employeeService.deactivateEmployee(id).subscribe({
      next: () => {
        console.log('Employee deactivated');

        this.loadEmployees();
      },

      error: (error) => {
        console.log(error);
      }
    });
  }
  activateEmployee(id: string): void {
    this.employeeService.activateEmployee(id).subscribe({
      next: () => {
        console.log('Employee activated');

        this.loadEmployees();
      },

      error: (error) => {
        console.log(error);
      }
    });
  }
}
