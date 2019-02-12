import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController } from '@ionic/angular';

import { StorageService } from "./services/storage.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  @ViewChild("menu") public menu: MenuController;

  public role: string = "CUSTOMER";

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private storage: StorageService
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.storage.roleChange$.subscribe((res: string) => this.role = res);
    this.storage.get("role").subscribe((res: string) => {
      if (res) this.role = res;
    })
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
}