import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { Platform, MenuController, ToastController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { Network } from '@ionic-native/network/ngx';

import { throwError, forkJoin, Subscription } from "rxjs";
import { switchMap, catchError, finalize } from 'rxjs/operators';

import { ApiService } from '../../../services/api.service';
import { StorageService } from "../../../services/storage.service";
import { LanguageService } from "../../../services/language.service";
import { LoadingService } from "../../../services/loading.service";

import { BaseResponse } from "../../../models/models";

import { environment } from "../../../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public text: any;
  public form: FormGroup;
  public submitTry: boolean = false;
  public displayedLogo: boolean = false;

  private languageSubscription: Subscription;
  private backBtnSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private api: ApiService,
    private storage: StorageService,
    private googlePlus: GooglePlus,
    private fb: Facebook,
    private menu: MenuController,
    private language: LanguageService,
    private loading: LoadingService,
    private toast: ToastController,
    private network: Network,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.createForm();

    setTimeout(() => this.displayedLogo = true, 500);
  }

  ionViewWillEnter() {
    this.resetForm();
    this.getPageText();
    this.storage.get("language").subscribe((res: string) => res ? this.language.loadLanguage(res) : this.language.loadLanguage('En'));
    this.languageSubscription = this.language.languageIsLoaded$.subscribe(() => this.getPageText());

    this.backBtnSubscription = this.platform.backButton.subscribe(() => navigator['app'].exitApp());
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);

    if (this.languageSubscription) this.languageSubscription.unsubscribe();
    if (this.backBtnSubscription) this.backBtnSubscription.unsubscribe();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  private resetForm() {
    this.submitTry = false;
    this.form.reset();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories("login");
  }

  private async showToast() {
    const toast = await this.toast.create({
      message: this.text ? this.text.disconnected : 'Missing connection to Internet!',
      duration: 2000
    });
    toast.present();

  }

  public requireValidator(...fields: Array<string>): boolean {
    let valid: boolean = true;
    for (let field of fields) {
      if (this.form.get(field).hasError('required')) {
        valid = false;
        break;
      }
    }
    return !valid;
  }

  public navigateTo(route: string) {
    this.router.navigateByUrl(`/${route}`);
  }

  public async login() {
    this.submitTry = true;

    if (this.form.valid) {
      await this.loading.createLoading(this.text.login);

      const formData: FormData = new FormData();
      formData.append("email", this.form.get("email").value);
      formData.append("password", this.form.get("password").value);

      this.api.login(formData)
        .pipe(
          switchMap((res: BaseResponse) => (
            forkJoin(
              this.storage.set("token", res.content.token),
              this.storage.set("language", res.content.profile.language),
              this.storage.set("auth_type", "REGULAR"),
            )
          )),
          finalize(async () => await this.loading.dismissLoading()),
          catchError((err => throwError(err)))
        )
        .subscribe(
          () => this.router.navigateByUrl("/main"),
          err => {
            if (err.error) {
              if (err.error.metadata.api_error_codes.includes(101)) alert(this.text.wrong_credentials);
              if (err.error.metadata.api_error_codes.includes(117)) alert(this.text.doctor_app_credentials);
            }
          }
        )
    }
  }

  public async googleLogin() {
    if (this.network.type === this.network.Connection.NONE) {
      await this.showToast();
      return;
    }
    await this.loading.createLoading(this.text.login);
    try {
      const { idToken } = await this.googlePlus.login({ webClientId: environment.googleClientId });
      this.api.googleLogin({ id_token: idToken })
        .pipe(
          switchMap((res: BaseResponse) => (
            forkJoin(
              this.storage.set("auth_type", "GOOGLE"),
              this.storage.set("token", res.content.token),
              this.storage.set("language", res.content.profile.language),
              // this.storage.set('phone', res.content.profile.phone ? res.content.profile.phone : 'none')
            )
          )),
          finalize(async () => await this.loading.dismissLoading()),
          catchError((err => throwError(err)))
        )
        .subscribe(
          () => this.router.navigateByUrl("/main"),
          async () => await this.googlePlus.disconnect()
        );
    } catch (error) {
      await this.loading.dismissLoading();
    }
  }

  public async facebookLogin() {
    if (this.network.type === this.network.Connection.NONE) {
      await this.showToast();
      return;
    }
    await this.loading.createLoading(this.text.login);
    try {
      const loginResponse = await this.fb.login(['public_profile', 'email']);
      this.api.facebookLogin({ access_token: loginResponse.authResponse.accessToken })
        .pipe(
          switchMap((res: BaseResponse) => (
            forkJoin(
              this.storage.set("auth_type", "FACEBOOK"),
              this.storage.set("token", res.content.token),
              this.storage.set("language", res.content.profile.language),
              // this.storage.set('phone', res.content.profile.phone ? res.content.profile.phone : 'none')
            )
          )),
          finalize(async () => await this.loading.dismissLoading()),
          catchError((err => throwError(err)))
        )
        .subscribe(
          () => this.router.navigateByUrl("/main"),
          async err => {
            if (err.error.metadata.api_error_codes.includes(106)) {
              alert(this.text.can_not_sign_in);
              await this.fb.logout();
            }
          }
        );
    } catch (error) {
      await this.loading.dismissLoading();
    }
  }

  public navigateToRegister() {
    this.router.navigateByUrl("/register");
  }
}