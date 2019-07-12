import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from 'src/app/components/share.module';

import { OnlineDoctorCallsListPage } from 'src/app/pages/customer/online-doctor-calls-list/online-doctor-calls-list.page';

const routes: Routes = [
  {
    path: '',
    component: OnlineDoctorCallsListPage
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
  declarations: [OnlineDoctorCallsListPage]
})
export class OnlineDoctorCallsListPageModule {}
