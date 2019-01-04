import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  public hideBage: boolean = true;

  constructor(private router: Router) { }

  ngOnInit() {
    this.hideBage = this.defineHidingBage()

    this.subscription = this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd)
      )
      .subscribe((e: NavigationEnd) => {
        this.hideBage = this.defineHidingBage(e.url);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private defineHidingBage(url: string = this.router.url): boolean {
    return url.includes('choose-plan') ? false : true;
  }
}