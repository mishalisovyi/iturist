import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';
import { NetworkGuard } from './guards/network.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'choose-company',
    loadChildren: './pages/customer/choose-company/choose-company.module#ChooseCompanyPageModule',
    canActivate: [AuthGuard, NetworkGuard]
  },
  {
    path: 'choose-plan/:companyId',
    loadChildren: './pages/customer/choose-plan/choose-plan.module#ChoosePlanPageModule',
    canActivate: [AuthGuard, NetworkGuard]
  },
  {
    path: 'confirm-plan/:companyId/:planId',
    loadChildren: './pages/customer/confirm-plan/confirm-plan.module#ConfirmPlanPageModule',
    canActivate: [AuthGuard, NetworkGuard]
  },
  {
    path: 'my-plan',
    loadChildren: './pages/customer/my-plan/my-plan.module#MyPlanPageModule',
    canActivate: [AuthGuard, NetworkGuard]
  },
  {
    path: 'main',
    loadChildren: './pages/customer/main/main.module#MainPageModule',
    canActivate: [NetworkGuard]
  },
  {
    path: 'profile-start',
    loadChildren: './pages/customer/profile-start/profile-start.module#ProfileStartPageModule',
    canActivate: [AuthGuard, NetworkGuard]
  },
  {
    path: 'profile',
    loadChildren: './pages/customer/profile/profile.module#ProfilePageModule',
    canActivate: [AuthGuard, NetworkGuard]
  },
  {
    path: 'my-requests',
    loadChildren: './pages/customer/my-requests/my-requests.module#MyRequestsPageModule',
    canActivate: [AuthGuard, NetworkGuard]
  },
  {
    path: 'alerts-and-notifications',
    loadChildren: './pages/customer/alerts-and-notifications/alerts-and-notifications.module#AlertsAndNotificationsPageModule',
    canActivate: [NetworkGuard]
  },
  {
    path: 'sim-card-start',
    loadChildren: './pages/customer/sim-card-start/sim-card-start.module#SimCardStartPageModule',
    canActivate: [AuthGuard, NetworkGuard]
  },
  {
    path: 'enter-mobile-number/:companyId/:planId',
    loadChildren: './pages/customer/enter-mobile-number/enter-mobile-number.module#EnterMobileNumberPageModule',
    canActivate: [AuthGuard, NetworkGuard]
  },
  {
    path: 'order-sim-start',
    loadChildren: './pages/customer/order-sim-start/order-sim-start.module#OrderSimStartPageModule',
    canActivate: [NetworkGuard]
  },
  {
    path: 'addresses-list',
    loadChildren: './pages/customer/addresses-list/addresses-list.module#AddressesListPageModule',
    canActivate: [NetworkGuard]
  },
  {
    path: 'order-sim-form',
    loadChildren: './pages/customer/order-sim-form/order-sim-form.module#OrderSimFormPageModule',
    canActivate: [NetworkGuard]
  },
  {
    path: 'alerts-and-notifications-start',
    loadChildren: './pages/customer/alerts-and-notifications-start/alerts-and-notifications-start.module#AlertsAndNotificationsStartPageModule',
    canActivate: [NetworkGuard]
  },
  {
    path: 'register',
    loadChildren: './pages/auth/register/register.module#RegisterPageModule',
    canActivate: [GuestGuard, NetworkGuard]
  },
  {
    path: 'login',
    loadChildren: './pages/auth/login/login.module#LoginPageModule',
    canActivate: [GuestGuard, NetworkGuard]
  },
  {
    path: 'forgot-password',
    loadChildren: './pages/auth/forgot-password/forgot-password.module#ForgotPasswordPageModule',
    canActivate: [GuestGuard, NetworkGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
