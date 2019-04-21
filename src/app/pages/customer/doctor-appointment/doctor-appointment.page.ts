import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';

import { Subscription } from 'rxjs';
import * as moment from 'moment';

import { ActionSheetService } from '../../../services/action-sheet.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-doctor-appointment',
  templateUrl: './doctor-appointment.page.html',
  styleUrls: ['./doctor-appointment.page.scss'],
})
export class DoctorAppointmentPage implements OnInit, OnDestroy {

  private actionSubscription: Subscription;

  public form: FormGroup;
  public customPickerOptions: any;
  public submitTry: boolean = false;

  constructor(
    private action: ActionSheetService,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private alert: AlertController,
    private router: Router
  ) {
    this.customPickerOptions = {
      buttons: [{
        text: 'Cancel'
      }, {
        text: 'Save',
        handler: (value: any) => {
          const date: Date = new Date(value.year.value, value.month.value - 1, value.day.value, value.hour.value, value.minute.value);
          this.form.get('datetime').setValue(moment(date).format('YYYY-MM-DD HH:mm'));
          // this.validateDate(date);
        }
      }]
    }
  }

  ngOnInit() {
    this.actionSubscription = this.action.actionSheetDismissDoctor$.subscribe((res: { label: string, value: string }) => this.form.get('doctor').setValue(res.label));

    this.createForm();
  }

  ngOnDestroy() {
    if (this.actionSubscription) this.actionSubscription.unsubscribe();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      doctor: ["", Validators.required],
      datetime: ["", Validators.required],
      symptoms: ""
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
    let valid: boolean = true;
    for (let field of fields) {
      if (this.form.get(field).hasError('required')) {
        valid = false;
        break;
      }
    }
    return !valid;
  }

  public saveAppointment() {
    this.submitTry = true;

    // console.log({
    //   specialization: this.action.doctor,
    //   visit_date: moment.utc(this.form.get('datetime').value).toISOString(),
    //   type: 'APPOINTMENT'
    // })

    if (this.form.valid) {
      this.api.submitDoctorAppointment({
        specialization: this.action.doctor,
        visit_date: moment.utc(this.form.get('datetime').value).toISOString(),
        type: 'APPOINTMENT'
      })
        .subscribe(async res => {
          const alert = await this.alert.create({
            message: 'Your appointment successfully created',
            buttons: ['Ok']
          });

          await alert.present();
          alert.onDidDismiss().then(() => this.router.navigateByUrl('/online-doctor-choose'));
          console.log(res)
        });
    }
  }
}