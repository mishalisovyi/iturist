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
      this.image.imgInfo.profile.src = this.profile.profile_photo;
      this.image.imgInfo.profile.file = new File([this.image.imgInfo.profile.src], this.image.createImageName(), { type: typeof Blob, lastModified: Date.now() });
      this.image.imgInfo.profile.deleted = false;
    }
    if (this.profile.airline_photo) {
      this.image.imgInfo.airline.src = this.profile.airline_photo;
      this.image.imgInfo.airline.file = new File([this.image.imgInfo.airline.src], this.image.createImageName(), { type: typeof Blob, lastModified: Date.now() });
      this.image.imgInfo.airline.deleted = false;
    }
    if (this.profile.travel_photo) {
      this.image.imgInfo.travel.src = this.profile.travel_photo;
      this.image.imgInfo.travel.file = new File([this.image.imgInfo.travel.src], this.image.createImageName(), { type: typeof Blob, lastModified: Date.now() });
      this.image.imgInfo.travel.deleted = false;
    }
    if (this.profile.passport_photo) {
      this.image.imgInfo.passport.src = this.profile.passport_photo;
      this.image.imgInfo.passport.file = new File([this.image.imgInfo.passport.src], this.image.createImageName(), { type: typeof Blob, lastModified: Date.now() });
      this.image.imgInfo.passport.deleted = false;
    }
  }

  private appendImagesToFormData(formData: FormData) {
    alert("profile" + JSON.stringify(this.image.imgInfo.profile.file));
    alert("airline" + JSON.stringify(this.image.imgInfo.airline.file));
    alert("travel" + JSON.stringify(this.image.imgInfo.travel.file));
    alert("passport" + JSON.stringify(this.image.imgInfo.passport.file));
    formData.append("profile_image", this.image.imgInfo.profile.file);
    formData.append("airline_image", this.image.imgInfo.airline.file);
    formData.append("travel_image", this.image.imgInfo.travel.file);
    formData.append("passport_image", this.image.imgInfo.passport.file);
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
          if (this.image.imgInfo.profile.changed) {
            queries.push(this.image.getImageFromFileEntry('profile'));
          }
          if (this.image.imgInfo.airline.changed) {
            queries.push(this.image.getImageFromFileEntry('airline'));
          }
          if (this.image.imgInfo.travel.changed) {
            queries.push(this.image.getImageFromFileEntry('travel'));
          }
          if (this.image.imgInfo.passport.changed) {
            queries.push(this.image.getImageFromFileEntry('passport'));
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
          alert(JSON.stringify(profile));
          this.storage.set("profile", profile);
        });
      }
    }
  }
}
