import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
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

  constructor(private formBuilder: FormBuilder, private router: Router, private api: ApiService, private storage: StorageService, private googlePlus: GooglePlus) { }

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

  public googleLogin() {
    this.googlePlus.login({})
      .then(res => alert(JSON.stringify(res)))
      .catch(err => alert(err));
  }

  public navigateToRegister() {
    this.router.navigateByUrl("/register");
  }
}