import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from 'src/app/components/share.module';

import { WeatherStartPage } from 'src/app/pages/customer/weather-start/weather-start.page';

const routes: Routes = [
  {
    path: '',
    component: WeatherStartPage
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
  declarations: [WeatherStartPage]
})
export class WeatherStartPageModule { }
