import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from 'src/app/components/share.module';

import { CheckUpDisclaimerPage } from 'src/app/pages/customer/check-up-disclaimer/check-up-disclaimer.page';

const routes: Routes = [
  {
    path: '',
    component: CheckUpDisclaimerPage
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
  declarations: [CheckUpDisclaimerPage]
})
export class CheckUpDisclaimerPageModule {}
