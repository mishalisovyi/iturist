import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from 'src/app/components/share.module';

import { DoctorAppointmentPage } from 'src/app/pages/customer/doctor-appointment/doctor-appointment.page';

const routes: Routes = [
  {
    path: '',
    component: DoctorAppointmentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DoctorAppointmentPage]
})
export class DoctorAppointmentPageModule {}
