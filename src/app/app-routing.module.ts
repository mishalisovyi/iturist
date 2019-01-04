import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'choose-company', pathMatch: 'full' },
  { path: 'choose-company', loadChildren: './pages/choose-company/choose-company.module#ChooseCompanyPageModule' },
  { path: 'order-sim', loadChildren: './pages/order-sim/order-sim.module#OrderSimPageModule' },
  { path: 'choose-plan/:id', loadChildren: './pages/choose-plan/choose-plan.module#ChoosePlanPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
