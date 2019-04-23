import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, Validators, FormControl } from "@angular/forms";

import { AlertController } from '@ionic/angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ApiService } from '../../../services/api.service';
import { LanguageService } from '../../../services/language.service';
import { LoadingService } from '../../../services/loading.service';

import { BaseResponse } from '../../../models/models';

@Component({
  selector: 'app-enter-mobile-number',
  templateUrl: './enter-mobile-number.page.html',
  styleUrls: ['./enter-mobile-number.page.scss'],
})
export class EnterMobileNumberPage implements OnInit {


  private planId: string;
  private companyId: string;
  private userId: number;
  private scanSubscription: Subscription;

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
    private qrScanner: QRScanner
  ) { }

  ngOnInit() {
    this.initInput();
  }

  ionViewWillEnter() {
    this.getPageText();
    this.getPlanId();
    this.getCompanyId();
    this.getDefaultHref();
    this.setNumber();
    this.defineHidingBages();
  }

  ionViewWillLeave() {
    if (this.scanSubscription) this.scanSubscription.unsubscribe();
    this.qrScanner.hide();
    this.qrScanner.destroy();
    window.document.querySelector('ion-app').classList.remove('cameraView');
  }

  private defineHidingBages(url: string = this.router.url) {
    this.hideBage = true;

    this.api.getMyPlan().subscribe(res => {
      if (res) this.hideBage = false;
    });
  }

  private setNumber() {
    this.api.getProfile().subscribe((res: BaseResponse) => {
      this.userId = res.content.user_id;
      const number: string = res && res.content.phone;
      if (number) this.phoneNumber.setValue(number.replace(/972/, ''));
    });
  }

  private getPageText() {
    this.text = this.language.getTextByCategories("enter_mobile_number");
  }

  private initInput() {
    // this.phoneNumber = new FormControl("", [Validators.required, Validators.pattern('^\\+?[\\d]+$')]);
    this.phoneNumber = new FormControl("", Validators.required);
  }

  private getPlanId() {
    this.planId = this.route.snapshot.params.planId;
  }

  private getCompanyId() {
    this.companyId = this.route.snapshot.params.companyId;
  }

  private getDefaultHref() {
    this.defaultHref = `choose-plan/${this.companyId}`;
  }

  public scan() {
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {

          this.qrScanner.show();
          window.document.querySelector('ion-app').classList.add('cameraView');
          // camera permission was granted
          console.log('authorized');

          // start scanning
          this.scanSubscription = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);
            alert(text);

            this.scanSubscription.unsubscribe(); // stop scanning  
            this.qrScanner.hide(); // hide camera preview   
            this.qrScanner.destroy();
            window.document.querySelector('ion-app').classList.remove('cameraView');
          });

        } else if (status.denied) {
          console.log('status denied');
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          console.log('permissions denied');
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  public navigateTo(route: string) {
    this.router.navigateByUrl(`/${route}`);
  }

  public validatePhone() {
    const value = this.phoneNumber.value;
    if (this.phoneNumber.hasError('required')) return;

    this.phoneNumber.setErrors(null);
    if (value.includes('+972') && value.length < 14) this.phoneNumber.setErrors({ minlength: true });
    if (!value.includes('+972') && value.length < 9) this.phoneNumber.setErrors({ minlength: true });
  }

  public async confirmNumber() {
    this.submitTry = true;

    if (this.phoneNumber.valid) {
      let phone: string = this.phoneNumber.value;
      if (!phone.includes('+972 ')) phone = '+972 '.concat(phone);
      phone = phone.replace('+972 ', '972');

      await this.loading.createLoading(this.text.confirming_number);

      this.api.editProfile(this.userId, { phone })
        .pipe(finalize(async () => await this.loading.dismissLoading()))
        .subscribe(
          () => this.navigateTo(`confirm-plan/${this.companyId}/${this.planId}`),
          async () => {
            let message: string = this.text.unknown_error;
            const alert = await this.alert.create({
              message,
              buttons: [this.text.ok]
            });
            await alert.present();
          }
        )
    }
  }
}