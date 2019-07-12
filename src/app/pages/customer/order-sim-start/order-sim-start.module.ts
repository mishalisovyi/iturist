import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from 'src/app/components/share.module';

import { OrderSimStartPage } from 'src/app/pages/customer/order-sim-start/order-sim-start.page';

const routes: Routes = [
  {
    path: '',
    component: OrderSimStartPage
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
  declarations: [OrderSimStartPage]
})
export class OrderSimStartPageModule {}
