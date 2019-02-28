import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Subscription, throwError } from "rxjs";

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';

import { ImageService } from '../../../services/image.service';
import { ApiService } from '../../../services/api.service';
import { LoadingService } from '../../../services/loading.service';
import { ActionSheetService } from "../../../services/action-sheet.service";
import { LanguageService } from "../../../services/language.service";
import { StorageService } from "../../../services/storage.service";

import { Profile, ProfileEditRequest, BaseResponse } from '../../../models/models';

import { environment } from "../../../../environments/environment";
import { finalize, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  private actionSubscription: Subscription;
  private languageSubscription: Subscription;

  public profile: Profile;
  public form: FormGroup;
  public submitTry: boolean = false;
  public editInfo: boolean = false;
  public text: any;

  constructor(
    private formBuilder: FormBuilder,
    private googlePlus: GooglePlus,
    private fb: Facebook,
    private api: ApiService,
    private loading: LoadingService,
    private language: LanguageService,
    private storage: StorageService,
    public action: ActionSheetService,
    public image: ImageService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.api.getProfile().subscribe(res => {
      if (res) this.profile = res.content;

      this.setFormValues();
      this.manageImagesVariables();
    });
    this.action.actionSheetDismiss$.subscribe((res: { label: string, value: string }) => this.form.get("language").setValue(res.label));
    this.language.languageIsLoaded$.subscribe(() => this.getPageText());

    // this.storage.get("profile").subscribe((res: any) => {
    //   console.log(res);
    //   if (res) this.profile = res;
    //   console.log(this.profile);
    //   this.setFormValues();
    //   this.manageImagesVariables();
    // });
  }

  ngOnDestroy() {
    if (this.actionSubscription) this.actionSubscription.unsubscribe();
    if (this.languageSubscription) this.languageSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.getPageText();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      name: ["", [Validators.required, Validators.pattern("^[\\S][a-zA-Z\\s]*$")]],
      email: ["", [Validators.required, Validators.email]],
      language: ["", Validators.required]
    });
  }

  private getPageText() {
    this.text = this.language.getTextByCategories("profile");
  }

  private manageImagesVariables() {
    if (this.profile.photo) {
      this.image.imgInfo.profile.src = this.profile.photo;
      this.image.imgInfo.profile.deleted = false;
    }
    if (this.profile.airline_image) {
      this.image.imgInfo.airline.src = this.profile.airline_image;
      this.image.imgInfo.airline.deleted = false;
    }
    if (this.profile.travel_image) {
      this.image.imgInfo.travel.src = this.profile.travel_image;
      this.image.imgInfo.travel.deleted = false;
    }
    if (this.profile.passport_image) {
      this.image.imgInfo.passport.src = this.profile.passport_image;
      this.image.imgInfo.passport.deleted = false;
    }
  }

  private setFormValues() {
    this.form.get("name").setValue(this.profile.first_name);
    this.form.get("email").setValue(this.profile.user);
    this.form.get("language").setValue(this.profile.language_long);
    this.action.language = this.profile.language;
  }

  private postImages() {
    return new Promise((resolve, reject) => {
      const formData: FormData = new FormData();
      this.image.imgInfo.profile.file ? formData.append("photo", this.image.imgInfo.profile.file, this.image.createImageName()) : formData.append("photo", "");
      this.image.imgInfo.airline.file ? formData.append("airline_image", this.image.imgInfo.airline.file, this.image.createImageName()) : formData.append("airline_image", "");
      this.image.imgInfo.travel.file ? formData.append("travel_image", this.image.imgInfo.travel.file, this.image.createImageName()) : formData.append("travel_image", "");
      this.image.imgInfo.passport.file ? formData.append("passport_image", this.image.imgInfo.passport.file, this.image.createImageName()) : formData.append("passport_image", "");

      this.api.postImages(formData).subscribe(
        res => resolve(res),
        err => reject(err)
      )
    });
  }

  private postTextData() {
    return new Promise((resolve, reject) => {
      const profile: ProfileEditRequest = {
        email: this.form.get("email").value,
        first_name: this.form.get("name").value,
        language: this.action.language
      }
      this.api.editProfile(this.profile.user_id, profile).subscribe(
        res => resolve(res),
        err => reject(err)
      )
    });
  }

  // public async attachGoogle() {
  //   await this.loading.createLoading(this.text.attaching);
  //   try {
  //     const { idToken } = await this.googlePlus.login({ webClientId: environment.googleClientId });
  //     this.api.socialRegister({ type: "GOOGLE", social_token: idToken })
  //       .pipe(
  //         finalize(async () => await this.loading.dismissLoading()),
  //         catchError((err => throwError(err)))
  //       )
  //       .subscribe(
  //         res => console.log("server response", res),
  //         async err => {
  //           /*if (err.error.metadata.api_error_codes.includes(110)) {*/
  //             alert(this.text.account_already_attached);
  //             await this.googlePlus.disconnect();
  //          /* }*/
  //         }
  //       );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // public async attachFacebook() {
  //   await this.loading.createLoading(this.text.attaching);
  //   try {
  //     const response: FacebookLoginResponse = await this.fb.login(['public_profile', 'email']);
  //     console.log("facebook response", response);
  //     this.api.socialRegister({ type: "FACEBOOK", social_token: response.authResponse.accessToken })
  //       .pipe(
  //         finalize(async () => await this.loading.dismissLoading()),
  //         catchError((err => throwError(err)))
  //       )
  //       .subscribe(
  //         res => console.log("server response", res),
  //         async err => {
  //           if (err.error.metadata.api_error_codes.includes(110)) {
  //             alert(this.text.account_already_attached);
  //             await this.fb.logout();
  //           }
  //         }
  //       );
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // }

  // public async detachSocial(social: string) {
  //   await this.loading.createLoading("Detaching");
  //   try {
  //     this.api.socialUnregister({ type: social })
  //       .pipe(
  //         finalize(async () => {
  //           await this.loading.dismissLoading();
  //           if (social === "GOOGLE") await this.api.googleLogout();
  //           if (social === "FACEBOOK") await this.api.facebookLogout();
  //         })
  //       )
  //       .subscribe((res: BaseResponse) => console.log(res));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  public async presentActionSheet() {
    await this.action.createLanguageActionSheet();
  }

  public async saveProfile() {
    this.submitTry = true;

    if (this.form.valid) {
      if (this.editInfo) this.editInfo = false;
      else {
        await this.loading.createLoading("Wait please, your information is updating");
        Promise.all([this.postTextData(), this.postImages()])
          .then((res: [BaseResponse, any]) => {
            if (res[0]) {
              this.storage.set("language", res[0].content.language);
              this.language.loadLanguage(res[0].content.language);
            }
          })
          .finally(async () => await this.loading.dismissLoading());
      }
    }
  }
}
