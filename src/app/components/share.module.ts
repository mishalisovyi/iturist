import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';

import { PhoneNumberPipe } from '../pipes/phone-number.pipe';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [HeaderComponent, PhoneNumberPipe],
  exports: [HeaderComponent, PhoneNumberPipe],
})
export class SharedModule { }
