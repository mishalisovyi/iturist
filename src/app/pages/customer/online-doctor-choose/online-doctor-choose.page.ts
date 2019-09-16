import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';

import { LanguageService } from 'src/app/services/language.service';
import { StorageService } from 'src/app/services/storage.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-online-doctor-choose',
  templateUrl: './online-doctor-choose.page.html',
  styleUrls: ['./online-doctor-choose.page.scss'],
})
export class OnlineDoctorChoosePage {

  private isPassportImageExist: boolean;

  public text: any;
  public points: number;

  constructor(
    private router: Router,
    private language: LanguageService,
    private callNumber: CallNumber,
    private storage: StorageService,
    private api: ApiService,
    private alert: AlertController
  ) { }

  ionViewWillEnter() {
    this.getPageText();
    this.getProfileInfo();
  }

  private getProfileInfo() {
    this.api.getProfile().subscribe(({ content: { call_points, passport_image } }) => {
      this.points = call_points;
      this.isPassportImageExist = !!passport_image;
    });
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('online_doctor_choose');
  }

  private callToDoctor() {
    this.storage.get('token').subscribe(res => {
      if (res) {
        this.callNumber.callNumber('+97233724296', true);
      }
    });
  }

  public async checkPassportImage(functionToCall: Function, param: string = null) {
    if (this.isPassportImageExist) {
      functionToCall.bind(this, param)();
      return;
    }

    const alert = await this.alert.create({
      message: this.text
        ? this.text.need_upload_passport_photo
        : 'You need to upload your passport photo in your profile for having access to this functionality',
      buttons: [this.text ? this.text.ok.toUpperCase() : 'Ok']
    });

    await alert.present();

    alert.onDidDismiss().then(() => this.navigate('/profile'));
  }

  public async createAlert() {
    let buttons = [{
      text: this.text.purchase ? this.text.purchase : 'Purchase',
      role: 'purchase'
    }];

    if (this.points > 0) {
      buttons.push({
        text: this.text.call ? this.text.call : 'Call',
        role: 'call'
      });
      buttons = buttons.reverse();
    }

    const alert = await this.alert.create({
      message: this.points === 0
        // ? this.text.negative_calls_balance
        ? 'Your call balance is equal 0. If you want to perform call, you should purchase calls package'
        // : `${this.text.positive_calls_balance_first} ${this.points}. ${this.text.positive_calls_balance_second}`,
        : `Your call balance is equal ${this.points}. You can perform call or purchase new calls package`,
      buttons
    });
    await alert.present();

    alert.onDidDismiss().then(({ role }: any) => {
      if (role === 'purchase') {
        this.router.navigateByUrl('/calls-packages');
        return;
      }
      if (role === 'call') {
        this.callToDoctor();
      }
    });
  }

  public callToAmbulance() {
    this.callNumber.callNumber('101', true);
  }

  public navigate(route: string) {
    this.router.navigateByUrl(`/${route}`);
  }
}
