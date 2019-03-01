import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';

import { Plan, BaseResponse } from "../../../models/models";

import { LanguageService } from "../../../services/language.service";
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
    #header, #footergreenstripe, #geo {
      display: none;
    }
    ul {
     margin-top: 30px;
    }
    li {
     height: 50px;
    }
    span, a, input, select {
      color: #7C8BFE;
    }
    input, select {
      height: 30px;
      background-color: #F2F6FC;
      border: 0 !important;
    }
    select {
      vertical-align: unset !important;
    }
    #send {
      margin-top: 20px;
    }
    #send button {
      width: 100%;
      border-radius: 0 !important;
      background: linear-gradient(to right, #6c9eff, #a25ffd) !important;
      height: 60px;
      margin-top: 30px;
    }
 `;

  private tranzilaScript: string = `
   document.addEventListener("click", function(e) {
     console.log('click', e.target);
     alert(e.target.localName);
     if (e.target.localName !== "input" && e.target.localName !== "select") {
       document.activeElement.blur();
       alert("close");
       console.log(document.activeElement);
     }
   });
  `
  public plan: Plan;
  public text: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alert: AlertController,
    private api: ApiService,
    private language: LanguageService,
    private iab: InAppBrowser,
    private platform: Platform
  ) { }

  ionViewWillEnter() {
    this.getPageText();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories("confirm_plan");
  }

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
      <p>${this.text.transaction}</p>
      <p>${this.text.completed}</p>
      `,
      buttons: [this.text.ok]
    });
    alert.onDidDismiss().then(() => this.router.navigateByUrl('/my-plan'));
    await alert.present();
  }

  public confirmPlan() {
    this.browser = this.iab.create(
      "https://direct.tranzila.com/diplomacy/newiframe.php?sum=5&currency=1&tranmode=AK&user=1",
      "_blank",
      { beforeload: "yes", hideurlbar: "yes" }
    );
    this.browser.insertCSS({ code: this.tranzilaCss });
    if (this.platform.is('android')) this.browser.hide();

    this.browser.on("loadstop").subscribe(() => {
      this.browser.insertCSS({ code: this.tranzilaCss }).then(() => {
        if (this.platform.is('android')) this.browser.show();
      });
      if (this.platform.is('ios')) this.browser.executeScript({ code: this.tranzilaScript });
    })
  }
}