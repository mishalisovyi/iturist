import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';

import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';

import { ActionSheetService } from 'src/app/services/action-sheet.service';
import { ApiService } from 'src/app/services/api.service';
import { LanguageService } from 'src/app/services/language.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-doctor-appointment',
  templateUrl: './doctor-appointment.page.html',
  styleUrls: ['./doctor-appointment.page.scss'],
})
export class DoctorAppointmentPage implements OnInit, OnDestroy {

  private actionSubscription: Subscription;

  public form: FormGroup;
  public customPickerOptions: any;
  public submitTry = false;
  public correctDate: boolean;
  public date: string = moment().format();
  public text: any;

  constructor(
    private action: ActionSheetService,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private alert: AlertController,
    private router: Router,
    private language: LanguageService,
    private loading: LoadingService
  ) {
    this.customPickerOptions = {
      buttons: [{
        text: this.text ? this.text.cancel : 'Cancel'
      }, {
        text: this.text ? this.text.save : 'Save',
        handler: (value: any) => {
          this.date = moment(new Date(value.year.value, value.month.value - 1, value.day.value, value.hour.value, value.minute.value))
            .format();
          this.form.get('datetime').setValue(moment(this.date).format('DD-MM-YYYY HH:mm'));
          this.correctDate = moment(this.date) > moment();
        }
      }]
    };
  }

  ngOnInit() {
    this.actionSubscription = this.action.actionSheetDismissDoctor$
      .subscribe((res: { label: string, value: string }) => this.form.get('doctor').setValue(res.label));

    this.createForm();
  }

  ngOnDestroy() {
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.getPageText();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('doctor_appointment');
  }

  private createForm() {
    this.form = this.formBuilder.group({
      doctor: ['', Validators.required],
      datetime: ['', Validators.required],
      symptoms: ['', Validators.maxLength(1000)]
    });
  }

  // private validateDate(date: Date) {
  //   this.form.get('datetime').setErrors(null);
  //   if ([5, 6].includes(moment(date).isoWeekday())) this.form.get('datetime').setErrors({ wrongDay: true });
  // }

  public presentActionSheet() {
    this.action.createDoctorsActionSheet();
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

  public async saveAppointment() {
    this.submitTry = true;

    if (this.form.valid && this.correctDate) {
      alert('appointment is saved!');
      // await this.loading.createLoading(this.text ? this.text.wait_please : 'Wait, please');

      // this.api.submitDoctorAppointment({
      //   specialization: this.action.doctor,
      //   visit_date: this.date.split('+')[0],
      //   note: this.form.get('symptoms').value
      // })
      //   .pipe(finalize(async () => await this.loading.dismissLoading()))
      //   .subscribe(async () => {
      //     const alert = await this.alert.create({
      //       message: this.text ? this.text.appointment_submitted : 'Your appointment successfully submitted',
      //       buttons: [this.text ? this.text.ok.toUpperCase() : 'Ok']
      //     });

      //     await alert.present();
      //     alert.onDidDismiss().then(() => this.router.navigateByUrl('/online-doctor-choose'));
      //   });
    }
  }
}
