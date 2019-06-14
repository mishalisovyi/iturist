import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';

import { LanguageService } from '../../../services/language.service';
import { StorageService } from 'src/app/services/storage.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-online-doctor-choose',
  templateUrl: './online-doctor-choose.page.html',
  styleUrls: ['./online-doctor-choose.page.scss'],
})
export class OnlineDoctorChoosePage {

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
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('online_doctor_choose');
  }

  private callToDoctor() {
    this.storage.get('token').subscribe(res => {
      if (res) this.callNumber.callNumber("+97233724296", true);
    })
  }

  private async createAlert() {
    let buttons = [{
      text: this.text.purchase ? this.text.purchase : 'Purchase',
      role: 'purchase'
    }]

    if (this.points > 0) {
      buttons.push({
        text: this.text.call ? this.text.call : 'Call',
        role: 'call'
      });
      buttons = buttons.reverse();
    }

    const alert = await this.alert.create({
      message: this.points === 0 ? this.text.negative_calls_balance : `${this.text.positive_calls_balance_first} ${this.points}. ${this.text.positive_calls_balance_second}`,
      buttons
    });
    await alert.present();

    alert.onDidDismiss().then(({ role }: any) => {
      console.log(role);
      if (role === 'purchase') {
        this.router.navigateByUrl('/calls-packages');
        return;
      }
      if (role === 'call') {
        this.callToDoctor();
      }
    });
  }

  public checkCalls() {
    this.api.getProfile().subscribe(({ content: { call_points } }) => {
      this.points = call_points;

      this.createAlert();
    });
  }


  public callToAmbulance() {
    this.callNumber.callNumber("101", true);
  }

  public navigate(route: string) {
    this.router.navigateByUrl(`/${route}`);
  }
}