import { Injectable } from '@angular/core';

import { Subject } from "rxjs";

import { ActionSheetController } from '@ionic/angular';

import { LanguageService } from "./language.service";

@Injectable({
  providedIn: 'root'
})
export class ActionSheetService {

  private _language: string = "En";
  private actionSheetDismissSubject: Subject<{ label: string, value: string }> = new Subject();

  public actionSheetDismiss$ = this.actionSheetDismissSubject.asObservable();
  public text: any;

  constructor(
    private action: ActionSheetController,
    private languageService: LanguageService
  ) { }

  public set language(language: string) {
    this._language = language;
  }

  public get language(): string {
    return this._language;
  }

  public async createLanguageActionSheet() {
    this.text = this.languageService.getTextByCategories("menu");
    console.log(this.text);
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
        this.actionSheetDismissSubject.next({ label: res.role, value: this.language });
      }
    });
  }
}
