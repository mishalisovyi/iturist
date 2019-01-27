import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Platform } from '@ionic/angular';

import { ImageService } from '../../services/image.service';
import { StorageService } from '../../services/storage.service';
import { ApiService } from '../../services/api.service';

import { Profile } from '../../models/models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public profile: Profile;
  public form: FormGroup;
  public submitTry: boolean = false;
  public editInfo: boolean = false;

  constructor(
    private platform: Platform,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private storage: StorageService,
    public image: ImageService
  ) { }

  ngOnInit() {
    this.createForm();
    this.storage.get<Profile>("profile").subscribe(res => {
      this.profile = res;
      this.setFormValues();
      this.manageImagesVariables();
    });
  }

  private createForm() {
    this.form = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      language: [null, Validators.required]
    });
  }

  private manageImagesVariables() {
    if (this.profile.profile_photo) {
      this.image.profileImgSrc = this.profile.profile_photo;
      this.image.profileImgFile = new File([this.image.profileImgSrc], this.image.createImageName(), { type: typeof Blob, lastModified: Date.now() });
      this.image.profileImgFileDeleted = false;
    }
    if (this.profile.airline_photo) {
      this.image.airlineImgSrc = this.profile.airline_photo;
      this.image.airlineImgFile = new File([this.image.airlineImgSrc], this.image.createImageName(), { type: typeof Blob, lastModified: Date.now() });
      this.image.airlineImgFileDeleted = false;
    }
    if (this.profile.travel_photo) {
      this.image.travelImgSrc = this.profile.travel_photo;
      this.image.travelImgFile = new File([this.image.travelImgSrc], this.image.createImageName(), { type: typeof Blob, lastModified: Date.now() });
      this.image.travelImgFileDeleted = false;
    }
    if (this.profile.passport_photo) {
      this.image.passportImgSrc = this.profile.passport_photo;
      this.image.passportImgFile = new File([this.image.passportImgSrc], this.image.createImageName(), { type: typeof Blob, lastModified: Date.now() });
      this.image.passportImgFileDeleted = false;
    }
  }

  private appendImagesToFormData(formData: FormData) {
    formData.append("profile_image", this.image.profileImgFile);
    formData.append("airline_image", this.image.airlineImgFile);
    formData.append("travel_image", this.image.travelImgFile);
    formData.append("passport_image", this.image.passportImgFile);
  }

  private setFormValues() {
    this.form.get("name").setValue(this.profile.name);
    this.form.get("email").setValue(this.profile.email);
    this.form.get("language").setValue(this.profile.language);
  }

  public saveProfile() {
    this.submitTry = true;
    if (this.form.valid) {
      if (this.editInfo) {
        this.editInfo = false;
      } else {
        const formData: FormData = new FormData();
        if (this.platform.is('android')) {
          const queries: Array<any> = [];
          if (this.image.profileImgFileChanged) {
            queries.push(this.image.getProfileImgFromFileEntry());
          }
          if (this.image.airlineImgFileChanged) {
            queries.push(this.image.getAirlineImgFromFileEntry());
          }
          if (this.image.travelImgFileChanged) {
            queries.push(this.image.getTravelImgFromFileEntry());
          }
          if (this.image.passportImgFileChanged) {
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
        formData.append("language", this.form.get("language").value);
        this.api.editProfile(formData).subscribe((profile: Profile) => {
          alert(profile);
          this.storage.set("profile", profile);
        });
      }
    }
  }
}
