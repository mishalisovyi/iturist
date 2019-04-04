import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../../components/share.module';

import { OnlineDoctorChoosePage } from './online-doctor-choose.page';

const routes: Routes = [
  {
    path: '',
    component: OnlineDoctorChoosePage
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
  declarations: [OnlineDoctorChoosePage]
})
export class OnlineDoctorChoosePageModule {}
