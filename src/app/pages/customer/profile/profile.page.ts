import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { Subscription } from 'rxjs';

import { ImageService } from 'src/app/services/image.service';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ActionSheetService } from 'src/app/services/action-sheet.service';
import { LanguageService } from 'src/app/services/language.service';
import { StorageService } from 'src/app/services/storage.service';

import { Profile, ProfileEditRequest, BaseResponse } from 'src/app/models/models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  private actionSubscription: Subscription;
  private languageSubscription: Subscription;
  private platform: string;

  public profile: Profile;
  public form: FormGroup;
  public submitTry = false;
  public editInfo = false;
  public text: any;
  public displayedPhone: string;
  public displayedInfo = {
    first_name: '',
    last_name: '',
    email: '',
    language: '',
    phone: '',
    document_id: ''
  };

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private loading: LoadingService,
    private language: LanguageService,
    private storage: StorageService,
    public action: ActionSheetService,
    public image: ImageService,
    private androidPermissions: AndroidPermissions,
    private ionicPlatform: Platform
  ) { }

  ngOnInit() {
    this.getPlatform();
    this.createForm();

    this.actionSubscription = this.action.actionSheetDismissLanguage$.subscribe((res: { label: string, value: string }) => {
      this.form.get('language').setValue(res.label.toLowerCase());
    });
    this.languageSubscription = this.language.languageIsLoaded$.subscribe(() => this.getPageText());
  }

  ngOnDestroy() {
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.getPageText();

    this.api.getProfile().subscribe(res => {
      if (res) {
        this.profile = res.content;
      }

      this.setFormValues();
      this.getDisplayedInfo();
      this.manageImagesVariables();
    });
  }

  private getPlatform() {
    this.platform = this.ionicPlatform.is('android') ? 'android' : 'ios';
  }

  private createForm() {
    this.form = this.formBuilder.group({
      first_name: ['', [Validators.required, Validators.pattern('^[\\S][a-zA-Z-]*$')]],
      last_name: ['', [Validators.required, Validators.pattern('^[\\S][a-zA-Z-]*$')]],
      email: [{ value: '', disabled: true }],
      language: ['', Validators.required],
      phone: [{ value: '', disabled: true }],
      document_id: ['', Validators.pattern('^\\d+$')]
    });
  }

  private getDisplayedInfo() {
    for (const key in this.form.controls) {
      if (this.form.controls[key]) {
        // this.displayedInfo[key] = this.form.get(key).value.replace('+972 ', '');
        this.displayedInfo[key] = this.form.get(key).value;
      }
    }
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('profile');
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
    this.image.imgInfo.medical.src = this.profile.medical_image;
    this.image.imgInfo.passport.deleted = this.image.imgInfo.medical.src ? false : true;
  }

  private setFormValues() {
    this.form.get('first_name').setValue(this.profile.first_name);
    this.form.get('last_name').setValue(this.profile.last_name);
    this.form.get('email').setValue(this.profile.user);
    this.form.get('language').setValue(this.profile.language_full.toLowerCase());
    // this.form.get('phone').setValue(this.profile.phone ? this.profile.phone.replace('972', '') : '');
    this.form.get('phone').setValue(this.profile.phone);
    this.form.get('document_id').setValue(this.profile.document_id);
    this.action.language = this.profile.language;
  }

  private postImages() {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();

      for (const key in this.image.imgInfo) {
        if (this.image.imgInfo[key]) {
          if (this.image.imgInfo[key].file) {
            formData.append(key === 'profile' ? 'photo' : `${key}_image`, this.image.imgInfo[key].file, this.image.createImageName());
          }
          if (this.image.imgInfo[key].deleted) {
            formData.append(key === 'profile' ? 'photo' : `${key}_image`, '');
          }
        }
      }

      this.api.postImages(formData).subscribe(
        res => resolve(res),
        err => reject(err)
      );
    });
  }

  private postTextData() {
    return new Promise((resolve, reject) => {
      // tslint:disable-next-line: max-line-length
      // let phone: string = `${this.form.get('phone').value.length < 12 ? '972' : ''}${this.form.get('phone').value.replace(/\s|\+|\D/g, '')}`;
      const profile: ProfileEditRequest = {
        user: this.form.get('email').value,
        first_name: this.form.get('first_name').value,
        last_name: this.form.get('last_name').value,
        language: this.action.language,
        phone: this.form.get('phone').value,
        // sim_number: this.form.get('phone').value,
        document_id: this.form.get('document_id').value
      };
      this.api.editProfile(this.profile.user_id, profile).subscribe(
        res => resolve(res),
        err => reject(err)
      );
    });
  }

  private async requestImageLibraryPermission(forPhoto: string) {
    const { hasPermission } = await this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
    if (hasPermission) {
      this.getPhoto(forPhoto);
    }
  }

  public requireValidator(...fields: Array<string>): boolean {
    let valid = true;
    for (const field of fields) {
      if (this.form.get(field).hasError('required')) {
        valid = false;
        break;
      }
    }
    return !valid;
  }

  public deletePhoto(photo: string) {
    this.image.deletePhoto(photo);
    this.postImages();
  }

  public async getPhoto(photo: string) {
    console.log(photo);
    const { hasPermission } = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);

    if (this.platform === 'ios' || (this.platform === 'android' && hasPermission)) {
      this.image.getPhoto(photo)
        .then(async () => {
          await this.loading.createLoading(this.text.updating_profile_msg);
          this.postImages().finally(async () => await this.loading.dismissLoading());
        });
      return;
    }

    this.requestImageLibraryPermission(photo);
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
    for (const key in this.displayedInfo) {
      if (this.displayedInfo[key]) {
        this.form.get(key).setValue(this.displayedInfo[key]);
      }
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
  //             this.storage.set('language', res[0].content.language);
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
            this.storage.set('language', res.content.language);
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
