import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/components/share.module';

import { IonicModule } from '@ionic/angular';

import { CheckUpServicesStartPage } from 'src/app/pages/customer/check-up-services-start/check-up-services-start.page';

const routes: Routes = [
  {
    path: '',
    component: CheckUpServicesStartPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CheckUpServicesStartPage]
})
export class CheckUpServicesStartPageModule { }
