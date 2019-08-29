import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OnboardingTourPage } from 'src/app/pages/customer/onboarding-tour/onboarding-tour.page';
import { Slide1Component } from 'src/app/pages/customer/onboarding-tour/slides/slide1/slide1.component';
import { Slide2Component } from 'src/app/pages/customer/onboarding-tour/slides/slide2/slide2.component';
import { Slide3Component } from 'src/app/pages/customer/onboarding-tour/slides/slide3/slide3.component';
import { Slide4Component } from 'src/app/pages/customer/onboarding-tour/slides/slide4/slide4.component';
import { Slide5Component } from 'src/app/pages/customer/onboarding-tour/slides/slide5/slide5.component';

const routes: Routes = [
  {
    path: '',
    component: OnboardingTourPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OnboardingTourPage, Slide1Component, Slide2Component, Slide3Component, Slide4Component, Slide5Component]
})
export class OnboardingTourPageModule { }
