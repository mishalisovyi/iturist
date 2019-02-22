import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { ImageService } from '../../../services/image.service';
import { StorageService } from '../../../services/storage.service';
import { ApiService } from '../../../services/api.service';
import { LoadingService } from '../../../services/loading.service';

import { Profile, ProfileEditRequest } from '../../../models/models';

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
    private formBuilder: FormBuilder,
    private api: ApiService,
    private storage: StorageService,
    private loading: LoadingService,
    public image: ImageService
  ) { }

  ngOnInit() {
    this.createForm();
    this.api.getProfile().subscribe(res => {
      if (res) this.profile = res.content;
      alert(this.profile.airline_image);
      this.setFormValues();
      this.manageImagesVariables();
    });
    // this.storage.get("profile").subscribe((res: any) => {
    //   console.log(res);
    //   if (res) this.profile = res;
    //   console.log(this.profile);
    //   this.setFormValues();
    //   this.manageImagesVariables();
    // });
  }

  private createForm() {
    this.form = this.formBuilder.group({
      name: ["", [Validators.required, Validators.pattern("^[\\S][a-zA-Z\\s]*$")]],
      email: ["", [Validators.required, Validators.email]],
      language: [null, Validators.required]
    });
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
    this.form.get("language").setValue(this.profile.language);
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
        language: this.form.get("language").value
      }
      this.api.editProfile(this.profile.user_id, profile).subscribe(
        res => resolve(res),
        err => reject(err)
      )
    });
  }

  public saveProfile() {
    this.submitTry = true;

    if (this.form.valid) {
      if (this.editInfo) this.editInfo = false;
      else {
        this.loading.createLoading("Wait please, your information is updating");
        Promise.all([this.postTextData(), this.postImages()])
          .then(res => console.log("success", res))
          .finally(() => this.loading.dismissLoading());
        // this.postImages().then(res => console.log("success", res)).finally(() => this.loading.dismissLoading());
        // this.api.editProfile(formData).subscribe((profile: Profile) => {
        //   alert(JSON.stringify(profile));
        //   this.storage.set("profile", profile);
        // });
      }
    }
  }
}
