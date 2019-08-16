import { Component } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { LanguageService } from 'src/app/services/language.service';

import { Object } from 'src/app/models/models';

@Component({
  selector: 'app-create-prescription-modal',
  templateUrl: './create-prescription-modal.component.html',
  styleUrls: ['./create-prescription-modal.component.scss']
})
export class CreatePrescriptionModalComponent {

  public text: Object;

  constructor(private modalController: ModalController, private language: LanguageService) { }

  ionViewWillEnter() {
    this.getPageText();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('online_doctor_prescriptions');
  }

  public closeModal() {
    this.modalController.dismiss();
  }

  navigateTo(to: string) {
    console.log(to);
  }
}
