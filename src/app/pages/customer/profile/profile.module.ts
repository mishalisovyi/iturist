import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxMaskIonicModule } from 'ngx-mask-ionic';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../../components/share.module';

import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgxMaskIonicModule,
    SharedModule
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
