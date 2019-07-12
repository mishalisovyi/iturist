import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, Validators, FormControl } from '@angular/forms';

import { AlertController, Platform } from '@ionic/angular';
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';

import { Subscription } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';

import { ApiService } from 'src/app/services/api.service';
import { LanguageService } from 'src/app/services/language.service';
import { LoadingService } from 'src/app/services/loading.service';

import { BaseResponse } from 'src/app/models/models';

@Component({
  selector: 'app-enter-mobile-number',
  templateUrl: './enter-mobile-number.page.html',
  styleUrls: ['./enter-mobile-number.page.scss'],
})
export class EnterMobileNumberPage implements OnInit {

  private planId: string;
  private companyId: string;
  private userId: number;
  private subscription: Subscription;
  private browser: InAppBrowserObject;

  public phoneNumber: AbstractControl;
  public hideBage: boolean;
  public submitTry: boolean;
  public text: any;
  public defaultHref: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private language: LanguageService,
    private loading: LoadingService,
    private alert: AlertController,
    private iab: InAppBrowser,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.initInput();
  }

  ionViewWillEnter() {
    this.getPageText();
    this.getQueryParams();
    this.getDefaultHref();
    this.setNumber();
    this.defineHidingBages();
  }

  ionViewWillLeave() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private openInAppBrowser() {
    this.browser = this.iab.create(
      // tslint:disable-next-line: max-line-length
      `https://icom.yaad.net/p/?&action=pay&Masof=0010104820&Info=Register_DC&UTF8out=True&Amount=1&UTF8=True&Order=${this.userId}&Coin=1&J5=True&PassP=1234&MoreData=True&Tash=1&ClientName=dsadsa`,
      '_blank',
      { beforeload: 'yes', hideurlbar: 'yes', location: 'yes' }
    );

    if (this.platform.is('android')) {
      this.browser.hide();
    }

    this.browser.on('loadstop').subscribe(async () => {
      // await this.browser.insertCSS({ code: this.tranzilaCss });
      if (this.platform.is('android')) {
        this.browser.show();
      }

      this.browser.executeScript({
        code: `
          const startStorageContent = JSON.stringify({ status: '', errors: 0 });
          localStorage.setItem('storageContent', startStorageContent);
          const button = document.getElementById('btnSubmit');
          button.addEventListener('click', () => {
            setTimeout(() => {
              const elements = document.getElementsByClassName('errNot');
              if (elements.length === 0) {
                const storageContent = JSON.parse(localStorage.getItem('storageContent'));
                storageContent.status = 'close';
                localStorage.setItem('storageContent', JSON.stringify(storageContent));
              }
            }, 400);
          });
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
        let value = await this.browser.executeScript({ code: 'localStorage.getItem("storageContent")' });
        value = JSON.parse(value[0]);
        if (value.status === 'close' && value.errors === 0) {
          clearInterval(interval);
          this.browser.close();
          this.navigateTo('choose-credit-card', { planId: this.planId, companyId: this.companyId });
          return;
        }

        await this.browser.executeScript({
          code: `
            const elements = document.getElementsByClassName('errNot');
            const storageContent = JSON.parse(localStorage.getItem('storageContent'));
            storageContent.errors = elements.length;
            localStorage.setItem('storageContent', JSON.stringify(storageContent));
          `
        });
      }, 300);
    });

    this.browser.on('exit').subscribe(res => console.log('exit from browser ', res));
  }

  private getQueryParams() {
    this.route.queryParamMap.subscribe(params => {
      this.planId = params.get('planId');
      this.companyId = params.get('companyId');
    });
  }

  private defineHidingBages(url: string = this.router.url) {
    this.hideBage = true;

    this.api.getMyPlan().subscribe(res => {
      if (res) {
        this.hideBage = false;
      }
    });
  }

  private setNumber() {
    this.api.getProfile().subscribe((res: BaseResponse) => {
      this.userId = res.content.user_id;
      const number: string = res && res.content.phone;
      if (number) {
        this.phoneNumber.setValue(number.replace(/972/, ''));
      }
    });
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('enter_mobile_number');
  }

  private initInput() {
    // this.phoneNumber = new FormControl('', [Validators.required, Validators.pattern('^\\+?[\\d]+$')]);
    this.phoneNumber = new FormControl('', Validators.required);
  }

  private getDefaultHref() {
    this.defaultHref = `choose-plan/${this.companyId}`;
  }

  private async createAlert(message: string): Promise<HTMLIonAlertElement> {
    const alert = await this.alert.create({
      message,
      buttons: [this.text.ok]
    });
    await alert.present();
    return alert;
  }

  public navigateTo(route: string, params = null) {
    this.router.navigate([`/${route}`], { queryParams: { ...params } });
  }

  public validatePhone() {
    const value = this.phoneNumber.value;
    if (this.phoneNumber.hasError('required')) {
      return;
    }

    this.phoneNumber.setErrors(null);
    if (value.includes('+972') && value.length < 14) {
      this.phoneNumber.setErrors({ minlength: true });
    }
    if (!value.includes('+972') && value.length < 9) {
      this.phoneNumber.setErrors({ minlength: true });
    }
  }

  public async confirmNumber() {
    this.submitTry = true;

    if (this.phoneNumber.valid) {
      let phone: string = this.phoneNumber.value;
      if (!phone.includes('+972 ')) {
        phone = '+972 '.concat(phone);
      }
      phone = phone.replace('+972 ', '972');

      await this.loading.createLoading(this.text.confirming_number);

      this.api.editProfile(this.userId, { phone })
        .pipe(
          finalize(async () => await this.loading.dismissLoading()),
          switchMap(() => this.api.getCreditCardsList())
        )
        .subscribe(
          () => this.navigateTo('choose-credit-card', { planId: this.planId, companyId: this.companyId }),
          async err => {
            const noCreditCardError = err.error.metadata.api_error_codes.includes(125);
            const alertElement = await this.createAlert(noCreditCardError ? this.text.attach_credit_card : this.text.unknown_error);

            await alertElement.onDidDismiss();

            if (noCreditCardError) {
              this.openInAppBrowser();
            }
          }
        );
    }
  }
}
