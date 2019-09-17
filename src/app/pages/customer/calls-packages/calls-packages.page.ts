import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';

import { LanguageService } from 'src/app/services/language.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-calls-packages',
  templateUrl: './calls-packages.page.html',
  styleUrls: ['./calls-packages.page.scss'],
})
export class CallsPackagesPage implements OnInit {

  private browser: InAppBrowserObject;
  private userId: number;
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

  public text: any;
  public packages: Array<any>;

  constructor(
    private language: LanguageService,
    private api: ApiService,
    private iab: InAppBrowser,
    private platform: Platform,
    private router: Router
  ) { }

  ngOnInit() {
    this.getProfileId();
  }

  ionViewWillEnter() {
    this.getPageText();
    this.getPackages();
  }

  private getProfileId() {
    this.api.getProfile().subscribe(({ content: { user_id } }) => this.userId = user_id);
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('calls_packages');
  }

  private getPackages() {
    this.api.getCallsPackages().subscribe(({ content }) => this.packages = content);
  }

  public purchasePackage(price: number, id: number) {
    console.log(id, this.userId);
    this.browser = this.iab.create(
      // tslint:disable-next-line: max-line-length
      `https://direct.tranzila.com/diplomacy/newiframe.php?user_id=${this.userId}&sum=${price}&currency=1&tranmode=AK&payment_type=DOCTOR-CALL-PACK&product_id=${id}`,
      '_blank',
      { hideurlbar: 'yes', location: 'yes' }
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

    this.browser.on('exit').subscribe(() => this.router.navigateByUrl('/online-doctor-choose'));
  }
}
