import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { AlertController } from '@ionic/angular';

import * as moment from 'moment';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-confirm-plan',
  templateUrl: './confirm-plan.page.html',
  styleUrls: ['./confirm-plan.page.scss'],
})
export class ConfirmPlanPage implements OnInit {

  private planId: string;

  public creditCardForm: FormGroup;
  public payPalForm: FormGroup;
  public plan: any;
  public submitTry: boolean = false;
  public activeTabIndex: number = 0;
  public maxDatePickerValue: string = moment().add(10, "years").format();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private alert: AlertController,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.createForms();
    this.getPlanId();
    this.getPlan(this.planId);
  }

  private createForms() {
    this.creditCardForm = this.formBuilder.group({
      name: ["", Validators.required],
      number: ["", [Validators.required, Validators.minLength(16), Validators.pattern('^[0-9]+$')]],
      expire: ["", Validators.required],
      cw: ["", Validators.required]
    });
    this.payPalForm = this.formBuilder.group({
      field1: ["", Validators.required],
      field2: ["", Validators.required],
      field3: ["", Validators.required],
      field4: ["", Validators.required]
    });
  }

  private getPlanId() {
    this.planId = this.route.snapshot.params.planId;
  }

  private getPlan(id: string) {
    this.api.getPlan(id).subscribe(plan => this.plan = plan);
  }

  private async presentDialogAlert(reqData: any) {
    const alert = await this.alert.create({
      message: `
        <p>Save this payment</p>
        <p>for future payment in application?</p>
      `,
      buttons: [
        {
          text: 'Yes',
          role: 'yes'
        },
        {
          text: 'No',
          role: 'no'
        }
      ]
    });
    alert.onDidDismiss().then((res: any) => {
      reqData.save = res.role === 'yes' ? true : false;
      this.api.confirmPlan(reqData).subscribe(() => this.presentInfoAlert());
    });
    await alert.present();
  }

  private async presentInfoAlert() {
    const alert = await this.alert.create({
      message: `
        <p>The transaction</p>
        <p>completed successfully!</p>
      `,
      buttons: ['ok']
    });
    alert.onDidDismiss().then(() => this.router.navigateByUrl('/my-plan'));
    await alert.present();
  }

  public setActiveTab(index: number) {
    this.activeTabIndex = index;
  }

  public confirmPlan() {
    this.submitTry = true;
    const form: FormGroup = this.activeTabIndex === 0 ? this.creditCardForm : this.payPalForm;
    if (form.valid) {
      this.presentDialogAlert(form.value);
    }
  }

  public validateDate({ detail: { value: value } }: CustomEvent) {
    this.creditCardForm.get("expire").setErrors(null);
    if (moment(value) < moment()) {
      this.creditCardForm.get("expire").setErrors({ expire: true });
    }
  }
}