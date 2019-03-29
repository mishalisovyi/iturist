import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'choose-company',
    loadChildren: './pages/customer/choose-company/choose-company.module#ChooseCompanyPageModule',
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
    loadChildren: './pages/customer/main/main.module#MainPageModule'
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
    path: 'my-requests',
    loadChildren: './pages/customer/my-requests/my-requests.module#MyRequestsPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'alerts-and-notifications',
    loadChildren: './pages/customer/alerts-and-notifications/alerts-and-notifications.module#AlertsAndNotificationsPageModule'
  },
  {
    path: 'sim-card-start',
    loadChildren: './pages/customer/sim-card-start/sim-card-start.module#SimCardStartPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'order-sim-start',
    loadChildren: './pages/customer/order-sim-start/order-sim-start.module#OrderSimStartPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'addresses-list',
    loadChildren: './pages/customer/addresses-list/addresses-list.module#AddressesListPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'order-sim-form',
    loadChildren: './pages/customer/order-sim-form/order-sim-form.module#OrderSimFormPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'alerts-and-notifications-start',
    loadChildren: './pages/customer/alerts-and-notifications-start/alerts-and-notifications-start.module#AlertsAndNotificationsStartPageModule'
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
  },
  {
    path: 'forgot-password',
    loadChildren: './pages/auth/forgot-password/forgot-password.module#ForgotPasswordPageModule',
    canActivate: [GuestGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
