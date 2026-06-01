import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointment';
import { EmployeeService } from '../../../core/services/employee';
import { ToastService } from '../../../core/services/toast';

@Component({
  selector: 'app-edit-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-appointment.html',
  styleUrls: ['./edit-appointment.css']
})
export class EditAppointment implements OnInit {
  appointmentId = '';
  doctors: any[] = [];
  availableSlots: string[] = [];
  isSubmitting = false;
  noSlotsError = false;        // ← ADD
  appointmentForm: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private employeeService: EmployeeService,
    private toastService: ToastService   // ← ADD
  ) {
    this.appointmentForm = this.fb.group({
      doctorEmployeeId: ['', Validators.required],
      appointmentDate:  ['', Validators.required],
      timeSlot:         ['', Validators.required],
      appointmentType:  ['CONSULTATION', Validators.required],
      priority:         ['NORMAL', Validators.required],
      paymentStatus:    ['PENDING', Validators.required],
      visitMode:        ['OFFLINE', Validators.required],
      status:           ['BOOKED', Validators.required],
      reason:           [''],
      notes:            [''],
      symptoms:         ['']
    });
  }

  ngOnInit(): void {
    this.loadDoctors();

    this.appointmentForm.get('status')?.valueChanges.subscribe({
      next: (status: string) => {
        if (status === 'COMPLETED' || status === 'CANCELLED') {
          this.availableSlots = [];
          this.noSlotsError = false;
          this.appointmentForm.patchValue({ timeSlot: '' });
        } else {
          this.fetchAvailableSlots();
        }
      }
    });

    this.appointmentId = this.route.snapshot.paramMap.get('id') || '';
    if (this.appointmentId) {
      this.loadAppointment();
    }
  }

  loadDoctors(): void {
    this.employeeService.getDoctors().subscribe({
      next: (response) => { this.doctors = response.data; },
      error: (error) => { console.log(error); }
    });
  }

  loadAppointment(): void {
    this.appointmentService.getAppointmentById(this.appointmentId).subscribe({
      next: (response) => {
        const appointment = response.data;
        this.appointmentForm.patchValue({
          doctorEmployeeId: appointment?.doctorEmployeeId?._id,
          appointmentDate:  appointment?.appointmentDate?.split('T')[0],
          timeSlot:         appointment?.timeSlot,
          appointmentType:  appointment?.appointmentType,
          priority:         appointment?.priority,
          paymentStatus:    appointment?.paymentStatus,
          visitMode:        appointment?.visitMode,
          status:           appointment?.status,
          reason:           appointment?.reason,
          notes:            appointment?.notes,
          symptoms:         appointment?.symptoms?.join(', ')
        });

        if (appointment?.status !== 'COMPLETED' && appointment?.status !== 'CANCELLED') {
          this.fetchAvailableSlots();
        }
      },
      error: (error) => { console.log(error); }
    });
  }

  fetchAvailableSlots(): void {
    const status = this.appointmentForm.get('status')?.value;
    if (status === 'COMPLETED' || status === 'CANCELLED') return;

    const doctorEmployeeId = this.appointmentForm.get('doctorEmployeeId')?.value;
    const appointmentDate  = this.appointmentForm.get('appointmentDate')?.value;
    if (!doctorEmployeeId || !appointmentDate) return;

    // ← Reset before each call
    this.noSlotsError = false;
    this.availableSlots = [];

    this.appointmentService.getAvailableSlots(doctorEmployeeId, appointmentDate).subscribe({
      next: (response) => {
        this.availableSlots = response.data || [];
        if (this.availableSlots.length === 0) {
          this.noSlotsError = true;
          this.toastService.show('No slots available for the selected date.', 'error');
        } else {
          this.noSlotsError = false;   // ← clear error when slots found
        }
      },
      error: (error) => {
        this.availableSlots = [];
        this.noSlotsError = true;
        this.toastService.show(
          error?.error?.message || 'Doctor is not available on this date.',
          'error'
        );
      }
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      // ← Show noSlotsError on submit if date filled but no slots
      if (
        this.appointmentForm.get('appointmentDate')?.valid &&
        this.availableSlots.length === 0
      ) {
        this.noSlotsError = true;
      }
      return;
    }

    // ← Block submit if no slots
    if (this.availableSlots.length === 0 &&
        this.appointmentForm.get('status')?.value !== 'COMPLETED' &&
        this.appointmentForm.get('status')?.value !== 'CANCELLED') {
      this.noSlotsError = true;
      return;
    }

    this.isSubmitting = true;

    const formData = {
      ...this.appointmentForm.value,
      symptoms: this.appointmentForm.value.symptoms
        ?.split(',')
        .map((symptom: string) => symptom.trim())
    };

    this.appointmentService.updateAppointment(this.appointmentId, formData).subscribe({
      next: (response) => {
        console.log(response);
        this.toastService.show('Appointment updated successfully', 'success');
        this.router.navigate(['/appointments']);
        this.isSubmitting = false;
      },
      error: (error) => {
        console.log(error);
        this.isSubmitting = false;
        this.toastService.show(
          error?.error?.message || 'Failed to update appointment.',
          'error'
        );
      }
    });
  }
}