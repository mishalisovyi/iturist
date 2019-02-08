import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { throwError } from "rxjs";
import { switchMap, catchError } from 'rxjs/operators';

import { ApiService } from '../../services/api.service';
import { StorageService } from "../../services/storage.service";
import { BaseResponse } from "../../models/models";

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
    private fb: Facebook
  ) { }

  ngOnInit() {
    this.createForm();
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
            return this.storage.set("token", res.content.token)
          }),
          catchError((err => throwError(err)))
        )
        .subscribe(
          res => {
            alert("token and profile are stored");
            console.log(res);
            this.router.navigateByUrl('/main');
          },
          err => {
            alert("Error: " + JSON.stringify(err));
            console.log(err);
          }
        )
    }
  }

  public logout() {
    this.api.logout()
      .pipe(
        switchMap(
          (res: BaseResponse) => {
            alert("Logout: " + JSON.stringify(res));
            console.log(res);
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