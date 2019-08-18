import { Component } from '@angular/core';

import { ModalController } from '@ionic/angular';

import * as moment from 'moment';
import { map } from 'rxjs/operators';

import { ApiService } from 'src/app/services/api.service';
import { LanguageService } from 'src/app/services/language.service';

import { RequestPrescriptionModalComponent } from 'src/app/components/request-prescription-modal/request-prescription-modal.component';

import { Text, BaseResponse } from 'src/app/models/models';

@Component({
  selector: 'app-online-doctor-prescriptions',
  templateUrl: './online-doctor-prescriptions.page.html',
  styleUrls: ['./online-doctor-prescriptions.page.scss'],
})
export class OnlineDoctorPrescriptionsPage {

  public text: Text;
  public prescriptions: Array<any>;

  constructor(private language: LanguageService, private api: ApiService, private modal: ModalController) { }

  ionViewWillEnter() {
    this.getPageText();
    this.getPrescriptions();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('online_doctor_prescriptions');
  }

  private getPrescriptions() {
    this.api.getPrescriptions()
      .pipe(map((res: BaseResponse) => {
        res.content.forEach(item => {
          if (item.created) {
            item.created = moment.utc(item.created.replace('UTC:00', '')).toString();
          }
        });
        res.content.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
        return res.content;
      }))
      .subscribe(res => this.prescriptions = res);
  }

  public async presentModal() {
    const modal = await this.modal.create({
      component: RequestPrescriptionModalComponent
    });
    modal.onDidDismiss().then(() => this.getPrescriptions());
    return await modal.present();
  }


  // public async presentRequestAlert() {
  //   const alert = await this.alert.create({
  //     header: this.text.request_prescription ? this.text.request_prescription : 'Request prescription',
  //     inputs: [
  //       {
  //         name: 'user_comment',
  //         type: 'text',
  //         placeholder: this.text.write_your_comment ? this.text.write_your_comment : 'Write your comment'
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: this.text.ok ? this.text.ok : 'Ok',
  //         role: 'submit'
  //       },
  //       {
  //         text: this.text.cancel ? this.text.cancel : 'Cancel',
  //         role: 'cancel'
  //       }
  //     ]
  //   });
  //   await alert.present();

  //   alert.onDidDismiss().then(value => {
  //     if (value.role === 'submit') {
  //       const { values: { user_comment } } = value.data;
  //       this.api.createPrescription({ user_comment })
  //         .pipe(finalize(() => this.getPrescriptions()))
  //         .subscribe();
  //     }
  //   });
  // }
}
