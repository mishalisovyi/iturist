import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { forkJoin } from 'rxjs';
import { switchMap, tap, map, finalize } from 'rxjs/operators';
import * as moment from 'moment';

import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';
import { LanguageService } from 'src/app/services/language.service';

import { Alert, BaseResponse } from 'src/app/models/models';

@Component({
  selector: 'app-alerts-and-notifications',
  templateUrl: './alerts-and-notifications.page.html',
  styleUrls: ['./alerts-and-notifications.page.scss'],
})
export class AlertsAndNotificationsPage {

  public text: any;
  public alerts: Alert[];
  public isAuthorized = false;
  public noData = false;
  public loading: boolean;

  constructor(
    private router: Router,
    private storage: StorageService,
    private api: ApiService,
    private language: LanguageService
  ) { }

  ionViewWillEnter() {
    this.getPageText();
    this.getToken();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('alerts_and_notifications');
    this.getAlerts();
  }

  private getToken() {
    this.storage.get('token').subscribe(res => this.isAuthorized = res ? true : false);
  }

  private getAlerts() {
    this.loading = true;
    this.api.getAlerts()
      .pipe(
        map((res: BaseResponse) => {
          res.content.forEach((item: Alert) => {
            if (item.pubDate) {
              item.pubDate = moment.utc(item.pubDate.replace('UTC:00', '')).toString();
            }
          });
          // console.log(res.content);
          // res.content = res.content.sort((item1, item2) => new Date(item1.pubDate) < new Date(item2.pubDate) ? 1 : -1).splice(0, 50);
          // res.content.sort((item1, item2) => new Date(item1) < new Date(item2) ? -1 : 1);
          return res.content.sort((item1, item2) => new Date(item1.pubDate) < new Date(item2.pubDate) ? 1 : -1).splice(0, 50);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(
        (res: Alert[]) => this.alerts = res,
        err => {
          if (err.error.metadata.api_error_codes.includes(125)) {
            this.noData = true;
          }
        }
      );
  }

  public navigateTo(to: string) {
    this.router.navigateByUrl(`/${to}`);
  }

  public logout() {
    this.storage.get('auth_type')
      .pipe(
        tap(async (res: string) => {
          if (res === 'GOOGLE') {
            await this.api.googleLogout();
          }
          if (res === 'FACEBOOK') {
            await this.api.googleLogout();
          }
        }),
        switchMap(() => this.api.logout().pipe(
          switchMap(() => forkJoin(this.storage.remove('token'), this.storage.remove('profile'), this.storage.remove('auth_type')))
        ))
      )
      .subscribe(() => this.navigateTo('login'));
  }
}
