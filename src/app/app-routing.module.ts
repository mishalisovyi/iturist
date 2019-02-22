import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  {
    path: 'choose-company',
    loadChildren: './pages/customer/choose-company/choose-company.module#ChooseCompanyPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'order-sim',
    loadChildren: './pages/customer/order-sim/order-sim.module#OrderSimPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'choose-plan/:companyId',
    loadChildren: './pages/customer/choose-plan/choose-plan.module#ChoosePlanPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'confirm-plan/:planId',
    loadChildren: './pages/customer/confirm-plan/confirm-plan.module#ConfirmPlanPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'my-plan',
    loadChildren: './pages/customer/my-plan/my-plan.module#MyPlanPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'main',
    loadChildren: './pages/customer/main/main.module#MainPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'profile-start',
    loadChildren: './pages/customer/profile-start/profile-start.module#ProfileStartPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: './pages/customer/profile/profile.module#ProfilePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'doctor-call-checker',
    loadChildren: './pages/doctor/doctor-call-checker/doctor-call-checker.module#DoctorCallCheckerPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'doctor-call-room',
    loadChildren: './pages/doctor/doctor-call-room/doctor-call-room.module#DoctorCallRoomPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'doctor-call-list',
    loadChildren: './pages/doctor/doctor-call-list/doctor-call-list.module#DoctorCallListPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'online-doctor-start',
    loadChildren: './pages/customer/online-doctor-start/online-doctor-start.module#OnlineDoctorStartPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'online-doctor',
    loadChildren: './pages/customer/online-doctor/online-doctor.module#OnlineDoctorPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'client-call-room',
    loadChildren: './pages/customer/client-call-room/client-call-room.module#ClientCallRoomPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'callees-list',
    loadChildren: './pages/doctor/callees-list/callees-list.module#CalleesListPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    loadChildren: './pages/auth/register/register.module#RegisterPageModule',
    canActivate: [GuestGuard]
  },
  {
    path: 'login',
    loadChildren: './pages/auth/login/login.module#LoginPageModule',
    canActivate: [GuestGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
