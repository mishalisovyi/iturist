import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from 'src/app/components/share.module';

import { OnlineDoctorStartPage } from 'src/app/pages/customer/online-doctor-start/online-doctor-start.page';

const routes: Routes = [
  {
    path: '',
    component: OnlineDoctorStartPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [OnlineDoctorStartPage]
})
export class OnlineDoctorStartPageModule {}
