import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { forkJoin } from 'rxjs';
import { switchMap, tap, map } from 'rxjs/operators';
import * as moment from 'moment';

import { ApiService } from "../../../services/api.service";
import { StorageService } from "../../../services/storage.service";
import { LanguageService } from "../../../services/language.service";

import { Alert, BaseResponse } from '../../../models/models';

@Component({
  selector: 'app-alerts-and-notifications',
  templateUrl: './alerts-and-notifications.page.html',
  styleUrls: ['./alerts-and-notifications.page.scss'],
})
export class AlertsAndNotificationsPage {

  public text: any;
  public alerts: Alert[];
  public isAuthorized: boolean = false;

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
    this.api.getAlerts()
      .pipe(map((res: BaseResponse) => {
        res.content.forEach((item: Alert) => {
          if (item.pubDate) item.pubDate = moment.utc(item.pubDate.replace("UTC:00", "")).toString();
        });
        res.content = res.content.reverse();
        return res.content;
      }))
      .subscribe((res: Alert[]) => this.alerts = res);
  }

  public navigateTo(to: string) {
    this.router.navigateByUrl(`/${to}`);
  }

  public logout() {
    this.storage.get("auth_type")
      .pipe(
        tap(async (res: string) => {
          if (res === "GOOGLE") await this.api.googleLogout();
          if (res === "FACEBOOK") await this.api.facebookLogout();
        }),
        switchMap(() => this.api.logout().pipe(
          // switchMap(() => forkJoin(this.storage.remove("token"), this.storage.remove("profile"), this.storage.remove("auth_type"), this.storage.remove('phone')))
          switchMap(() => forkJoin(this.storage.remove("token"), this.storage.remove("profile"), this.storage.remove("auth_type")))
        ))
      )
      .subscribe(() => this.navigateTo('login'));
  }
}