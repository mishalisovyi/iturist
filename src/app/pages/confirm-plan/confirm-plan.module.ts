import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../components/share.module';

import { ConfirmPlanPage } from './confirm-plan.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmPlanPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [ConfirmPlanPage]
})
export class ConfirmPlanPageModule {}
