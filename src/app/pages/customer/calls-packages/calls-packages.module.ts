import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from 'src/app/components/share.module';

import { CallsPackagesPage } from 'src/app/pages/customer/calls-packages/calls-packages.page';

const routes: Routes = [
  {
    path: '',
    component: CallsPackagesPage
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
  declarations: [CallsPackagesPage]
})
export class CallsPackagesPageModule {}
