import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertController } from '@ionic/angular';
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';

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
      position: fixed;
      bottom: 0;
      right: 0;
      left: 0;
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

  public plan: Plan;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alert: AlertController,
    private api: ApiService,
    private iab: InAppBrowser
  ) { }

  ngOnInit() {
    this.getPlanId();
    this.getPlan(this.planId);
  }

  private getPlanId() {
    this.planId = this.route.snapshot.params.planId;
  }

  private getPlan(id: string) {
    this.api.getPlan(id).subscribe((plan: BaseResponse) => this.plan = plan.content);
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

  public confirmPlan() {
    this.browser = this.iab.create(
      "https://direct.tranzila.com/yoo/iframenew.php?hidesum=1&currency=1&tranmode=AK&sum=0.1",
      "_blank",
      { beforeload: "yes", hideurlbar: "yes" }
    );
    this.browser.hide();
    this.browser.on("loadstop").subscribe(() => {
      this.browser.insertCSS({ code: this.tranzilaCss }).then(() => this.browser.show());
    })
  }
}