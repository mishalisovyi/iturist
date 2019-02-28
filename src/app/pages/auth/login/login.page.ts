import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { MenuController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';

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
export class LoginPage implements OnInit, OnDestroy {

  public text: any;
  public form: FormGroup;
  public submitTry: boolean = false;

  private subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private api: ApiService,
    private storage: StorageService,
    private googlePlus: GooglePlus,
    private fb: Facebook,
    private menu: MenuController,
    private language: LanguageService,
    private loading: LoadingService
  ) { }

  ngOnInit() {
    this.createForm();
    this.storage.get("language").subscribe((res: string) => {
      if (res) this.language.loadLanguage(res);
    });
    this.subscription = this.language.languageIsLoaded$.subscribe(() => this.getPageText());
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.getPageText();
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  private createForm() {
    this.form = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  private getPageText() {
    this.text = this.language.getTextByCategories("login");
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
              this.storage.set("auth_type", "REGULAR")
            )
          )),
          finalize(async () => await this.loading.dismissLoading()),
          catchError((err => throwError(err)))
        )
        .subscribe(() => this.router.navigateByUrl('/main'))
    }
  }

  public async googleLogin() {
    await this.loading.createLoading(this.text.login);
    try {
      const { idToken } = await this.googlePlus.login({ webClientId: environment.googleClientId });
      console.log(idToken);
      this.api.googleLogin({ token: idToken })
        .pipe(
          switchMap((res: BaseResponse) => (
            forkJoin(
              this.storage.set("auth_type", "GOOGLE"),
              this.storage.set("token", res.content.token),
              this.storage.set("language", res.content.profile.language)
            )
          )),
          finalize(async () => await this.loading.dismissLoading()),
          catchError((err => throwError(err)))
        )
        .subscribe(
          () => this.router.navigateByUrl("/main"),
          async err => {
            if (err.error.metadata.api_error_codes.includes(120) || err.error.metadata.api_error_codes.includes(110)) {
              alert(this.text.not_registered_with_google);
              await this.googlePlus.disconnect();
            }
          }
        );
    } catch (error) {
      await this.loading.dismissLoading();
    }
  }

  public async facebookLogin() {
    await this.loading.createLoading(this.text.login);
    try {
      const { authResponse: { accessToken } } = await this.fb.login(['public_profile', 'email']);
      this.api.facebookLogin({ token: accessToken })
        .pipe(
          switchMap((res: BaseResponse) => (
            forkJoin(
              this.storage.set("auth_type", "FACEBOOK"),
              this.storage.set("token", res.content.token),
              this.storage.set("language", res.content.profile.language)
            )
          )),
          finalize(async () => await this.loading.dismissLoading()),
          catchError((err => throwError(err)))
        )
        .subscribe(
          () => this.router.navigateByUrl("/main"),
          async err => {
            if (err.error.metadata.api_error_codes.includes(120) || err.error.metadata.api_error_codes.includes(110)) {
              alert(this.text.not_registered_with_facebook);
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