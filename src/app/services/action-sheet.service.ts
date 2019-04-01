import { Injectable } from '@angular/core';

import { Subject } from "rxjs";
import { map } from 'rxjs/operators';

import { ActionSheetController } from '@ionic/angular';

import { LanguageService } from "./language.service";
import { ApiService } from './api.service';

import { BaseResponse, Company } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ActionSheetService {

  private _language: string = "En";
  private _company: number = 1;
  private actionSheetDismissLanguageSubject: Subject<{ label: string, value: string }> = new Subject();
  private actionSheetDismissCompanySubject: Subject<{ label: string, value: number }> = new Subject();

  public actionSheetDismissLanguage$ = this.actionSheetDismissLanguageSubject.asObservable();
  public actionSheetDismissCompany$ = this.actionSheetDismissCompanySubject.asObservable();
  public text: any;

  constructor(
    private action: ActionSheetController,
    private languageService: LanguageService,
    private api: ApiService
  ) { }

  public set language(language: string) {
    this._language = language;
  }

  public get language(): string {
    return this._language;
  }

  public set company(company: number) {
    this._company = company;
  }

  public get company(): number {
    return this._company;
  }

  public async createLanguageActionSheet() {
    this.text = this.languageService.getTextByCategories();
    const actionSheet = await this.action.create({
      header: this.text.select_language,
      buttons: [
        {
          text: 'English',
          role: 'English',
          handler: () => { this.language = "En" }
        },
        {
          text: 'Deutsche',
          role: 'Deutsche',
          handler: () => { this.language = "Ge" }
        },
        {
          text: 'Français',
          role: 'Français',
          handler: () => { this.language = "Fr" }
        },
        {
          text: 'Italiano',
          role: 'Italiano',
          handler: () => { this.language = "It" }
        },
        {
          text: 'Español',
          role: 'Español',
          handler: () => { this.language = "Sp" }
        },
        {
          text: this.text.cancel,
          icon: 'close',
          role: 'cancel',
        }
      ],
    });
    await actionSheet.present();
    actionSheet.onDidDismiss().then((res) => {
      if (res.role !== "cancel" && res.role !== "backdrop") {
        this.actionSheetDismissLanguageSubject.next({ label: res.role, value: this.language });
      }
    });
  }

  public async createCompanyActionSheet() {
    this.api.getCompanies().pipe(map((res: BaseResponse) => res.content)).subscribe(async (res: Company[]) => {
      this.text = this.languageService.getTextByCategories("order_sim_form");
      const actionSheet = await this.action.create({
        header: this.text.choose_sim_company,
        buttons: [
          ...res.map((item: Company) => ({
            text: item.title,
            role: item.title,
            handler: () => { this.company = item.id }
          })),
          {
            text: this.text.cancel,
            icon: 'close',
            role: 'cancel',
          }
        ]
      });
      await actionSheet.present();
      actionSheet.onDidDismiss().then((res) => {
        if (res.role !== "cancel" && res.role !== "backdrop") this.actionSheetDismissCompanySubject.next({ label: res.role, value: this.company });
      });
    });
  }
}