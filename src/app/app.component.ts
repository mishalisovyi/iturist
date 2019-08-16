import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

import { Platform, MenuController, ToastController, AlertController  } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Network } from '@ionic-native/network/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';

import { Subscription, forkJoin } from 'rxjs';
import { switchMap, tap, filter } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { ApiService } from 'src/app/services/api.service';
import { LanguageService } from 'src/app/services/language.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild('menu') public menu: MenuController;

  private languageSubscription: Subscription;
  private connectSubscription: Subscription;
  private disconnectSubscription: Subscription;
  private routerSubscription: Subscription;
  private previousConnectionStatus = 'online';

  public text: any;
  public iosPlatform: boolean;
  public isAuthorized: boolean;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private api: ApiService,
    private language: LanguageService,
    private storage: StorageService,
    private network: Network,
    private toast: ToastController,
    private oneSignal: OneSignal,
    private alertCtrl: AlertController
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.getPlatform();
    this.languageSubscription = this.language.languageIsLoaded$.subscribe(() => this.getPageText());
    this.routerSubscription = this.router.events
      .pipe(
        tap((event) => {
          if (event instanceof NavigationStart) {
            this.storage.lastUrl = this.router.url;
          }
        }),
        filter(event => event instanceof NavigationEnd),
        switchMap(() => this.api.getToken())
      )
      .subscribe(token => this.isAuthorized = token ? true : false);
  }

  ngOnDestroy() {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
    if (this.connectSubscription) {
      this.connectSubscription.unsubscribe();
    }
    if (this.disconnectSubscription) {
      this.disconnectSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (this.platform.is('cordova')) {
        this.setupPush();
      }

      this.language.loadLanguage();

      if (this.network.type === this.network.Connection.NONE) {
        await this.showToast('offline');
      }
      this.network.onchange().pipe().subscribe(async res => {
        await this.showToast(res.type);
        if (res.type === 'online') {
          this.storage.get('language').subscribe((resp: string) => this.language.loadLanguage(resp ? resp : 'En'));
        }
      });
    });
  }

  private setupPush() {
    this.oneSignal.startInit(environment.oneSignalAppID, environment.firebaseSenderID);
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);

    // Notifcation was received in general
    this.oneSignal.handleNotificationReceived().subscribe(data => {
      const msg = data.payload.body;
      const title = data.payload.title;
      const additionalData = data.payload.additionalData;
      this.showAlert(title, msg, additionalData.task);
    });

    // Notification was really clicked/opened
    this.oneSignal.handleNotificationOpened().subscribe(data => {
      // Just a note that the data is a different place here!
      const additionalData = data.notification.payload.additionalData;
      this.showAlert('Notification opened', 'You already read this before', additionalData.task);
    });

    this.oneSignal.endInit();
  }

  private async showAlert(title, msg, task) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: msg,
      buttons: [
        {
          text: `Action: ${task}`,
          handler: () => {
            // E.g: Navigate to a specific screen
          }
        }
      ]
    });
    alert.present();
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
      : this.text ? this.text.disconnected : 'Missing connection to Internet!';
  }

  public navigateTo(path: string) {
    this.router.navigateByUrl(path);
    this.menu.close();
  }

  public logout() {
    this.storage.get('auth_type')
      .pipe(
        tap(async (res: string) => {
          if (res === 'GOOGLE') {
            await this.api.googleLogout();
          }
          if (res === 'FACEBOOK') {
            await this.api.facebookLogout();
          }
          this.menu.close();
        }),
        switchMap(() => this.api.logout().pipe(
          switchMap(() => forkJoin(this.storage.remove('token'), this.storage.remove('profile'), this.storage.remove('auth_type')))
        ))
      )
      .subscribe(() => this.navigateTo('login'));
  }
}
