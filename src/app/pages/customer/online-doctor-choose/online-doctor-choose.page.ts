import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CallNumber } from '@ionic-native/call-number/ngx';

import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-online-doctor-choose',
  templateUrl: './online-doctor-choose.page.html',
  styleUrls: ['./online-doctor-choose.page.scss'],
})
export class OnlineDoctorChoosePage {

  public text: any;

  constructor(private router: Router, private language: LanguageService, private callNumber: CallNumber) { }

  ionViewWillEnter() {
    this.getPageText();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('online_doctor_choose');
  }

  public call() {
    this.callNumber.callNumber("0982026637", true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  public navigate(route: string) {
    this.router.navigateByUrl(`/${route}`);
  }
}