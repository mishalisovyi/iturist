import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { MenuController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

import { throwError, forkJoin } from "rxjs";
import { switchMap, catchError } from 'rxjs/operators';

import { ApiService } from '../../../services/api.service';
import { StorageService } from "../../../services/storage.service";

import { BaseResponse } from "../../../models/models";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public form: FormGroup;
  public submitTry: boolean = false;

  private googleLoginDetermine: boolean = true;
  private facebookLoginDetermine: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private api: ApiService,
    private storage: StorageService,
    private googlePlus: GooglePlus,
    private fb: Facebook,
    private menu: MenuController
  ) { }

  ngOnInit() {
    this.createForm();
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

  public login() {
    this.submitTry = true;
    if (this.form.valid) {
      const formData: FormData = new FormData();
      formData.append("email", this.form.get("email").value);
      formData.append("password", this.form.get("password").value);
      this.api.login(formData)
        .pipe(
          switchMap((res: BaseResponse) => {
            alert("Login: " + JSON.stringify(res));
            console.log(res);
            return forkJoin(this.storage.set("token", res.content.token), this.storage.set("role", res.content.role))
          }),
          catchError((err => throwError(err)))
        )
        .subscribe(
          res => this.router.navigateByUrl(res[1] === 'CUSTOMER' ? '/main' : '/doctor-call-checker'),
          err => alert("Error: " + JSON.stringify(err))         
        )
    }
  }

  public logout() {
    this.api.logout()
      .pipe(
        switchMap(
          (res: BaseResponse) => {
            alert("Logout: " + JSON.stringify(res));
            return this.storage.remove("token")
          }
        )
      )
      .subscribe(() => this.router.navigateByUrl("/login"));
  }

  public manageGoogleLogin() {
    if (this.googleLoginDetermine) {
      this.googleLogin();
    } else {
      this.googleLogout();
    }
    this.googleLoginDetermine = !this.googleLoginDetermine;
  }

  public manageFacebookLogin() {
    if (this.facebookLoginDetermine) {
      this.facebookLogin();
    } else {
      this.facebookLogout();
    }
    this.facebookLoginDetermine = !this.facebookLoginDetermine;
  }

  public googleLogin() {
    this.googlePlus.login({})
      .then(res => console.log(res))
      .catch(err => console.error(err));
  }

  public googleLogout() {
    this.googlePlus.logout()
      .then(res => console.log(res))
      .catch(err => console.error(err));
  }

  public facebookLogin() {
    this.fb.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => console.log(res))
      .catch(e => console.error(e));
  }

  public facebookLogout() {
    this.fb.logout()
      .then(res => console.log(res))
      .catch(e => console.error(e));
  }

  public navigateToRegister() {
    this.router.navigateByUrl("/register");
  }
}