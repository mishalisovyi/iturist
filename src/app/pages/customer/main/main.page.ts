import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { forkJoin, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { ApiService } from '../../../services/api.service';
import { StorageService } from '../../../services/storage.service';
import { LanguageService } from "../../../services/language.service";

import { BaseResponse } from "../../../models/models";

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit, OnDestroy {

  private subscription: Subscription;

  public text: any;
  public sectionsInfo = {
    securityAlerts: {
      disabled: false,
      number: 3
    },
    currencyRates: {
      disabled: false,
      number: 3
    },
    checkUpService: {
      disabled: true,
      number: 0
    },
    simCard: {
      disabled: false,
      number: 0
    },
    insurance: {
      disabled: true,
      number: 0
    },
    consularService: {
      disabled: false,
      number: 2
    },
    onlineDoctor: {
      disabled: false,
      number: 3
    },
    translationServices: {
      disabled: false,
      number: 9
    },
    tickets: {
      disabled: false,
      number: 0
    },
  }

  // public showView: boolean = false;

  constructor(
    private router: Router,
    private api: ApiService,
    private storage: StorageService,
    private language: LanguageService
  ) { }

  ngOnInit() {
    this.storage.get("language").subscribe((res: string) => {
      console.log(res);
      if (res) this.language.loadLanguage(res);
    });
    this.subscription = this.language.languageIsLoaded$.subscribe(() => this.getPageText());
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.api.getProfile().subscribe(res => console.log(res));
  }

  private getPageText() {
    console.log('get page text');
    this.text = this.language.getTextByCategories("main");
  }

  public determineIsChoosedCompany() {
    this.api.isChoosedCompany().subscribe((res: BaseResponse) => {
      this.navigateTo(res.content ? "/my-plan" : "/choose-company");
    })
  }

  public navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  public getProfile() {
    this.api.getProfile().subscribe(res => console.log(res));
  }

  // public logout() {
  //   this.api.logout()
  //     .pipe(switchMap(
  //       (res: BaseResponse) => {

  //         return forkJoin(this.storage.remove("token"), this.storage.remove("profile"))
  //       }
  //     ))
  //     .subscribe(() => this.router.navigateByUrl("/login"));
  // }

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