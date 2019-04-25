import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';

import { iif, of } from 'rxjs';
import { map, switchMap, finalize } from 'rxjs/operators';
import * as moment from 'moment';

import { ApiService } from '../../../services/api.service';
import { LanguageService } from "../../../services/language.service";
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-check-up-services',
  templateUrl: './check-up-services.page.html',
  styleUrls: ['./check-up-services.page.scss'],
})
export class CheckUpServicesPage implements OnInit {

  public dateControl: FormControl;
  public colonoscopy: boolean = false;
  public oncomarkers: boolean = false;
  public submitTry: boolean = false;
  public correctDate: boolean;
  public customPickerOptions: any;
  public date: string = moment().format();
  public text: any;

  constructor(private api: ApiService, private alert: AlertController, private router: Router, private language: LanguageService, private loading: LoadingService) {
    this.customPickerOptions = {
      buttons: [{
        text: this.text ? this.text.cancel : 'Cancel'
      }, {
        text: this.text ? this.text.save : 'Save',
        handler: (value: any) => {
          const date = new Date(value.year.value, value.month.value - 1, value.day.value);
          this.date = moment(date).format();
          this.dateControl.setValue(moment(this.date).format('DD-MM-YYYY'));
          this.correctDate = moment(this.date) >= moment().startOf('day');
          this.validateDate(date);
        }
      }]
    }
  }

  ngOnInit() {
    this.createControl();
  }

  ionViewWillEnter() {
    this.getPageText();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('check_up_services');
  }

  private createControl() {
    this.dateControl = new FormControl("", [Validators.required]);
  }

  private validateDate(date: Date) {
    this.dateControl.setErrors(null);
    if ([5, 6].includes(moment(date).isoWeekday())) this.dateControl.setErrors({ wrongDay: true });
  }

  public navigateToDisclaimer() {
    this.router.navigateByUrl('/check-up-disclaimer')
  }

  public async submitCheckup() {
    this.submitTry = true;

    if (this.dateControl.valid && this.correctDate) {
      const parts = this.dateControl.value.split('-');
      const originalDate = `${parts[1]}-${parts[0]}-${parts[2]}`;

      await this.loading.createLoading(this.text ? this.text.wait_please : 'Wait, please');

      this.api.getProfile()
        .pipe(
          map(res => res.content.travel_image),
          switchMap(res => iif(
            () => res,
            this.api.submitCheckupService({
              visit_date: moment(new Date(originalDate)).format('YYYY-MM-DDTHH:mm:ss'),
              type: 'CHECK-UP',
              colonoscopy: this.colonoscopy,
              oncomarker: this.oncomarkers
            }),
            of(null)
          )),
          finalize(async () => await this.loading.dismissLoading())
        )
        .subscribe(async res => {
          const alert = await this.alert.create({
            message: res
              ? this.text ? this.text.successfully_submitted : 'Your check up request successfully submitted'
              : this.text ? this.text.need_upload_insurance : 'You need to upload your travel insurance photo for having this check up service',
            buttons: [this.text ? this.text.ok.toUpperCase() : 'Ok']
          });

          await alert.present();
          alert.onDidDismiss().then(() => this.router.navigateByUrl(res ? '/main' : '/profile'));
        });
    }
  }
}