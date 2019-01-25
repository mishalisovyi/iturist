import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

import { ApiService } from '../../services/api.service';
import { ImageService } from '../../services/image.service';

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
    private platform: Platform
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
      this.api.register(this.form.value).subscribe(res => {
        const formData: FormData = new FormData();
        if (this.platform.is('android')) {
          const queries: Array<any> = [];
          if (!this.image.profileImgFileDeleted) {
            queries.push(this.image.getProfileImgFromFileEntry());
          }
          if (!this.image.airlineImgFileDeleted) {
            queries.push(this.image.getAirlineImgFromFileEntry());
          }
          if (!this.image.travelImgFileDeleted) {
            queries.push(this.image.getTravelImgFromFileEntry());
          }
          if (!this.image.passportImgFileDeleted) {
            queries.push(this.image.getPassportImgFromFileEntry());
          }
          Promise.all(queries).then(res => {
            this.appendImagesToFormData(formData);
          })
        } else {
          this.appendImagesToFormData(formData);
        }
        formData.append("name", this.form.get("name").value);
        formData.append("email", this.form.get("email").value);
        formData.append("password", this.form.get("password").value);
        formData.append("language", this.form.get("language").value);
        this.api.register(formData).subscribe(res => {
          alert(res);
        })
      })
    }
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

  private appendImagesToFormData(formData: FormData) {
    if (!this.image.profileImgFileDeleted) {
      formData.append("profile_image", this.image.profileImgFile);
      alert("profile: " + this.image.profileImgFile);
    }
    if (!this.image.airlineImgFileDeleted) {
      formData.append("airline_image", this.image.airlineImgFile);
      alert("airline: " + this.image.airlineImgFile);
    }
    if (!this.image.travelImgFileDeleted) {
      formData.append("travel_image", this.image.travelImgFile);
      alert("travel: " + this.image.travelImgFile);
    }
    if (!this.image.passportImgFileDeleted) {
      formData.append("passport_image", this.image.passportImgFile);
      alert("passport: " + this.image.passportImgFile);
    }
  }

  // async uploadImageData(formData: FormData) {
  //   this.http.post("http://localhost:8888/upload.php", formData)
  //     .pipe(
  //       finalize(() => {
  //         loading.dismiss();
  //       })
  //     )
  //     .subscribe(res => {
  //       if (res['success']) {
  //         this.presentToast('File upload complete.')
  //       } else {
  //         this.presentToast('File upload failed.')
  //       }
  //     });
  // }
}