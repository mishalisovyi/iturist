import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Subscription, of } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { ApiService } from "./services/api.service";
import { LanguageService } from "./services/language.service";

import { BaseResponse, Plan } from "./models/models";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild("menu") public menu: MenuController;

  private subscription: Subscription;

  public text: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private api: ApiService,
    private language: LanguageService
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.subscription = this.language.languageIsLoaded$.subscribe(() => this.getPageText());
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.language.loadLanguage();
    });
  }

  private getPageText() {
    this.text = this.language.getTextByCategories("menu");
  }

  public navigateTo(path: string) {
    this.router.navigateByUrl(path);
    this.menu.close();
  }

  public determineIsChoosedCompany() {
    this.api.getMyPlan()
      .pipe(
        map((res: BaseResponse) => res.content),
        catchError(() => of([]))
      )
      .subscribe((res: Array<Plan>) => this.navigateTo(res.length ? "/my-plan" : "/choose-company"));
  }
}