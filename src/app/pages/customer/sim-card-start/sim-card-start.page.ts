import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { forkJoin, of } from 'rxjs';
import { switchMap, tap, map, catchError } from 'rxjs/operators';

import { ApiService } from 'src/app/services/api.service';
import { LanguageService } from 'src/app/services/language.service';
import { StorageService } from 'src/app/services/storage.service';

import { BaseResponse, Plan } from 'src/app/models/models';

@Component({
  selector: 'app-sim-card-start',
  templateUrl: './sim-card-start.page.html',
  styleUrls: ['./sim-card-start.page.scss'],
})
export class SimCardStartPage {

  private isAuthorized: boolean;
  public text: any;

  constructor(
    private router: Router,
    private storage: StorageService,
    private api: ApiService,
    private language: LanguageService
  ) { }

  ionViewWillEnter() {
    this.getPageText();
    this.getIsAuthorized();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('sim_card_start');
  }

  private getIsAuthorized() {
    this.storage.get('token').subscribe(res => this.isAuthorized = res ? true : false);
  }

  public navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }

  public determineIsChoosedCompany() {
    if (!this.isAuthorized) {
      this.navigateTo('/choose-company');
      return;
    }
    this.api.getMyPlan()
      .pipe(
        map((res: BaseResponse) => res.content),
        catchError(() => of([]))
      )
      .subscribe(async (res: Array<Plan> | string) => this.navigateTo(res.length ? '/my-plan' : '/choose-company'));
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
          switchMap(() => forkJoin(
            this.storage.remove('token'),
            this.storage.remove('profile'),
            this.storage.remove('auth_type')
          ))
        ))
      )
      .subscribe(() => this.router.navigateByUrl('/login'));
  }
}
