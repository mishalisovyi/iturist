import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Platform } from '@ionic/angular';
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';

import { Plan, Profile, BaseResponse } from 'src/app/models/models';

import { LanguageService } from 'src/app/services/language.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-confirm-plan',
  templateUrl: './confirm-plan.page.html',
  styleUrls: ['./confirm-plan.page.scss'],
})
export class ConfirmPlanPage {

  private planId: string;
  private companyId: string;
  private browser: InAppBrowserObject;
  private tranzilaCss = `
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

  public plan: Plan;
  public text: any;
  public hideBage: boolean;
  public defaultHref: string;
  public profile: Profile;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private language: LanguageService,
    private iab: InAppBrowser,
    private platform: Platform
  ) { }

  ionViewWillEnter() {
    this.getPageText();
    this.getUser();
    this.defineHidingBage();
    this.getCompanyId();
    this.getPlanId();
    this.getPlan(this.planId);
    this.getCompanyId();
    this.getDefaultHref();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('confirm_plan');
  }

  private getUser() {
    this.api.getProfile().subscribe(res => {
      if (res) {
        this.profile = res.content;
      }
    });
  }

  private getPlanId() {
    this.planId = this.route.snapshot.params.planId;
  }

  private getCompanyId() {
    this.companyId = this.route.snapshot.params.companyId;
  }

  private getPlan(id: string) {
    this.api.getPlan(id).subscribe((plan: BaseResponse) => this.plan = plan.content);
  }

  private defineHidingBage() {
    this.hideBage = true;

    this.api.getMyPlan().subscribe(res => {
      if (res) {
        this.hideBage = false;
      }
    });
  }

  private getDefaultHref() {
    this.defaultHref = `enter-mobile-number/${this.companyId}/${this.planId}`;
  }

  public confirmPlan() {
    this.browser = this.iab.create(
      // tslint:disable-next-line: max-line-length
      `https://direct.tranzila.com/diplomacy/newiframe.php?sum=${parseFloat(this.plan.price)}&currency=1&tranmode=AK&user_id=${this.profile.user_id}&package_id=${this.plan.id}`,
      '_blank',
      { beforeload: 'yes', hideurlbar: 'yes', location: 'yes' }
    );
    this.browser.insertCSS({ code: this.tranzilaCss });
    if (this.platform.is('android')) {
      this.browser.hide();
    }

    this.browser.on('loadstop').subscribe(async () => {
      await this.browser.insertCSS({ code: this.tranzilaCss });
      if (this.platform.is('android')) {
        this.browser.show();
      }

      this.browser.executeScript({
        code: `
          localStorage.setItem('status', '');
          const button = document.getElementById('ok');
          button.addEventListener('click', () => localStorage.setItem('status', 'close'));
        `
      });
      if (this.platform.is('ios')) {
        this.browser.executeScript({
          code: `
            document.addEventListener('touchend', (e) => {
              if (document.activeElement !== e.target) {
                document.activeElement.blur();
              }
           })
          `
        });
      }

      const interval = setInterval(async () => {
        const values: Array<any> = await this.browser.executeScript({ code: 'localStorage.getItem("status")' });
        const status = values[0];
        if (status) {
          await this.browser.executeScript({ code: 'localStorage.setItem("status", "")' });
          clearInterval(interval);
          this.browser.close();
        }
      }, 300);
    });

    this.browser.on('exit').subscribe(() => this.defineHidingBage());
  }

  public navigateTo(route: string) {
    this.router.navigateByUrl(`/${route}`);
  }
}
