import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, Validators, FormControl } from "@angular/forms";

import { AlertController } from '@ionic/angular';

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
    private alert: AlertController
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