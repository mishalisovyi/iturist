import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";

import { Observable, Subject } from "rxjs";
import { map, switchMap } from "rxjs/operators";

import { BaseResponse, Language } from "../models/models";

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private languageIsLoadedSubject: Subject<boolean> = new Subject();
  public languageIsLoaded$: Observable<boolean> = this.languageIsLoadedSubject.asObservable();

  private _language: any;

  constructor(private http: HttpClient) { }

  public set language(language: any) {
    this._language = language;
  }

  public get language() {
    return this._language;
  }

  public loadLanguage(language: string = "En") {
    const params = new HttpParams().append('title', language);
    this.http.get<BaseResponse>(`${environment.api}/language`, { params })
      .pipe(
        map((res: BaseResponse) => res.content),
        switchMap((res: Array<Language>) => this.http.get(res[0].file_url))
      )
      .subscribe((res: any) => {
        this.language = res;
        console.log('language', this.language);
        this.languageIsLoadedSubject.next(true);
      });
  }

  public getTextByCategories(category?: string) {
    if (this.language) return category ? { ...this.language.common, ...this.language[category] } : { ...this.language.common };
    return {};
  }
}
