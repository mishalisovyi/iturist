import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { NoDataMessageComponent } from 'src/app/components/no-data-message/no-data-message.component';

import { PhoneNumberPipe } from 'src/app/pipes/phone-number.pipe';
import { CreatePrescriptionModalComponent } from './create-prescription-modal/create-prescription-modal.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [HeaderComponent, PhoneNumberPipe, NoDataMessageComponent, CreatePrescriptionModalComponent],
  exports: [HeaderComponent, PhoneNumberPipe, NoDataMessageComponent],
  entryComponents: [CreatePrescriptionModalComponent]
})
export class SharedModule { }
