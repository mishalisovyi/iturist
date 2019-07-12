import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from 'src/app/components/share.module';

import { QrCodeReaderPage } from 'src/app/pages/customer/qr-code-reader/qr-code-reader.page';

const routes: Routes = [
  {
    path: '',
    component: QrCodeReaderPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [QrCodeReaderPage]
})
export class QrCodeReaderPageModule { }
