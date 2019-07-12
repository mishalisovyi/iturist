import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ActionSheetController } from '@ionic/angular';

import { LanguageService } from 'src/app/services/language.service';
import { ApiService } from 'src/app/services/api.service';

import { BaseResponse, Company } from 'src/app/models/models';

@Injectable({
  providedIn: 'root'
})
export class ActionSheetService {

  private _language = 'En';
  private _company = 1;
  private _doctor = 'PEDIATR';
  private _creditCard = null;
  private actionSheetDismissLanguageSubject: Subject<{ label: string, value: string }> = new Subject();
  private actionSheetDismissCompanySubject: Subject<{ label: string, value: number }> = new Subject();
  private actionSheetDismissDoctorSubject: Subject<{ label: string, value: string }> = new Subject();
  private actionSheetDismissCreditCardSubject: Subject<{ label: string, value: number }> = new Subject();

  public actionSheetDismissLanguage$ = this.actionSheetDismissLanguageSubject.asObservable();
  public actionSheetDismissCompany$ = this.actionSheetDismissCompanySubject.asObservable();
  public actionSheetDismissDoctor$ = this.actionSheetDismissDoctorSubject.asObservable();
  public actionSheetDismissCreditCard$ = this.actionSheetDismissCreditCardSubject.asObservable();
  public text: any;

  constructor(
    private action: ActionSheetController,
    private languageService: LanguageService,
    private api: ApiService
  ) { }

  private hideCreditCardNumber(number: string): string {
    return '*'.repeat(number.length - 4).concat(number.slice(-4));
  }

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

  public set doctor(doctor: string) {
    this._doctor = doctor;
  }

  public get doctor(): string {
    return this._doctor;
  }

  public set creditCard(creditCard: number) {
    this._creditCard = creditCard;
  }

  public get creditCard(): number {
    return this._creditCard;
  }

  public async createLanguageActionSheet() {
    this.text = this.languageService.getTextByCategories();
    const actionSheet = await this.action.create({
      header: this.text.select_language,
      buttons: [
        {
          text: 'English',
          role: 'English',
          handler: () => { this.language = 'En'; }
        },
        // {
        //   text: 'Deutsche',
        //   role: 'Deutsche',
        //   handler: () => { this.language = 'Ge' }
        // },
        {
          text: 'Français',
          role: 'Français',
          handler: () => { this.language = 'Fr'; }
        },
        {
          text: 'Русский',
          role: 'Русский',
          handler: () => { this.language = 'Ru'; }
        },
        // {
        //   text: 'Italiano',
        //   role: 'Italiano',
        //   handler: () => { this.language = 'It' }
        // },
        {
          text: 'Español',
          role: 'Español',
          handler: () => { this.language = 'Sp'; }
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
      if (res.role !== 'cancel' && res.role !== 'backdrop') {
        this.actionSheetDismissLanguageSubject.next({ label: res.role, value: this.language });
      }
    });
  }

  public createCompanyActionSheet() {
    this.api.getCompanies().pipe(map((res: BaseResponse) => res.content)).subscribe(async (res: Company[]) => {
      this.text = this.languageService.getTextByCategories('order_sim_form');
      const actionSheet = await this.action.create({
        header: this.text.choose_sim_company,
        buttons: [
          ...res.map((item: Company) => ({
            text: item.title,
            role: item.title,
            handler: () => { this.company = item.id; }
          })),
          {
            text: this.text.cancel,
            icon: 'close',
            role: 'cancel',
          }
        ]
      });
      await actionSheet.present();
      actionSheet.onDidDismiss().then((resp) => {
        if (resp.role !== 'cancel' && resp.role !== 'backdrop') {
          this.actionSheetDismissCompanySubject.next({ label: resp.role, value: this.company });
        }
      });
    });
  }

  public createCreditCardActionSheet() {
    this.text = this.languageService.getTextByCategories();

    this.api.getCreditCardsList().pipe(map((res: BaseResponse) => res.content)).subscribe(async res => {
      const actionSheet = await this.action.create({
        header: this.text.select_credit_card,
        buttons: [
          ...res.map(item => ({
            text: this.hideCreditCardNumber(item.token),
            role: this.hideCreditCardNumber(item.token),
            handler: () => { this.creditCard = item.id; }
          })),
          {
            text: this.text.cancel,
            icon: 'close',
            role: 'cancel',
          }
        ]
      });
      await actionSheet.present();
      actionSheet.onDidDismiss().then((result) => {
        if (result.role !== 'cancel' && result.role !== 'backdrop') {
          this.actionSheetDismissCreditCardSubject.next({ label: result.role, value: this.creditCard });
        }
      });
    });
  }

  public createDoctorsActionSheet() {
    this.text = this.languageService.getTextByCategories();

    this.api.getDoctorSpecializations().pipe(map((res: any) => res.specialization)).subscribe(async res => {

      const actionSheet = await this.action.create({
        header: 'Select doctor specialization',
        buttons: [
          ...res.map(item => ({
            text: item[1],
            role: item[1],
            handler: () => this.doctor = item[0]
          })),
          {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel',
          }
        ],
      });

      await actionSheet.present();
      actionSheet.onDidDismiss().then(resp => {
        if (resp.role !== 'cancel' && resp.role !== 'backdrop') {
          this.actionSheetDismissDoctorSubject.next({ label: resp.role, value: this.doctor });
        }
      });
    });
  }
}
