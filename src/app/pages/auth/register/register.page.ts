import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { MenuController } from '@ionic/angular';

import { from, forkJoin, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { ApiService } from '../../../services/api.service';
import { ImageService } from '../../../services/image.service';
import { StorageService } from '../../../services/storage.service';
import { LoadingService } from "../../../services/loading.service";
import { ActionSheetService } from "../../../services/action-sheet.service";
import { LanguageService } from "../../../services/language.service";

import { BaseResponse } from '../../../models/models';

import { PasswordValidator } from '../../../validators/password.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  private subscription: Subscription;

  public form: FormGroup;
  public text: any;
  public submitTry: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private api: ApiService,
    private storage: StorageService,
    private loading: LoadingService,
    private menu: MenuController,
    private action: ActionSheetService,
    private language: LanguageService,
    public image: ImageService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.action.actionSheetDismiss$.subscribe((res: { label: string, value: string }) => this.form.get("language").setValue(res.label));
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.image.resetPhotoData();
    this.getPageText();
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  private getPageText() {
    this.text = this.language.getTextByCategories("registration");
  }

  private createForm() {
    this.form = this.formBuilder.group({
      name: ["", [Validators.required, Validators.pattern("^[\\S][a-zA-Z\\s]*$")]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, PasswordValidator.password]],
      confirmPassword: ["", Validators.required],
      language: ["", Validators.required]
    });
  }

  private postTextData(): Promise<BaseResponse> {
    return new Promise((resolve, reject) => {
      const formData: FormData = new FormData();
      formData.append("first_name", this.form.get("name").value);
      formData.append("email", this.form.get("email").value);
      formData.append("password", this.form.get("password").value);
      formData.append("language", this.action.language);
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
      }
      if (this.image.imgInfo.airline.changed) {
        formData.append("airline_image", this.image.imgInfo.airline.file, this.image.createImageName())
      }
      if (this.image.imgInfo.travel.changed) {
        formData.append("travel_image", this.image.imgInfo.travel.file, this.image.createImageName())
      }
      if (this.image.imgInfo.passport.changed) {
        formData.append("passport_image", this.image.imgInfo.passport.file, this.image.createImageName())
      }

      this.api.postImages(formData).subscribe(
        res => resolve(res),
        err => reject(err)
      )
    });
  }

  public async presentActionSheet() {
    await this.action.createLanguageActionSheet();
  }

  public async register() {
    this.submitTry = true;

    if (this.form.valid) {
      await this.loading.createLoading("Registering");
      this.postTextData().then(
        res => {
          forkJoin(this.storage.set("token", res.content.token), this.storage.set("language", res.content.profile.language))
            .pipe(switchMap(() => from(this.postImages())))
            .subscribe(
              () => {
                this.router.navigateByUrl('/main');
                this.loading.dismissLoading();
              },
              () => this.loading.dismissLoading()
            )
        },
        err => {
          this.loading.dismissLoading();
          if (err.error.metadata.api_error_codes.includes(103)) alert(this.text.user_exists_message);
        }
      );
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

  public navigate(url: string) {
    this.router.navigateByUrl(url);
  }
}