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
    console.log("on init");
    this.createForm();
   
    this.action.actionSheetDismiss$.subscribe((res: { label: string, value: string }) => this.form.get("language").setValue(res.label.toLowerCase()));
    this.language.languageIsLoaded$.subscribe(() => this.getPageText());
  }

  ngOnDestroy() {
    if (this.actionSubscription) this.actionSubscription.unsubscribe();
    if (this.languageSubscription) this.languageSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    console.log("ion view will enter");
    this.getPageText();

    this.api.getProfile().subscribe(res => {
      if (res) this.profile = res.content;

      this.setFormValues();
      this.manageImagesVariables();
    });
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
    // if (this.profile.photo) {
    //   this.image.imgInfo.profile.src = this.profile.photo;
    //   this.image.imgInfo.profile.deleted = false;
    // }
    // if (this.profile.airline_image) {
    //   this.image.imgInfo.airline.src = this.profile.airline_image;
    //   this.image.imgInfo.airline.deleted = false;
    // }
    // if (this.profile.travel_image) {
    //   this.image.imgInfo.travel.src = this.profile.travel_image;
    //   this.image.imgInfo.travel.deleted = false;
    // }
    // if (this.profile.passport_image) {
    //   this.image.imgInfo.passport.src = this.profile.passport_image;
    //   this.image.imgInfo.passport.deleted = false;
    // }
  
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

  public async presentActionSheet() {
    await this.action.createLanguageActionSheet();
  }

  public async saveProfile() {
    this.submitTry = true;

    if (this.form.valid) {
      if (this.editInfo) this.editInfo = false;
      else {
        await this.loading.createLoading(this.text.updating_profile_msg);
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
