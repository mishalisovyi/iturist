import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { forkJoin, Subscription, of } from 'rxjs';
import { switchMap, tap, map, catchError } from 'rxjs/operators';

import { ApiService } from '../../../services/api.service';
import { StorageService } from '../../../services/storage.service';
import { LanguageService } from "../../../services/language.service";

import { BaseResponse } from "../../../models/models";

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage {

  private subscription: Subscription;

  public text: any;

  constructor(
    private router: Router,
    private api: ApiService,
    private storage: StorageService,
    private language: LanguageService
  ) { }

  ionViewWillEnter() {
    this.storage.get("language").subscribe((res: string) => this.language.loadLanguage(res ? res : "En"));
    this.subscription = this.language.languageIsLoaded$.subscribe(() => this.getPageText());
  }

  ionViewWillLeave() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories("main");
  }

  public determineIsChoosedCompany() {
    this.api.getMyPlan()
      .pipe(
        map((res: BaseResponse) => res.content),
        catchError(() => of([]))
      )
      .subscribe(res => this.navigateTo(res.length ? "/my-plan" : "/choose-company"));
  }

  public navigateTo(route: string) {
    this.router.navigateByUrl(route);
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