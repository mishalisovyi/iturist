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
}