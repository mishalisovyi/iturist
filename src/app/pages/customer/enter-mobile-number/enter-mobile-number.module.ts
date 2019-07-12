import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxMaskIonicModule } from 'ngx-mask-ionic';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from 'src/app/components/share.module';

import { EnterMobileNumberPage } from 'src/app/pages/customer/enter-mobile-number/enter-mobile-number.page';

const routes: Routes = [
  {
    path: '',
    component: EnterMobileNumberPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgxMaskIonicModule,
    SharedModule
  ],
  declarations: [EnterMobileNumberPage]
})
export class EnterMobileNumberPageModule {}
