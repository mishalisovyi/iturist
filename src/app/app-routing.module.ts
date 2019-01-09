import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'choose-company', pathMatch: 'full' },
  { path: 'choose-company', loadChildren: './pages/choose-company/choose-company.module#ChooseCompanyPageModule' },
  { path: 'order-sim', loadChildren: './pages/order-sim/order-sim.module#OrderSimPageModule' },
  { path: 'choose-plan/:companyId', loadChildren: './pages/choose-plan/choose-plan.module#ChoosePlanPageModule' },
  { path: 'confirm-plan/:planId', loadChildren: './pages/confirm-plan/confirm-plan.module#ConfirmPlanPageModule' },
  { path: 'my-plan', loadChildren: './pages/my-plan/my-plan.module#MyPlanPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
