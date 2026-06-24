import { Routes } from '@angular/router';

import { AuthLayout } from './layouts/auth-layout/auth-layout';

import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';

import { authGuard } from './core/guards/auth-guard';

import { Login } from './features/auth/login/login';

import { Register } from './features/auth/register/register';

import { CreatePassword } from './features/auth/create-password/create-password';
import { menuAccessGuard } from './core/guards/menu-access.guard';
import { AdminDashboard } from './features/dashboard/admin-dashboard/admin-dashboard';
import { DoctorDashboard } from './features/dashboard/doctor-dashboard/doctor-dashboard';

import { ReceptionistDashboard } from './features/dashboard/receptionist-dashboard/receptionist-dashboard';

import { EmployeeList } from './features/employees/employee-list/employee-list';
import { PatientList } from './features/patients/patient-list/patient-list';

import { AddEmployee } from './features/employees/add-employee/add-employee';

import { EmployeeDetails } from './features/employees/employee-details/employee-details';

import { EditEmployee } from './features/employees/edit-employee/edit-employee';

import { PendingEmployees } from './features/employees/pending-employees/pending-employees';

import { AddPatient } from './features/patients/add-patient/add-patient';
import { EditPatient } from './features/patients/edit-patient/edit-patient';

import { PatientDetails } from './features/patients/patient-details/patient-details';
import { BookAppointment } from './features/appointments/book-appointment/book-appointment';
import { AppointmentList } from './features/appointments/appointment-list/appointment-list';
import { EditAppointment } from './features/appointments/edit-appointment/edit-appointment';
import { DoctorQueue } from './features/appointments/doctor-queue/doctor-queue';
import { ConsultationForm } from './features/consultations/consultation-form/consultation-form';
import { ConsultationList } from './features/consultations/consultation-list/consultation-list';
import { DoctorAvailability } from './features/doctor/doctor-availability/doctor-availability';
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';
import { ResetPassword } from './features/auth/reset-password/reset-password';
import { MyProfile } from './features/profile/my-profile/my-profile';
import { Home } from './features/floater/home/home';
import { MedicalRecords } from './features/medical-records/medical-records/medical-records';
import { MedicalRecordRepository } from './features/medical-records/medical-record-repository/medical-record-repository';

export const routes: Routes = [
  // Home Routes
  {
    path: '',

    component: Home,

    pathMatch: 'full'
  },

  // Auth Routes
  {
    path: '',

    component: AuthLayout,

    children: [
      {
        path: 'login',

        component: Login
      },

      {
        path: 'register',

        component: Register
      },

      {
        path: 'create-password',

        component: CreatePassword
      },
      {
        path: 'forgot-password',

        component: ForgotPassword
      },

      {
        path: 'reset-password',

        component: ResetPassword
      }
    ]
  },

  // Protected Dashboard Routes
    
  {
    path: '',

    component: DashboardLayout,

    canActivate: [authGuard],

    children: [
    
      {
        path: '',

        redirectTo: 'dashboard',

        pathMatch: 'full'
      },

   // Admin Dashboard

      {
        path: 'dashboard/admin',

        component: AdminDashboard,
        canActivate: [menuAccessGuard('/dashboard/admin')]
      },

     // Doctor Dashboard
      {
        path: 'dashboard/doctor',

        component: DoctorDashboard,
        canActivate: [menuAccessGuard('/dashboard/doctor')]
      },

      // Receptionist Dashboard
      {
        path: 'dashboard/receptionist',

        component: ReceptionistDashboard,
        canActivate: [menuAccessGuard('/dashboard/receptionist')]
      },

    //Employees
      {
        path: 'employees',

        component: EmployeeList,

        canActivate: [menuAccessGuard('/employees')]
      },

      {
        path: 'employees/create',

        component: AddEmployee,

        canActivate: [menuAccessGuard('/employees/create')]
      },

      {
        path: 'employees/pending',

        component: PendingEmployees,

        canActivate: [menuAccessGuard('/employees/pending')]
      },

      {
        path: 'employees/:id',

        component: EmployeeDetails,

        canActivate: [menuAccessGuard('/employees')]
      },

      {
        path: 'employees/edit/:id',

        component: EditEmployee,

        canActivate: [menuAccessGuard('/employees')]
      },

    // Patients
      {
        path: 'patients/create',

        component: AddPatient,

        canActivate: [menuAccessGuard('/patients/create')]
      },
      {
        path: 'patients',

        component: PatientList,

        canActivate: [menuAccessGuard('/patients')]
      },
      {
        path: 'patients/edit/:id',

        component: EditPatient,

        canActivate: [menuAccessGuard('/patients')]
      },
      {
        path: 'patients/:id',

        component: PatientDetails,

        canActivate: [menuAccessGuard('/patients')]
      },
      {
        path: 'appointments/book',

        component: BookAppointment,

        canActivate: [menuAccessGuard('/appointments/book')]
      },
      {
        path: 'appointments',

        component: AppointmentList,

        canActivate: [menuAccessGuard('/appointments')]
      },
      {
        path: 'appointments/requests',

        loadComponent: () =>
          import(
            './features/appointments/appointment-requests/appointment-requests'
          ).then((m) => m.AppointmentRequestsComponent),

        canActivate: [menuAccessGuard('/appointments/requests')]
      },
      {
        path: 'appointments/edit/:id',

        component: EditAppointment,

        canActivate: [menuAccessGuard('/appointments')]
      },
      {
        path: 'doctor-queue',

        component: DoctorQueue,

        canActivate: [menuAccessGuard('/doctor-queue')]
      },
      {
        path: 'consultation/:appointmentId',

        component: ConsultationForm,

        canActivate: [menuAccessGuard('/doctor-queue')]
      },
      {
        path: 'consultations',

        component: ConsultationList,

        canActivate: [menuAccessGuard('/medical-records')]
      },
      {
        path: 'doctor-availability',

        component: DoctorAvailability,

        canActivate: [menuAccessGuard('/doctor-availability')]
      },
      {
        path: 'medical-records',

        component: MedicalRecordRepository,

        canActivate: [menuAccessGuard('/medical-records')]
      },
      {
        path: 'medical-records/patient/:patientId',

        component: MedicalRecords,

        canActivate: [menuAccessGuard('/medical-records')]
      },
      {
        path: 'my-profile',

        component: MyProfile
      },
      {
        path: 'consultations/:id',

        loadComponent: () =>
          import('./features/consultations/consultation-details/consultation-details').then(
            (m) => m.ConsultationDetails
          ),

        canActivate: [menuAccessGuard('/medical-records')]
      }
    ]
  },

  
//routes
  {
    path: '**',

    redirectTo: 'login'
  }
];
