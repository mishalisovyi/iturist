import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { forkJoin, Subscription } from 'rxjs';
import { switchMap, tap, finalize } from 'rxjs/operators';

import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';
import { LanguageService } from 'src/app/services/language.service';

import { Alert } from 'src/app/models/models';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  private languageSubscription: Subscription;
  private backBtnSubscription: Subscription;
  private latitude: number;
  private longitude: number;

  public text: any;
  public showAlertPopup = false;
  public showWeatherPopup: boolean;
  public isAuthorized: boolean;
  public weatherIsLoaded = false;
  public alert: Alert;
  public languageLabel = 'En';
  public humidity: number;
  public wind: number;
  public temperature: number;
  public pathToWeatherIcon: string;
  public city: string;
  public hideEasyText = false;
  public geolocationWorks = false;

  constructor(
    private router: Router,
    private iab: InAppBrowser,
    private api: ApiService,
    private storage: StorageService,
    private language: LanguageService,
    private platform: Platform,
    private geolocation: Geolocation
  ) { }

  async ngOnInit() {
    const geolocationLoaded = await this.getGeolocation();
    if (geolocationLoaded) {
      this.getCurrentWeather();
      this.toggleWeatherPopup(true);
    }
    this.getLatestAlert();
  }

  ionViewWillEnter() {
    this.storage.get('language').subscribe((res: string) => this.language.loadLanguage(res ? res : 'En'));
    this.languageSubscription = this.language.languageIsLoaded$.subscribe(() => this.getPageText());

    this.getIsAuthorized();

    if (this.storage.lastUrl === '/login') {
      this.toggleAlertPopup(true);
      this.toggleWeatherPopup(true);
    }
  }

  ionViewWillLeave() {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }
  }

  private getLatestAlert() {
    this.api.getLatestAlert().subscribe(res => {
      this.toggleAlertPopup(true);
      this.alert = res.content;
    });
  }

  private async getGeolocation(): Promise<boolean> {
    return new Promise(resolve => {
      const timeout = setTimeout(() => resolve(false), 5000);

      this.geolocation.getCurrentPosition().then(({ coords: { latitude, longitude } }) => {
        this.latitude = latitude;
        this.longitude = longitude;
        clearTimeout(timeout);
        resolve(true);
      });
    });
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('main');
  }

  private getCurrentWeather() {
    this.api.getCurrentWeather(this.latitude, this.longitude)
      .pipe(finalize(() => this.weatherIsLoaded = true))
      .subscribe((res: any) => {
        this.city = res.name;
        this.humidity = res.main.humidity;
        this.wind = res.wind.speed;  // m / s
        this.temperature = this.kelvinToCelsius(res.main.temp);
        const index = this.getIndexForWeatherIconsMap(res.weather[0].id);
        this.pathToWeatherIcon = `assets/screens/${this.getWeatherIcon(index)}`;
      });
  }

  private getWeatherIcon(code: string) {
    return {
      '2': `thunder-blue.svg`,
      '3': `rain-blue.svg`,
      '5': `rain-blue.svg`,
      '6': `rain-blue.svg`,
      '7': `clouds-blue.svg`,
      '800': `sun-blue.svg`,
      '801': `half-sun-blue.svg`,
      '802': `half-sun-blue.svg`,
      '803': `clouds-blue.svg`,
      '804': `clouds-blue.svg`,
    }[code];
  }

  private getIsAuthorized() {
    this.api.getToken().subscribe((res: string) => {
      this.isAuthorized = res ? true : false;
      if (this.isAuthorized) {
        this.registerBackBtn();
      }
    });
  }

  private registerBackBtn() {
    this.backBtnSubscription = this.platform.backButton.subscribe(() => navigator['app'].exitApp());
  }

  private kelvinToCelsius(K: number) {
    return Math.round(K - 273.15);
  }

  private getIndexForWeatherIconsMap(code: number) {
    const stringCode = code.toString();
    if (stringCode.startsWith('8')) {
      return stringCode;
    }
    return stringCode.charAt(0);
  }

  public scrollListener(e) {
    this.hideEasyText = e.detail.scrollTop > 20;
  }

  public setLanguage(language: string) {
    this.languageLabel = language;
    this.language.loadLanguage(language);
  }

  public navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  public openEasySite() {
    this.iab.create('https://easy.co.il/en/', '_blank', { beforeload: 'yes', hideurlbar: 'yes', location: 'yes' });
  }

  public toggleAlertPopup(toggle: boolean) {
    this.showAlertPopup = toggle;
  }

  public toggleWeatherPopup(toggle: boolean) {
    this.showWeatherPopup = toggle;
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
        }),
        switchMap(() => this.api.logout().pipe(
          switchMap(() => forkJoin(this.storage.remove('token'), this.storage.remove('profile'), this.storage.remove('auth_type')))
        ))
      )
      .subscribe(() => this.router.navigateByUrl('/login'));
  }
}
