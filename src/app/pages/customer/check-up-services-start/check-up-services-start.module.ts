import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../components/share.module';

import { IonicModule } from '@ionic/angular';

import { CheckUpServicesStartPage } from './check-up-services-start.page';

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
