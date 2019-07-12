import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { NoDataMessageComponent } from 'src/app/components/no-data-message/no-data-message.component';

import { PhoneNumberPipe } from 'src/app/pipes/phone-number.pipe';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [HeaderComponent, PhoneNumberPipe, NoDataMessageComponent],
  exports: [HeaderComponent, PhoneNumberPipe, NoDataMessageComponent]
})
export class SharedModule { }
