import { Component, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';

import { ModalController } from '@ionic/angular';

import { LanguageService } from 'src/app/services/language.service';
import { ImageService } from 'src/app/services/image.service';

import { Object, Image } from 'src/app/models/models';

@Component({
  selector: 'app-request-prescription-modal',
  templateUrl: './request-prescription-modal.component.html',
  styleUrls: ['./request-prescription-modal.component.scss']
})
export class RequestPrescriptionModalComponent implements OnInit {

  private modal: ModalController;

  public text: Object;
  public userComment: FormControl;
  public images: Image[] = [];

  constructor(private language: LanguageService, private image: ImageService) { }

  ngOnInit() {
    this.initFormControl();
  }

  ionViewWillEnter() {
    this.getPageText();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('online_doctor_prescriptions');
  }

  private initFormControl() {
    this.userComment = new FormControl('');
  }

  public async uploadImage() {
    // const image = await this.image.getPrescriptionImage();
    // this.images.push(image);

    setTimeout(() => {
      const image = { src: "", file: null };
      this.images.push(image);
    }, 2000);
  }
  
  public deleteImage(index: number) {
    this.images.splice(index, 1);
  }

  public closeModal() {
    this.modal.dismiss();
  }

  public submit() {
    console.log('submit');
  }
}
