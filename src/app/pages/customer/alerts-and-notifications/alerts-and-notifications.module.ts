import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AlertsAndNotificationsPage } from './alerts-and-notifications.page';

const routes: Routes = [
  {
    path: '',
    component: AlertsAndNotificationsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AlertsAndNotificationsPage]
})
export class AlertsAndNotificationsPageModule {}
