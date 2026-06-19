import { Routes } from '@angular/router';

import { AuthLayout } from './layouts/auth-layout/auth-layout';

import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';

import { adminGuard } from './core/guards/admin-guard';

import { authGuard } from './core/guards/auth-guard';

import { Login } from './features/auth/login/login';

import { Register } from './features/auth/register/register';

import { CreatePassword } from './features/auth/create-password/create-password';
import { roleGuard } from './core/guards/role.guard';
import { AdminDashboard } from './features/dashboard/admin-dashboard/admin-dashboard';
import { doctorGuard } from './core/guards/doctor-guard';

import { receptionistGuard } from './core/guards/receptionist-guard';
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
import { nodeGuard } from './core/guards/node.guard';

export const routes: Routes = [
  // Home Routes
  {
    path: '',

    component: Home
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

      redirectTo: 'dashboard/admin',

      pathMatch: 'full'
    },

    // Admin Dashboard
    {
      path: 'dashboard/admin',

      component: AdminDashboard,
      canActivate: [
        authGuard,
        nodeGuard
      ]
    },

    // Doctor Dashboard
    {
      path: 'dashboard/doctor',

      component: DoctorDashboard,
      canActivate: [
        authGuard,
        nodeGuard
      ]
    },

    // Receptionist Dashboard
    {
      path: 'dashboard/receptionist',

      component: ReceptionistDashboard,
      canActivate: [
        authGuard,
        nodeGuard
      ]
    },

    // Employees
    {
      path: 'employees',

      component: EmployeeList,
      canActivate: [
        authGuard,
        nodeGuard
      ]
    },

    {
      path: 'employees/create',

      component: AddEmployee,
      canActivate: [
        authGuard,
        nodeGuard
      ]
    },

    {
      path: 'employees/pending',

      component: PendingEmployees,
      canActivate: [
        authGuard,
        nodeGuard
      ]
    },

    {
      path: 'employees/:id',

      component: EmployeeDetails,
      canActivate: [
        authGuard,
        nodeGuard
      ]
    },

    {
      path: 'employees/edit/:id',

      component: EditEmployee,
      canActivate: [
        authGuard,
        nodeGuard
      ]
    },

    // Patients
    {
      path: 'patients/create',

      component: AddPatient,
      canActivate: [
        authGuard,
        nodeGuard
      ]
    },

    {
      path: 'patients',

      component: PatientList,
      canActivate: [
        authGuard,
        nodeGuard
      ]
    },

    {
      path: 'patients/edit/:id',

      component: EditPatient,
      canActivate: [
        authGuard,
        nodeGuard
      ]
    },

    {
      path: 'patients/:id',

      component: PatientDetails,
      canActivate: [
        authGuard,
        nodeGuard
      ]
    },

    // Appointments
    {
      path: 'appointments/book',

      component: BookAppointment,
      canActivate: [
        authGuard,
        nodeGuard
      ]
    },

    {
      path: 'appointments',

      component: AppointmentList,
      canActivate: [
        authGuard,
        nodeGuard
      ]
    },

    {
      path: 'appointments/requests',

      loadComponent: () =>
        import(
          './features/appointments/appointment-requests/appointment-requests'
        ).then(
          (m) => m.AppointmentRequestsComponent
        ),

      canActivate: [
        authGuard,
        nodeGuard
      ]
    },

    {
      path: 'appointments/edit/:id',

      component: EditAppointment,
      canActivate: [
        authGuard,
        nodeGuard
      ]
    },

    // Doctor
    {
      path: 'doctor-queue',

      component: DoctorQueue,
      canActivate: [
        authGuard,
        nodeGuard
      ]
    },

    {
      path: 'doctor-availability',

      component: DoctorAvailability,
      canActivate: [
        authGuard,
        nodeGuard
      ]
    },

    // Consultations
    {
      path: 'consultation/:appointmentId',

      component: ConsultationForm,
      canActivate: [
        authGuard,
        nodeGuard
      ]
    },

    {
      path: 'consultations',

      component: ConsultationList,
      canActivate: [
        authGuard,
        nodeGuard
      ]
    },

    {
      path: 'consultations/:id',

      loadComponent: () =>
        import(
          './features/consultations/consultation-details/consultation-details'
        ).then(
          (m) => m.ConsultationDetails
        ),

      canActivate: [
        authGuard,
        nodeGuard
      ]
    },

    // Profile
    {
      path: 'my-profile',

      component: MyProfile,
      canActivate: [
        authGuard,
        nodeGuard
      ]
    }
  ]
},

  
//routes
  {
    path: '**',

    redirectTo: 'login'
  }
];
