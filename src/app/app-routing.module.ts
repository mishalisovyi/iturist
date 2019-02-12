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
    loadChildren: './pages/choose-company/choose-company.module#ChooseCompanyPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'order-sim',
    loadChildren: './pages/order-sim/order-sim.module#OrderSimPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'choose-plan/:companyId',
    loadChildren: './pages/choose-plan/choose-plan.module#ChoosePlanPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'confirm-plan/:planId',
    loadChildren: './pages/confirm-plan/confirm-plan.module#ConfirmPlanPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'my-plan',
    loadChildren: './pages/my-plan/my-plan.module#MyPlanPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'main',
    loadChildren: './pages/main/main.module#MainPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'profile-start',
    loadChildren: './pages/profile-start/profile-start.module#ProfileStartPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: './pages/profile/profile.module#ProfilePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'doctor-call-room',
    loadChildren: './pages/doctor-call-room/doctor-call-room.module#DoctorCallRoomPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'doctor-call-list',
    loadChildren: './pages/doctor-call-list/doctor-call-list.module#DoctorCallListPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'online-doctor-start',
    loadChildren: './pages/online-doctor-start/online-doctor-start.module#OnlineDoctorStartPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'online-doctor',
    loadChildren: './pages/online-doctor/online-doctor.module#OnlineDoctorPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    loadChildren: './pages/register/register.module#RegisterPageModule',
    canActivate: [GuestGuard]
  },
  {
    path: 'login',
    loadChildren: './pages/login/login.module#LoginPageModule',
    canActivate: [GuestGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
