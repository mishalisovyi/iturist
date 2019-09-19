import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AlertController, Platform } from '@ionic/angular';
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';

import { iif, throwError } from 'rxjs';
import { map, switchMap, finalize } from 'rxjs/operators';
import * as moment from 'moment';

import { ApiService } from 'src/app/services/api.service';
import { LanguageService } from 'src/app/services/language.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-check-up-services',
  templateUrl: './check-up-services.page.html',
  styleUrls: ['./check-up-services.page.scss'],
})
export class CheckUpServicesPage implements OnInit {

  private browser: InAppBrowserObject;
  private tranzilaCss = `
    #header, #footergreenstripe, #geo {
      display: none;
    }
    ul {
     margin-top: 30px;
    }
    li {
     height: 50px;
    }
    span, a, input, select {
      color: #7C8BFE;
    }
    input, select {
      height: 30px;
      background-color: #F2F6FC;
      border: 0 !important;
    }
    select {
      vertical-align: unset !important;
    }
    #send {
      margin-top: 20px;
    }
    #send button {
      width: 100%;
      border-radius: 0 !important;
      background: linear-gradient(to right, #6c9eff, #a25ffd) !important;
      height: 60px;
      margin-top: 30px;
    }
 `;

  public dateControl: FormControl;
  public colonoscopy = false;
  public oncomarkers = false;
  public submitTry = false;
  public total = 2800;
  public correctDate: boolean;
  public customPickerOptions: any;
  public date: string = moment().format();
  public text: any;

  constructor(
    private api: ApiService,
    private alert: AlertController,
    private router: Router,
    private iab: InAppBrowser,
    private platform: Platform,
    private language: LanguageService,
    private loading: LoadingService
  ) {
    this.customPickerOptions = {
      buttons: [{
        text: this.text ? this.text.cancel : 'Cancel'
      }, {
        text: this.text ? this.text.save : 'Save',
        handler: (value: any) => {
          const date = new Date(value.year.value, value.month.value - 1, value.day.value);
          this.date = moment(date).format();
          this.dateControl.setValue(moment(this.date).format('DD-MM-YYYY'));
          this.correctDate = moment(this.date) >= moment().startOf('day');
          this.validateDate(date);
        }
      }]
    };
  }

  ngOnInit() {
    this.createControl();
  }

  ionViewWillEnter() {
    this.getPageText();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('check_up_services');
  }

  private createControl() {
    this.dateControl = new FormControl('', [Validators.required]);
  }

  private validateDate(date: Date) {
    this.dateControl.setErrors(null);
    if ([5, 6].includes(moment(date).isoWeekday())) {
      this.dateControl.setErrors({ wrongDay: true });
    }
  }

  private openInAppBrowser(userId: number, price: number, productId: number) {
    this.browser = this.iab.create(
      // tslint:disable-next-line: max-line-length
      `https://direct.tranzila.com/diplomacy/newiframe.php?user_id=${userId}&sum=${price}&currency=1&tranmode=AK&payment_type=CHECK-UP-REQUEST&product_id=${productId}`,
      '_blank',
      { hideurlbar: 'yes', location: 'yes' }
    );
    this.browser.insertCSS({ code: this.tranzilaCss });
    if (this.platform.is('android')) {
      this.browser.hide();
    }

    this.browser.on('loadstop').subscribe(async () => {
      await this.browser.insertCSS({ code: this.tranzilaCss });
      if (this.platform.is('android')) {
        this.browser.show();
      }

      this.browser.executeScript({
        code: `
          localStorage.setItem('status', '');
          const button = document.getElementById('ok');
          button.addEventListener('click', () => localStorage.setItem('status', 'close'));
        `
      });
      if (this.platform.is('ios')) {
        this.browser.executeScript({
          code: `
            document.addEventListener('touchend', (e) => {
              if (document.activeElement !== e.target) {
                document.activeElement.blur();
              }
           })
          `
        });
      }

      const interval = setInterval(async () => {
        const values: Array<any> = await this.browser.executeScript({ code: 'localStorage.getItem("status")' });
        const status = values[0];
        if (status) {
          await this.browser.executeScript({ code: 'localStorage.setItem("status", "")' });
          clearInterval(interval);
          this.browser.close();
        }
      }, 300);
    });

    this.browser.on('exit').subscribe(() => this.router.navigateByUrl('/online-doctor-choose'));
  }

  public changeTotal({ detail: { checked } }, service: string) {
    const diff: number = service === 'oncomarkers' ? 1300 : 1822;
    this.total = checked ? this.total + diff : this.total - diff;
  }

  public navigateToDisclaimer() {
    this.router.navigateByUrl('/check-up-disclaimer');
  }

  public async submitCheckup() {
    this.submitTry = true;

    if (this.dateControl.valid && this.correctDate) {
      const parts = this.dateControl.value.split('-');
      const originalDate = `${parts[1]}/${parts[0]}/${parts[2]}`;

      await this.loading.createLoading(this.text ? this.text.wait_please : 'Wait, please');

      this.api.getProfile()
        .pipe(
          map(res => res.content.travel_image),
          switchMap(res => iif(
            () => res,
            this.api.submitCheckupService({
              visit_date: moment(new Date(originalDate)).format('YYYY-MM-DDTHH:mm:ss'),
              colonoscopy: this.colonoscopy,
              oncomarker: this.oncomarkers
            }),
            throwError({ error: 'need travel insurance photo' })
          )),
          finalize(async () => await this.loading.dismissLoading())
        )
        .subscribe(
          res => {
            this.openInAppBrowser(res.content.user.id, res.content.price, res.content.id);
          },

          async err => {
            console.log(err);

            const alert = await this.alert.create({
              message: this.text
                ? this.text.need_upload_insurance
                : 'You need to upload your travel insurance photo for having this check up service',
              buttons: [this.text ? this.text.ok.toUpperCase() : 'Ok']
            });

            await alert.present();
            alert.onDidDismiss().then(() => this.router.navigateByUrl('/profile'));
          }
        );
    }
  }
}
