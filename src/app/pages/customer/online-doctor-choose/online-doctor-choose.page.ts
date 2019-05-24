import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CallNumber } from '@ionic-native/call-number/ngx';

import { LanguageService } from '../../../services/language.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-online-doctor-choose',
  templateUrl: './online-doctor-choose.page.html',
  styleUrls: ['./online-doctor-choose.page.scss'],
})
export class OnlineDoctorChoosePage {

  public text: any;

  constructor(private router: Router, private language: LanguageService, private callNumber: CallNumber, private storage: StorageService) { }

  ionViewWillEnter() {
    this.getPageText();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('online_doctor_choose');
  }

  public callToDoctor() {
    this.storage.get('token').subscribe(res => {
      if (res) this.callNumber.callNumber("+97233724296", true);
    })
  }

  public callToAmbulance() {
    this.callNumber.callNumber("101", true);
  }

  public navigate(route: string) {
    this.router.navigateByUrl(`/${route}`);
  }
}