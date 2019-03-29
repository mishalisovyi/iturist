import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { forkJoin } from "rxjs";
import { switchMap, tap } from 'rxjs/operators';

import { StorageService } from '../../../services/storage.service';
import { ApiService } from '../../../services/api.service';
import { LanguageService } from "../../../services/language.service";

@Component({
  selector: 'app-alerts-and-notifications-start',
  templateUrl: './alerts-and-notifications-start.page.html',
  styleUrls: ['./alerts-and-notifications-start.page.scss'],
})
export class AlertsAndNotificationsStartPage {

  public text: any;

  constructor(
    private router: Router,
    private storage: StorageService,
    private api: ApiService,
    private language: LanguageService
  ) { }

  ionViewWillEnter() {
    this.getPageText();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('alerts_and_notifications_start');
  }


  public navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }

  public logout() {
    this.storage.get("auth_type")
      .pipe(
        tap(async (res: string) => {
          if (res === "GOOGLE") await this.api.googleLogout();
          if (res === "FACEBOOK") await this.api.facebookLogout();
        }),
        switchMap(() => this.api.logout().pipe(
          switchMap(() => forkJoin(
            this.storage.remove("token"),
            this.storage.remove("profile"),
            this.storage.remove("auth_type")
            // this.storage.remove('phone')
          ))
        ))
      )
      .subscribe(() => this.router.navigateByUrl("/login"));
  }
}