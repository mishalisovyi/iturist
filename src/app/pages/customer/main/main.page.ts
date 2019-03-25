import { Component } from '@angular/core';
import { Router } from '@angular/router';

// import { AlertController } from '@ionic/angular';

// import { forkJoin, Subscription, of, iif } from 'rxjs';
// import { switchMap, tap, map, catchError } from 'rxjs/operators';

import { forkJoin, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { ApiService } from '../../../services/api.service';
import { StorageService } from '../../../services/storage.service';
import { LanguageService } from "../../../services/language.service";

// import { BaseResponse, Plan } from "../../../models/models";

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
    // private alert: AlertController,
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

  // public determineIsChoosedCompany() {
  //   this.storage.get('phone')
  //     .pipe(
  //       switchMap(res => (
  //         iif(
  //           () => res !== 'none',
  //           this.api.getMyPlan()
  //             .pipe(
  //               map((res: BaseResponse) => res.content),
  //               catchError(() => of([]))
  //             ),
  //           of('none')
  //         )
  //       ))
  //     )
  //     .subscribe(async (res: Array<Plan> | string) => {
  //       if (res !== 'none') {
  //         this.navigateTo(res.length ? "/my-plan" : "/choose-company")
  //       } else {
  //         const alert = await this.alert.create({
  //           message: this.text.no_phone,
  //           buttons: [this.text.ok]
  //         });

  //         await alert.present();
  //         alert.onDidDismiss().then(() => this.navigateTo('/profile'));
  //       }
  //     });
  // }

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