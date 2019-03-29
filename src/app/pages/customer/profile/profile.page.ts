import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Subscription } from "rxjs";

import { ImageService } from '../../../services/image.service';
import { ApiService } from '../../../services/api.service';
import { LoadingService } from '../../../services/loading.service';
import { ActionSheetService } from "../../../services/action-sheet.service";
import { LanguageService } from "../../../services/language.service";
import { StorageService } from "../../../services/storage.service";

import { Profile, ProfileEditRequest, BaseResponse } from '../../../models/models';

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
  public displayedPhone: string;
  public displayedInfo = {
    name: '',
    email: '',
    language: '',
    phone: ''
  }

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private loading: LoadingService,
    private language: LanguageService,
    private storage: StorageService,
    public action: ActionSheetService,
    public image: ImageService,
  ) { }

  ngOnInit() {
    this.createForm();

    this.action.actionSheetDismissLanguage$.subscribe((res: { label: string, value: string }) => this.form.get("language").setValue(res.label.toLowerCase()));
    this.language.languageIsLoaded$.subscribe(() => this.getPageText());
  }

  ngOnDestroy() {
    if (this.actionSubscription) this.actionSubscription.unsubscribe();
    if (this.languageSubscription) this.languageSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.getPageText();

    this.api.getProfile().subscribe(res => {
      if (res) this.profile = res.content;

      this.setFormValues();
      this.getDisplayedInfo();
      this.manageImagesVariables();
    });
  }

  private createForm() {
    this.form = this.formBuilder.group({
      name: ["", [Validators.required, Validators.pattern("^[\\S][a-zA-Z\\s-]*$")]],
      email: "",
      language: ["", Validators.required],
      phone: ["", [Validators.required, Validators.pattern('\\+*[\\d]{0,3}\\s*[\\d]+')]]
    });
  }

  private getDisplayedInfo() {
    for (let key in this.form.controls) {
      // this.displayedInfo[key] = this.form.get(key).value.replace('+972 ', '');
      this.displayedInfo[key] = this.form.get(key).value;
    }
  }

  private getPageText() {
    this.text = this.language.getTextByCategories("profile");
  }

  private manageImagesVariables() {
    this.image.imgInfo.profile.src = this.profile.photo;
    this.image.imgInfo.profile.deleted = this.image.imgInfo.profile.src ? false : true;
    this.image.imgInfo.airline.src = this.profile.airline_image;
    this.image.imgInfo.airline.deleted = this.image.imgInfo.airline.src ? false : true;
    this.image.imgInfo.travel.src = this.profile.travel_image;
    this.image.imgInfo.travel.deleted = this.image.imgInfo.travel.src ? false : true;
    this.image.imgInfo.passport.src = this.profile.passport_image;
    this.image.imgInfo.passport.deleted = this.image.imgInfo.passport.src ? false : true;
  }

  private setFormValues() {
    this.form.get("name").setValue(this.profile.first_name);
    this.form.get("email").setValue(this.profile.user);
    this.form.get("language").setValue(this.profile.language_full.toLowerCase());
    // this.form.get("phone").setValue(this.profile.phone ? this.profile.phone.replace('972', '') : '');
    this.form.get("phone").setValue(this.profile.phone);
    this.action.language = this.profile.language;
  }

  private postImages() {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();

      for (let key in this.image.imgInfo) {
        if (this.image.imgInfo[key].file) formData.append(key === 'profile' ? 'photo' : `${key}_image`, this.image.imgInfo[key].file, this.image.createImageName());
        if (this.image.imgInfo[key].deleted) formData.append(key === 'profile' ? 'photo' : `${key}_image`, "");
      }

      this.api.postImages(formData).subscribe(
        res => resolve(res),
        err => reject(err)
      )
    });
  }

  private postTextData() {
    return new Promise((resolve, reject) => {
      // let phone: string = `${this.form.get('phone').value.length < 12 ? '972' : ''}${this.form.get('phone').value.replace(/\s|\+|\D/g, '')}`;
      const profile: ProfileEditRequest = {
        email: this.form.get("email").value,
        first_name: this.form.get("name").value,
        language: this.action.language,
        phone: this.form.get("phone").value
      }
      this.api.editProfile(this.profile.user_id, profile).subscribe(
        res => resolve(res),
        err => reject(err)
      )
    });
  }

  public deletePhoto(photo: string) {
    this.image.deletePhoto(photo);
    this.postImages();
  }

  public getPhoto(photo: string) {
    this.image.getPhoto(photo)
      .then(async () => {
        await this.loading.createLoading(this.text.updating_profile_msg);
        this.postImages().finally(async () => await this.loading.dismissLoading())
      })
  }

  // public validatePhone() {
  //   const value = this.form.get('phone').value;
  //   if (value.length > 14) this.form.get('phone').setValue(value.slice(0, -1));
  //   if (this.form.get('phone').hasError('required') || this.form.get('phone').hasError('pattern')) return;

  //   this.form.get('phone').setErrors(null);
  //   if (value.includes('+972') && value.length < 14) this.form.get('phone').setErrors({ minlength: true });
  //   if (!value.includes('+972') && value.length < 9) this.form.get('phone').setErrors({ minlength: true });
  // }

  // public getDisplayedPhone(phone: string, start: boolean = false) {
  //   if (phone) this.displayedPhone = start ? phone.substring(3) : phone.replace(/\s|(\+972)/g, '');
  // }

  public switchToEditInfo() {
    // this.form.get('phone').setValue(this.form.get('phone').value.replace('+972 ', ''));
    this.editInfo = true;
    for (let key in this.displayedInfo) {
      this.form.get(key).setValue(this.displayedInfo[key])
    }
  }

  public closeEditInfo() {
    this.editInfo = false;
    this.form.reset();
  }

  public async presentActionSheet() {
    await this.action.createLanguageActionSheet();
  }

  // public async saveProfile() {
  //   this.submitTry = true;

  //   if (this.form.valid) {
  //     if (this.editInfo) {
  //       this.editInfo = false;
  //     } else {
  //       await this.loading.createLoading(this.text.updating_profile_msg);
  //       Promise.all([this.postTextData(), this.postImages()])
  //         .then((res: [BaseResponse, any]) => {
  //           if (res[0]) {
  //             this.storage.set('phone', res[0].content.profile.phone)
  //             this.storage.set("language", res[0].content.language);
  //             this.language.loadLanguage(res[0].content.language);
  //           }
  //         })
  //         .finally(async () => await this.loading.dismissLoading());
  //     }
  //   } else {
  //     this.editInfo = true;
  //     this.submitTry = true;
  //   }
  // }

  public async saveProfile() {
    this.submitTry = true;

    if (this.form.valid) {
      await this.loading.createLoading(this.text.updating_profile_msg);
      this.postTextData()
        .then((res: BaseResponse) => {
          if (res) {
            // this.storage.set('phone', res.content.profile.phone)
            this.storage.set("language", res.content.language);
            this.language.loadLanguage(res.content.language);
          }
          this.getDisplayedInfo();
        })
        .finally(async () => {
          await this.loading.dismissLoading();
          this.editInfo = false;
        });
    }
  }
}
