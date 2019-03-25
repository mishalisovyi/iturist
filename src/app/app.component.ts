import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Platform, MenuController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Network } from '@ionic-native/network/ngx';

import { Subscription, forkJoin } from "rxjs";
import { switchMap, tap } from "rxjs/operators";

import { ApiService } from "./services/api.service";
import { LanguageService } from "./services/language.service";
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild("menu") public menu: MenuController;

  private languageSubscription: Subscription;
  private connectSubscription: Subscription;
  private disconnectSubscription: Subscription;
  private previousConnectionStatus: string = 'online';

  public text: any;
  public iosPlatform: boolean;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private api: ApiService,
    private language: LanguageService,
    private storage: StorageService,
    private network: Network,
    private toast: ToastController
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.getPlatform();
    this.languageSubscription = this.language.languageIsLoaded$.subscribe(() => this.getPageText());
  }

  ngOnDestroy() {
    if (this.languageSubscription) this.languageSubscription.unsubscribe();
    if (this.connectSubscription) this.connectSubscription.unsubscribe();
    if (this.disconnectSubscription) this.disconnectSubscription.unsubscribe();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.language.loadLanguage();

      if (this.network.type === this.network.Connection.NONE) await this.showToast('offline')
      this.network.onchange().pipe().subscribe(async res => {
        await this.showToast(res.type);
        if (res.type === 'online') this.storage.get("language").subscribe((res: string) => this.language.loadLanguage(res ? res : "En"))
      });
    });
  }

  private getPageText() {
    this.text = this.language.getTextByCategories();
  }

  private getPlatform() {
    this.iosPlatform = this.platform.is('ios');
  }

  private async showToast(type: string) {
    if (type !== this.previousConnectionStatus) {
      const toast = await this.toast.create({
        message: this.getMessageText(type),
        duration: 2000
      });
      toast.present();
    }
    this.previousConnectionStatus = type;
  }

  private getMessageText(type: string): string {
    return type === 'online'
      ? this.text ? this.text.connected : 'Connected to Internet!'
      : this.text ? this.text.disconnected : 'Missing connection to Internet!'
  }

  public navigateTo(path: string) {
    this.router.navigateByUrl(path);
    this.menu.close();
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