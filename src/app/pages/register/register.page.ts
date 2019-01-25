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
        if (this.platform.is('android')) {
          const queries: Array<any> = [];
          if (!this.image.profileImgFileDeleted) {
            queries.push(this.image.getProfileImgFromFileEntry())
          }
          if (!this.image.airlineImgFileDeleted) {
            queries.push(this.image.getAirlineImgFromFileEntry())
          }
          if (!this.image.travelImgFileDeleted) {
            queries.push(this.image.getTravelImgFromFileEntry())
          }
          if (!this.image.passportImgFileDeleted) {
            queries.push(this.image.getPassportImgFromFileEntry());
          }
          Promise.all(queries).then(res => {
            alert("res: " + res);
          })
        } else {
          alert("not android");
        }
        // this.getImgFromFileEntry(this.fileInfo.profile).then(() => {
        //   // this.router.navigateByUrl("/login");
        //   if (!this.fileInfo.airline.deleted) {
        //     queries.push(this.getImgFromFileEntry(this.fileInfo.airline))
        //   }
        //   if (!this.fileInfo.travel.deleted) {
        //     queries.push(this.getImgFromFileEntry(this.fileInfo.travel))
        //   }
        //   if (!this.fileInfo.passport.deleted) {
        //     queries.push(this.getImgFromFileEntry(this.fileInfo.airline))
        //   }
        //   Promise.all(queries).then(res => {
        //     alert("general success");
        //   })
        // });
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