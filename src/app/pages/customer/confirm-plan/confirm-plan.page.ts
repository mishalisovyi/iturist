import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Platform } from '@ionic/angular';

import { AlertController } from '@ionic/angular';
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';

// import * as moment from 'moment';

import { Plan, BaseResponse } from "../../../models/models";

import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-confirm-plan',
  templateUrl: './confirm-plan.page.html',
  styleUrls: ['./confirm-plan.page.scss'],
})
export class ConfirmPlanPage implements OnInit {

  private planId: string;
  private browser: InAppBrowserObject;
  private tranzilaCss: string = `
    #header, #global_card, #myBtn, #total, #footer, .data_icon {
      display: none
    },
    .container {
      padding-right: 0 !important;
      padding-left: 0 !important;
    }
    .payment_data {
      margin-top: 40px
    }
    .data_field {
      margin-bottom: 30px
    }
    .payment_section .data_field {
      padding: 0 !important
    }
    .data_field .data_field_input {
      border-bottom: 0;
      background-color: #F2F6FC !important;
      margin-left: -15px !important;
      margin-right: -15px !important;
    }
    .error .data_field_input {
      border: solid 1px red;
    }
    .data_field .data_field_input input {
      color: #7C8BFE
    }
    .data_field .data_field_input input::placeholder {
      color: #7C8BFE
    }
    .data_field .data_field_select select {
      border-bottom: 0 !important;
      color: #7C8BFE
    }
    .data_field_select {
      margin-left: -15px;
      margin-right: -15px;
    }
    .payment_total_button #submitbtn {
      width: 100%;
      border-radius: 0 !important;
      background: linear-gradient(to right, #6c9eff, #a25ffd) !important;
      height: 60px !important;
      margin-top: 30px !important
    }
    input, select {
      height: 40px;
      padding: 0 10px !important;
    }
    select {
      background-color: #F2F6FC !important;
    }
    .data_error {
      position: relative !important;
      left: -5px !important;
    }
  `;
  private tranzilaScript: string = `
    window.addEventListener("click", function(e) {
      console.log('click', e);
      if (e.target.localName !== "input" && e.target.localName !== "select") {
        document.activeElement.blur();
        alert("close");
        console.log(document.activeElement);
      }
    });
  `

  // private tranzilaScript: string = `
  //   document.addEventListener("click", function(e) {
  //     const el = document.activeElement;
  //     alert(el);
  //     if(el !== document.getElementById("ccno")) document.getElementById("ccno").blur();
  //     if(el !== document.getElementById("expmonth")) document.getElementById("expmonth").blur();
  //     if(el !== document.getElementById("expyear")) document.getElementById("expyear").blur();
  //     if(el !== document.getElementById("mycvv")) document.getElementById("mycvv").blur();
  //     if(el !== document.getElementById("myid")) document.getElementById("myid").blur();
  //   });
  // `

  // public creditCardForm: FormGroup;
  // public payPalForm: FormGroup;
  public plan: Plan;
  // public submitTry: boolean = false;
  // public activeTabIndex: number = 0;
  // public maxDatePickerValue: string = moment().add(10, "years").format();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    // private formBuilder: FormBuilder,
    private alert: AlertController,
    private api: ApiService,
    private iab: InAppBrowser,
    private platform: Platform
  ) { }

  ngOnInit() {
    // this.createForms();
    this.getPlanId();
    this.getPlan(this.planId);
  }

  // private createForms() {
  //   this.creditCardForm = this.formBuilder.group({
  //     name: ["", Validators.required],
  //     number: ["", [Validators.required, Validators.minLength(16), Validators.pattern('^[0-9]+$')]],
  //     expire: ["", Validators.required],
  //     cw: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(3), Validators.pattern('^[0-9]+$')]]
  //   });
  //   this.payPalForm = this.formBuilder.group({
  //     field1: ["", Validators.required],
  //     field2: ["", Validators.required],
  //     field3: ["", Validators.required],
  //     field4: ["", Validators.required]
  //   });
  // }

  private getPlanId() {
    this.planId = this.route.snapshot.params.planId;
  }

  private getPlan(id: string) {
    this.api.getPlan(id).subscribe((plan: BaseResponse) => this.plan = plan.content);
  }

  // private async presentDialogAlert(reqData: any) {
  //   const alert = await this.alert.create({
  //     message: `
  //       <p>Save this payment</p>
  //       <p>for future payment in application?</p>
  //     `,
  //     buttons: [
  //       {
  //         text: 'Yes',
  //         role: 'yes'
  //       },
  //       {
  //         text: 'No',
  //         role: 'no'
  //       }
  //     ]
  //   });
  //   alert.onDidDismiss().then((res: any) => {
  //     reqData.save = res.role === 'yes' ? true : false;
  //     this.api.confirmPlan(reqData).subscribe(() => this.presentInfoAlert());
  //   });
  //   await alert.present();
  // }

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

  // public setActiveTab(index: number) {
  //   this.activeTabIndex = index;
  // }

  public confirmPlan() {
    this.browser = this.iab.create(
      "https://direct.tranzila.com/yoo/iframenew.php?hidesum=1&currency=1&tranmode=AK&sum=0.1",
      "_blank",
      { beforeload: "yes", hideurlbar: "yes" }
    );
    this.browser.insertCSS({ code: this.tranzilaCss });
    if (this.platform.is('android')) this.browser.hide();
    this.browser.on("loadstop").subscribe(() => {
      this.browser.insertCSS({ code: this.tranzilaCss }).then(() => {
        if (this.platform.is('android')) this.browser.show();
      });
      // if(this.platform.is('ios')) this.browser.executeScript({ code: this.tranzilaScript });
    })


    // this.browser.hide();
    // this.browser.on("loadstop").subscribe(() => {
    //   this.browser.insertCSS({ code: this.tranzilaCss }).then(() => this.browser.show());
    // })



    // this.browser.on("exit").subscribe((res: InAppBrowserEvent) => console.log("exit", res));
    // this.browser.on("message").subscribe((res: InAppBrowserEvent) => console.log("message", res));

    // this.submitTry = true;
    // const form: FormGroup = this.activeTabIndex === 0 ? this.creditCardForm : this.payPalForm;
    // if (form.valid) {
    //   this.presentDialogAlert(form.value);
    // }
  }

  // public validateDate({ detail: { value: value } }: CustomEvent) {
  //   this.creditCardForm.get("expire").setErrors(null);
  //   if (moment(value) < moment()) {
  //     this.creditCardForm.get("expire").setErrors({ expire: true });
  //   }
  // }
}