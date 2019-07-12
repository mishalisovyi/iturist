import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/components/share.module';

import { IonicModule } from '@ionic/angular';

import { CheckUpServicesPage } from 'src/app/pages/customer/check-up-services/check-up-services.page';

const routes: Routes = [
  {
    path: '',
    component: CheckUpServicesPage
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
  declarations: [CheckUpServicesPage]
})
export class CheckUpServicesPageModule {}
