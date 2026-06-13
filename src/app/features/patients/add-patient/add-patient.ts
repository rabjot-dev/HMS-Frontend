import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

import { ToastService } from '../../../core/services/toast';
import { PatientService } from '../../../core/services/patient';

// Custom validator: no future dates
function noFutureDate(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const selected = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected > today ? { futureDate: true } : null;
}

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-patient.html',
  styleUrls: ['./add-patient.css']
})
export class AddPatient {
  currentStep = 1;
  isSubmitting = false;
// State → City map
readonly stateCityMap: { [state: string]: string[] } = {
  'Tamil Nadu':    ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Tirunelveli', 'Vellore'],
  'Maharashtra':   ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur'],
  'Karnataka':     ['Bengaluru', 'Mysuru', 'Hubli', 'Mangaluru', 'Belagavi', 'Davangere'],
  'Delhi':         ['New Delhi', 'Dwarka', 'Rohini', 'Janakpuri', 'Saket', 'Laxmi Nagar'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Prayagraj', 'Noida', 'Ghaziabad'],
  'Gujarat':       ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar'],
  'Rajasthan':     ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner'],
  'West Bengal':   ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman'],
  'Telangana':     ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
  'Kerala':        ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad'],
  'Punjab':        ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali'],
  'Haryana':       ['Gurugram', 'Faridabad', 'Ambala', 'Hisar', 'Panipat', 'Rohtak'],
  'Madhya Pradesh':['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar'],
  'Bihar':         ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga'],
  'Odisha':        ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur'],
};

get stateList(): string[] {
  return Object.keys(this.stateCityMap);
}

cities: string[] = [];

onStateChange(event: Event): void {
  const selected = (event.target as HTMLSelectElement).value;
  this.cities = this.stateCityMap[selected] || [];
  this.patientForm.get('city')?.setValue('');
}
  patientForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly toastService: ToastService,
    private readonly patientService: PatientService
  ) {
    this.patientForm = this.fb.group({
      // Basic Information
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      lastName:  ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      dateOfBirth: ['', [Validators.required, noFutureDate]],
      gender: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      maritalStatus: ['', Validators.required],

      // Contact Information
      countryCode: ['+91', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      country: ['India'],

      // Emergency Contact
      emergencyContactName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      emergencyContactPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],

      // Medical Information (optional — untouched)
      medicalHistory: [''],
      allergies: [''],
      chronicDiseases: [''],
      currentMedications: [''],
      pastSurgeries: [''],
      familyMedicalHistory: [''],

      // Insurance Information (optional — untouched)
      insuranceProvider: [''],
      insurancePolicyNumber: [''],
      insuranceExpiryDate: [''],
      insuranceCoverageAmount: [''],

      // Hospital Information
      department: [''],
      patientType: ['', Validators.required]
    });
  }

  nextStep(): void {
    const stepFields: { [key: number]: string[] } = {
      1: ['firstName', 'lastName', 'dateOfBirth', 'gender', 'bloodGroup', 'maritalStatus'],
      2: ['phone', 'email', 'address', 'city', 'state', 'pincode', 'emergencyContactName', 'emergencyContactPhone'],
      3: [],
      4: ['patientType']
    };

    const fieldsToValidate = stepFields[this.currentStep] || [];
    fieldsToValidate.forEach(field => this.patientForm.get(field)?.markAsTouched());

    const isStepValid = fieldsToValidate.every(field => this.patientForm.get(field)?.valid);
    if (!isStepValid) return;

    if (this.currentStep < 4) this.currentStep++;
  }

  previousStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  onSubmit(): void {
    this.patientForm.get('patientType')?.markAsTouched();
    if (this.patientForm.get('patientType')?.invalid) return;

    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.patientService.createPatient(this.patientForm.value).subscribe({
      next: (response) => {
        this.toastService.show('Patient Registered Successfully', 'success');
        this.patientForm.reset();
        this.patientForm.patchValue({ countryCode: '+91', country: 'India', patientType: '' });
        this.currentStep = 1;
        this.isSubmitting = false;

      },
      error: (error) => {
        const message = error?.error?.message || 'Failed to register patient';
        alert(message);
        this.isSubmitting = false;
      }
    });
  }
}