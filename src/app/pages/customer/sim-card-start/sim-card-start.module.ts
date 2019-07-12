import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from 'src/app/components/share.module';

import { SimCardStartPage } from 'src/app/pages/customer/sim-card-start/sim-card-start.page';

const routes: Routes = [
  {
    path: '',
    component: SimCardStartPage
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
  declarations: [SimCardStartPage]
})
export class SimCardStartPageModule {}
