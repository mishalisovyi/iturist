import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { forkJoin, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { ApiService } from '../../../services/api.service';
import { StorageService } from '../../../services/storage.service';
import { LanguageService } from "../../../services/language.service";

import { Alert } from '../../../models/models';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  private languageSubscription: Subscription;
  private backBtnSubscription: Subscription;

  public text: any;
  public showPopup: boolean;
  public isAuthorized: boolean;
  public alert: Alert;
  public languageLabel: string = 'En';

  constructor(
    private router: Router,
    private iab: InAppBrowser,
    private api: ApiService,
    private storage: StorageService,
    private language: LanguageService,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.api.getLatestAlert().subscribe(res => this.alert = res.content);
    this.togglePopup(true);
  }

  ionViewWillEnter() {
    this.storage.get("language").subscribe((res: string) => this.language.loadLanguage(res ? res : "En"));
    this.languageSubscription = this.language.languageIsLoaded$.subscribe(() => this.getPageText());

    this.getIsAuthorized();

    if (this.storage.lastUrl === '/login') this.togglePopup(true);
  }

  ionViewWillLeave() {
    if (this.languageSubscription) this.languageSubscription.unsubscribe();
    if (this.backBtnSubscription) this.backBtnSubscription.unsubscribe();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories("main");
  }

  private getIsAuthorized() {
    this.api.getToken().subscribe((res: string) => {
      this.isAuthorized = res ? true : false;
      if (this.isAuthorized) this.registerBackBtn();
    });
  }

  private registerBackBtn() {
    this.backBtnSubscription = this.platform.backButton.subscribe(() => navigator['app'].exitApp());
  }

  private capitalizeFirstLetter(string) {
    return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
  }

  public setLanguage(language: string) {
    this.languageLabel = language;
    this.language.loadLanguage(language)
  }

  public navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  public openEasySite() {
    this.iab.create('https://easy.co.il/en/', '_blank', { beforeload: "yes", hideurlbar: "yes", location: "yes" });
  }

  public togglePopup(toggle: boolean) {
    this.showPopup = toggle;
  }

  public logout() {
    this.storage.get("auth_type")
      .pipe(
        tap(async (res: string) => {
          if (res === "GOOGLE") await this.api.googleLogout();
          if (res === "FACEBOOK") await this.api.facebookLogout();
        }),
        switchMap(() => this.api.logout().pipe(
          switchMap(() => forkJoin(this.storage.remove("token"), this.storage.remove("profile"), this.storage.remove("auth_type")))
        ))
      )
      .subscribe(() => this.router.navigateByUrl("/login"));
  }
}