import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Platform, AlertController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Subscription, of, iif, forkJoin } from "rxjs";
import { map, catchError, switchMap, tap } from "rxjs/operators";

import { ApiService } from "./services/api.service";
import { LanguageService } from "./services/language.service";
import { StorageService } from './services/storage.service';

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
  public iosPlatform;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private api: ApiService,
    private language: LanguageService,
    private alert: AlertController,
    private storage: StorageService
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.subscription = this.language.languageIsLoaded$.subscribe(() => this.getPageText());
    this.getPlatform();
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

  private getPlatform() {
    this.iosPlatform = this.platform.is('ios');
  }

  public navigateTo(path: string) {
    this.router.navigateByUrl(path);
    this.menu.close();
  }

  public determineIsChoosedCompany() {
    this.storage.get('phone')
      .pipe(
        switchMap(res => (
          iif(
            () => res !== 'none',
            this.api.getMyPlan()
              .pipe(
                map((res: BaseResponse) => res.content),
                catchError(() => of([]))
              ),
            of('none')
          )
        ))
      )
      .subscribe(async (res: Array<Plan> | string) => {
        if (res !== 'none') {
          this.navigateTo(res.length ? "/my-plan" : "/choose-company")
        } else {
          this.menu.close();
          const alert = await this.alert.create({
            message: this.text.no_phone,
            buttons: [this.text.ok]
          });

          await alert.present();
          alert.onDidDismiss().then(() => this.navigateTo('/profile'));
        }
      });
  }

  public logout() {
    this.storage.get("auth_type")
      .pipe(
        tap(async (res: string) => {
          if (res === "GOOGLE") await this.api.googleLogout();
          if (res === "FACEBOOK") await this.api.facebookLogout();
          this.menu.close();
        }),
        switchMap(() => this.api.logout().pipe(
          switchMap(() => forkJoin(this.storage.remove("token"), this.storage.remove("profile"), this.storage.remove("auth_type"), this.storage.remove('phone')))
        ))
      )
      .subscribe(() => this.navigateTo('login'));
  }
}