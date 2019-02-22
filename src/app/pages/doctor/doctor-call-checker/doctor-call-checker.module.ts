import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DoctorCallCheckerPage } from './doctor-call-checker.page';

const routes: Routes = [
  {
    path: '',
    component: DoctorCallCheckerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DoctorCallCheckerPage]
})
export class DoctorCallCheckerPageModule {}
