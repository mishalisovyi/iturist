import { Component, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';

import { ModalController, AlertController, Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { finalize } from 'rxjs/operators';

import { LanguageService } from 'src/app/services/language.service';
import { ImageService } from 'src/app/services/image.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ApiService } from 'src/app/services/api.service';

import { Text, Image } from 'src/app/models/models';

@Component({
  selector: 'app-request-prescription-modal',
  templateUrl: './request-prescription-modal.component.html',
  styleUrls: ['./request-prescription-modal.component.scss']
})
export class RequestPrescriptionModalComponent implements OnInit {

  private modal: ModalController;
  private platform: string;

  public text: Text;
  public userComment: FormControl;
  public images: Image[] = [];

  constructor(
    private language: LanguageService,
    private image: ImageService,
    private loading: LoadingService,
    private api: ApiService,
    private alert: AlertController,
    private androidPermissions: AndroidPermissions,
    private ionicPlatform: Platform
  ) { }

  ngOnInit() {
    this.getPlatform();
    this.initFormControl();
  }

  ionViewWillEnter() {
    this.getPageText();
  }

  private getPlatform() {
    this.platform = this.ionicPlatform.is('android') ? 'android' : 'ios';
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('online_doctor_prescriptions');
  }

  private initFormControl() {
    this.userComment = new FormControl('');
  }

  private async showAlert(message: string) {
    const alert = await this.alert.create({
      message,
      buttons: [this.text.ok]
    });

    await alert.present();
    alert.onDidDismiss().then(() => this.modal.dismiss());
  }

  private async requestImageLibraryPermission() {
    const { hasPermission } = await this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
    if (hasPermission) {
      this.uploadImage();
    }
  }

  public async uploadImage() {
    const { hasPermission } = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);

    if (this.platform === 'ios' || (this.platform === 'android' && hasPermission)) {
      const image = await this.image.getPrescriptionImage();
      this.images.push(image);
      return;
    }

    this.requestImageLibraryPermission();

    // setTimeout(() => {
    //   const image = { src: "", file: null };
    //   this.images.push(image);
    // }, 2000);
  }

  public deleteImage(index: number) {
    this.images.splice(index, 1);
  }

  public closeModal() {
    this.modal.dismiss();
  }

  public submit() {
    const formData = new FormData();
    formData.append('user_comment', this.userComment.value);
    this.images.forEach((item, index) => formData.append(`photo_${index + 1}`, item.file, this.image.createImageName()));

    this.loading.createLoading(this.text.wait_please as string);
    this.api.createPrescription(formData)
      .pipe(finalize(() => this.loading.dismissLoading()))
      .subscribe(
        () => this.showAlert(this.text.prescription_created),
        () => this.showAlert(this.text.unknown_error)
      );
  }
}
