import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { ApiService } from "./services/api.service";

import { BaseResponse } from "./models/models";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  @ViewChild("menu") public menu: MenuController;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private api: ApiService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  public navigateTo(path: string) {
    this.router.navigateByUrl(path);
    this.menu.close();
  }

  public determineIsChoosedCompany() {
    this.api.isChoosedCompany().subscribe((res: BaseResponse) => {
      this.navigateTo(res.content ? "/my-plan" : "/choose-company");
    })
  }
}