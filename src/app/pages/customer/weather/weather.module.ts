import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChartjsModule } from '@ctrl/ngx-chartjs';

import { SharedModule } from 'src/app/components/share.module';

import { WeatherPage } from 'src/app/pages/customer/weather/weather.page';

const routes: Routes = [
  {
    path: '',
    component: WeatherPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ChartjsModule,
    SharedModule
  ],
  declarations: [WeatherPage]
})
export class WeatherPageModule {}
