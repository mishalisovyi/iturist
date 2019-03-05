import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Subscription, forkJoin } from 'rxjs';
import { switchMap, filter, tap } from 'rxjs/operators';

import { ApiService } from "../../services/api.service";
import { StorageService } from "../../services/storage.service";
import { LanguageService } from "../../services/language.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private navigationSubscription: Subscription;
  private languageSubscription: Subscription;

  public hideBage: boolean = true;
  public isAuthorized: boolean;
  public text: any;

  constructor(
    private router: Router,
    private storage: StorageService,
    private api: ApiService,
    private language: LanguageService
  ) {
    this.storage.get("token").subscribe(res => {
      res ? this.isAuthorized = true : this.isAuthorized = false;
    })
  }


  ngOnInit() {
    this.hideBage = this.defineHidingBage();
    this.getPageText();

    this.languageSubscription = this.language.languageIsLoaded$.subscribe(() => this.getPageText());

    this.navigationSubscription = this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd)
      )
      .subscribe((e: any) => {
        this.getPageText();
        this.hideBage = this.defineHidingBage(e.url);
      });
  }

  ngOnDestroy() {
    this.navigationSubscription.unsubscribe();
    this.languageSubscription.unsubscribe();
  }

  private defineHidingBage(url: string = this.router.url): boolean {
    return url.includes('choose-plan') ? false : true;
  }

  private getPageText() {
    this.text = this.language.getTextByCategories("menu");
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