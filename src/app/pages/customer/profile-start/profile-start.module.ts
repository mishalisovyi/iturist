import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfileStartPage } from 'src/app/pages/customer/profile-start/profile-start.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileStartPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProfileStartPage]
})
export class ProfileStartPageModule {}
