import { Component } from '@angular/core';

import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-online-doctor-prescriptions',
  templateUrl: './online-doctor-prescriptions.page.html',
  styleUrls: ['./online-doctor-prescriptions.page.scss'],
})
export class OnlineDoctorPrescriptionsPage {

  public text: any;

  constructor(private language: LanguageService) { }

  ionViewWillEnter() {
    this.getPageText();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories();
  }
}