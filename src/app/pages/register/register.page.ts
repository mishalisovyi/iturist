import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

import { Platform } from '@ionic/angular';

import { ApiService } from '../../services/api.service';
import { ImageService } from '../../services/image.service';
import { StorageService } from '../../services/storage.service';
import { BaseResponse } from '../../models/models';

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
    private api: ApiService,
    public image: ImageService,
    private storage: StorageService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      confirmPassword: ["", Validators.required],
      language: [null, Validators.required]
    });
  }

  public register() {
    this.submitTry = true;
    if (this.form.valid) {
      const formData: FormData = new FormData();
      formData.append("first_name", this.form.get("name").value);
      formData.append("email", this.form.get("email").value);
      formData.append("password", this.form.get("password").value);
      formData.append("language", this.form.get("language").value);
      this.api.register(formData)
        .pipe(
          switchMap((res: BaseResponse) => {
            alert("Registered: " + JSON.stringify(res));
            console.log(res);
            return forkJoin(this.storage.set("token", res.content.token), this.storage.set("profile", JSON.stringify(res.content.profile)))
          }),
          catchError(err => {
            alert("Error with register: " + JSON.stringify(err));
            console.log(err);
            return of(err);
          })
        )
        .subscribe(
          res => {
            alert("token and profile are stored");
            console.log(res);
            this.router.navigateByUrl('/main');
          },
          err => {
            alert("Error with storage: " + JSON.stringify(err));
            console.log(err);
          }
        )
    }
  }

  // public register() {
  //   this.submitTry = true;
  //   if (this.form.valid) {
  //     const formData: FormData = new FormData();
  //     if (this.platform.is('android')) {
  //       const queries: Array<any> = [];
  //       if (!this.image.imgInfo.profile.deleted) {
  //         queries.push(this.image.getImageFromFileEntry('profile'));
  //       }
  //       if (!this.image.imgInfo.airline.deleted) {
  //         queries.push(this.image.getImageFromFileEntry('airline'));
  //       }
  //       if (!this.image.imgInfo.travel.deleted) {
  //         queries.push(this.image.getImageFromFileEntry('travel'));
  //       }
  //       if (!this.image.imgInfo.passport.deleted) {
  //         queries.push(this.image.getImageFromFileEntry('passport'));
  //       }
  //       Promise.all(queries).then(res => {
  //         this.appendImagesToFormData(formData);
  //       })
  //     } else {
  //       this.appendImagesToFormData(formData);
  //     }
  //     formData.append("name", this.form.get("name").value);
  //     formData.append("email", this.form.get("email").value);
  //     formData.append("password", this.form.get("password").value);
  //     formData.append("language", this.form.get("language").value);
  //     this.api.register(formData).subscribe(res => {
  //       alert(JSON.stringify(res));
  //       this.router.navigateByUrl("/login");
  //     })
  //   }
  // }

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

  private appendImagesToFormData(formData: FormData) {
    if (!this.image.imgInfo.profile.deleted) {
      formData.append("profile_image", this.image.imgInfo.profile.file);
      alert("profile: " + JSON.stringify(this.image.imgInfo.profile.file));
    }
    if (!this.image.imgInfo.airline.deleted) {
      formData.append("airline_image", this.image.imgInfo.airline.file);
      alert("airline: " + JSON.stringify(this.image.imgInfo.airline.file));
    }
    if (!this.image.imgInfo.travel.deleted) {
      formData.append("travel_image", this.image.imgInfo.travel.file);
      alert("travel: " + JSON.stringify(this.image.imgInfo.travel.file));
    }
    if (!this.image.imgInfo.passport.deleted) {
      formData.append("passport_image", this.image.imgInfo.passport.file);
      alert("passport: " + JSON.stringify(this.image.imgInfo.passport.file));
    }
  }
}