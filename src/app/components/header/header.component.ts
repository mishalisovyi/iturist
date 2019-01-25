import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ApiService } from "../../services/api.service";
import { StorageService } from "../../services/storage.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  public hideBage: boolean = true;
  public isMainPage: boolean = false;
  public isAuthorized: boolean;

  constructor(private router: Router, private storage: StorageService, private api: ApiService) {
    this.storage.get("authorization").subscribe(res => {
      console.log(res);
      res ? this.isAuthorized = true : this.isAuthorized = false;
    })
  }

  ngOnInit() {
    this.hideBage = this.defineHidingBage()

    this.subscription = this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd)
      )
      .subscribe((e: NavigationEnd) => {
        this.hideBage = this.defineHidingBage(e.url);
        e.url.includes("main") ? this.isMainPage = true : this.isMainPage = false;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private defineHidingBage(url: string = this.router.url): boolean {
    return url.includes('choose-plan') ? false : true;
  }

  public logout() {
    this.api.logout().subscribe(res => this.router.navigateByUrl("/login"));
  }
}