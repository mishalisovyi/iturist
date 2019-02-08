import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ApiService } from '../../services/api.service';
import { ImageService } from '../../services/image.service';
import { StorageService } from '../../services/storage.service';
import { LoadingService } from "../../services/loading.service";

import { BaseResponse } from '../../models/models';

import { PasswordValidator } from '../../validators/password.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public form: FormGroup;
  public submitTry: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private googlePlus: GooglePlus,
    private fb: Facebook,
    private api: ApiService,
    public image: ImageService,
    private storage: StorageService,
    private loading: LoadingService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, PasswordValidator.password]],
      confirmPassword: ["", Validators.required],
      language: [null, Validators.required]
    });
  }

  private postTextData(): Promise<BaseResponse> {
    return new Promise((resolve, reject) => {
      const formData: FormData = new FormData();
      formData.append("first_name", this.form.get("name").value);
      formData.append("email", this.form.get("email").value);
      formData.append("password", this.form.get("password").value);
      formData.append("language", this.form.get("language").value);
      this.api.register(formData).subscribe(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

  private postImages() {
    return new Promise((resolve, reject) => {
      const formData: FormData = new FormData();
      if (this.image.imgInfo.profile.changed) {
        formData.append("photo", this.image.imgInfo.profile.file, this.image.createImageName());
        console.log("photo");
      }
      if (this.image.imgInfo.airline.changed) {
        formData.append("airline_image", this.image.imgInfo.airline.file, this.image.createImageName())
        console.log("airline");
      }
      if (this.image.imgInfo.travel.changed) {
        formData.append("travel_image", this.image.imgInfo.travel.file, this.image.createImageName())
        console.log("travel");
      }
      if (this.image.imgInfo.passport.changed) {
        formData.append("passport_image", this.image.imgInfo.passport.file, this.image.createImageName())
        console.log("passport");
      }

      this.api.postImages(formData).subscribe(
        res => {
          console.log(res);
          resolve(res);
        },
        err => reject(err)
      )
    });
  }

  public register() {
    this.submitTry = true;

    if (this.form.valid) {
      this.loading.createLoading("Registering");
      this.postTextData().then(
        res => this.storage.set("token", res.content.token)
          .pipe(switchMap(() => from(this.postImages())))
          .subscribe(
            res => {
              console.log(res);
              this.router.navigateByUrl('/main');
            },
            err => {
              console.error(err);
            },
            () => this.loading.dismissLoading()
          )
      );
    }
  }

  public googleLogin() {
    this.googlePlus.login({})
      .then(res => console.log(res))
      .catch(err => console.error(err));
  }

  public facebookLogin() {
    this.fb.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => alert(console.log(res)))
      .catch(err => console.error(err));
  }

  public validatePasswordConfirmation() {
    if (this.form.get("confirmPassword").dirty) {
      if (this.form.get("confirmPassword").value) {
        this.form.get("confirmPassword").setErrors(null);
        if (this.form.get("confirmPassword").value !== this.form.get("password").value) {
          this.form.get("confirmPassword").setErrors({ unmatch: true });
        }
      }
    }
  }
}