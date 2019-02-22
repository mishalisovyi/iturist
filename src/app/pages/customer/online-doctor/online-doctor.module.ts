import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from "../../../components/share.module";

import { OnlineDoctorPage } from './online-doctor.page';

const routes: Routes = [
  {
    path: '',
    component: OnlineDoctorPage
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
  declarations: [OnlineDoctorPage]
})
export class OnlineDoctorPageModule { }
