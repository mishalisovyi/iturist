import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NgxMaskIonicModule } from 'ngx-mask-ionic';

import { SetStartInfoPage } from 'src/app/pages/customer/set-start-info/set-start-info.page';

const routes: Routes = [
  {
    path: '',
    component: SetStartInfoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgxMaskIonicModule
  ],
  declarations: [SetStartInfoPage]
})
export class SetStartInfoPageModule {}
