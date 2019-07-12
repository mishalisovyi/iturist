import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UnboardingTourPage } from 'src/app/pages/customer/unboarding-tour/unboarding-tour.page';

const routes: Routes = [
  {
    path: '',
    component: UnboardingTourPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UnboardingTourPage]
})
export class UnboardingTourPageModule {}
