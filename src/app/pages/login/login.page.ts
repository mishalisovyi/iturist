import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { switchMap } from 'rxjs/operators';

import { ApiService } from '../../services/api.service';
import { StorageService } from "../../services/storage.service";

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
      this.api.login(this.form.value)
        .pipe(switchMap(response => this.storage.set("authorization", response)))
        .subscribe(() => {
          this.router.navigateByUrl("/choose-company");
        })
    }
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
      .then(res => alert(JSON.stringify(res)))
      .catch(err => alert(err));
  }

  public googleLogout() {
    this.googlePlus.logout()
      .then(res => alert(JSON.stringify(res)))
      .catch(err => alert(err));
  }

  public facebookLogin() {
    this.fb.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => alert(JSON.stringify(res)))
      .catch(e => alert(e));
  }

  public facebookLogout() {
    this.fb.logout()
      .then(res => alert(JSON.stringify(res)))
      .catch(e => alert(e));
  }

  public navigateToRegister() {
    this.router.navigateByUrl("/register");
  }
}