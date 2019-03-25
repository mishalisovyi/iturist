import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';

import { forkJoin, iif, of } from "rxjs";
import { switchMap, tap, map, catchError } from 'rxjs/operators';

import { StorageService } from '../../../services/storage.service';
import { ApiService } from '../../../services/api.service';
import { LanguageService } from "../../../services/language.service";

import { BaseResponse, Plan } from '../../../models/models';

@Component({
  selector: 'app-sim-card-start',
  templateUrl: './sim-card-start.page.html',
  styleUrls: ['./sim-card-start.page.scss'],
})
export class SimCardStartPage {

  public text: any;

  constructor(
    private router: Router,
    private alert: AlertController,
    private storage: StorageService,
    private api: ApiService,
    private language: LanguageService
  ) { }

  ionViewWillEnter() {
    this.getPageText();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories();
  }


  public navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }

  public determineIsChoosedCompany() {
    this.storage.get('phone')
      .pipe(
        switchMap(res => (
          iif(
            () => res !== 'none',
            this.api.getMyPlan()
              .pipe(
                map((res: BaseResponse) => res.content),
                catchError(() => of([]))
              ),
            of('none')
          )
        ))
      )
      .subscribe(async (res: Array<Plan> | string) => {
        if (res !== 'none') {
          this.navigateTo(res.length ? "/my-plan" : "/choose-company")
        } else {
          const alert = await this.alert.create({
            message: this.text.no_phone,
            buttons: [this.text.ok]
          });

          await alert.present();
          alert.onDidDismiss().then(() => this.navigateTo('/profile'));
        }
      });
  }

  public logout() {
    this.storage.get("auth_type")
      .pipe(
        tap(async (res: string) => {
          if (res === "GOOGLE") await this.api.googleLogout();
          if (res === "FACEBOOK") await this.api.facebookLogout();
        }),
        switchMap(() => this.api.logout().pipe(
          switchMap(() => forkJoin(
            this.storage.remove("token"),
            this.storage.remove("profile"),
            this.storage.remove("auth_type"),
            this.storage.remove('phone')
          ))
        ))
      )
      .subscribe(() => this.router.navigateByUrl("/login"));
  }
}