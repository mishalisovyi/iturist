import { Component, OnInit } from '@angular/core';
import { AbstractControl, Validators, FormControl } from "@angular/forms";
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';

import { finalize } from 'rxjs/operators';

import { LanguageService } from '../../../services/language.service';
import { ApiService } from '../../../services/api.service';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  public email: AbstractControl;
  public submitTry: boolean;
  public text: any;

  constructor(
    private router: Router,
    private language: LanguageService,
    private alert: AlertController,
    private api: ApiService,
    private loading: LoadingService
  ) { }

  ngOnInit() {
    this.initInput();
  }

  ionViewWillEnter() {
    this.resetInput();
    this.getPageText();
  }

  private resetInput() {
    this.submitTry = false;
    this.email.setValue("");
  }

  private initInput() {
    this.email = new FormControl("", [Validators.required, Validators.email]);
  }

  private getPageText() {
    this.text = this.language.getTextByCategories("forgot_password");
  }

  public navigate(route: string) {
    this.router.navigateByUrl(`/${route}`);
  }

  public async confirmEmail() {
    this.submitTry = true;

    if (this.email.valid) {
      await this.loading.createLoading(this.text.sending);

      this.api.sendEmail(this.email.value)
        .pipe(finalize(async () => await this.loading.dismissLoading()))
        .subscribe(
          async () => {
            const alert = await this.alert.create({
              message: this.text.message,
              buttons: [this.text.ok]
            });

            await alert.present();
            alert.onDidDismiss().then(() => this.navigate('/login'));
          },
          async err => {
            let message: string = this.text.unknown_error;
            if (err.error.metadata) {
              if (err.error.metadata.api_error_codes.includes(104)) message = this.text.no_users;
              if (err.error.metadata.api_error_codes.includes(126)) message = this.text.error_facebook;
              if (err.error.metadata.api_error_codes.includes(127)) message = this.text.error_google;
            }
            if (err.error.email) message = this.text.no_users;
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