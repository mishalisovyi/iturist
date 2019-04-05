import { Component } from '@angular/core';

import { ApiService } from '../../../services/api.service';
import { LanguageService } from '../../../services/language.service';

import { BaseResponse } from '../../../models/models';

@Component({
  selector: 'app-online-doctor-prescriptions',
  templateUrl: './online-doctor-prescriptions.page.html',
  styleUrls: ['./online-doctor-prescriptions.page.scss'],
})
export class OnlineDoctorPrescriptionsPage {

  public text: any;
  public prescriptions: Array<any>;

  constructor(private language: LanguageService, private api: ApiService) { }

  ionViewWillEnter() {
    this.getPageText();
    this.getPrescriptions();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories();
  }

  private getPrescriptions() {
    this.api.getPrescriptions().subscribe((res: BaseResponse) => this.prescriptions = res.content);
  }
}