import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';

import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import * as _ from 'lodash';

import { StorageService } from '../services/storage.service';

import { BaseResponse } from "../models/models";
import { ProfileEditRequest } from "../models/models";

import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private googlePlus: GooglePlus,
    private fb: Facebook
  ) { }

  private _isOrderedSimCard: boolean = false;

  // public get isOrderedSimCard(): boolean {
  //   return this._isOrderedSimCard;
  // }

  // public set isOrderedSimCard(isOrdered: boolean) {
  //   this._isOrderedSimCard = isOrdered;
  // }

  public isChoosedCompany(): Observable<BaseResponse> {
    return of({
      content: _.sample([true, false]),
      metadata: {}
    }).pipe(delay(100));
  }

  public orderSim(data: any): Observable<any> {
    return of(data).pipe(delay(200));
  }

  public getCompanies() {
    return this.http.get<BaseResponse>(`${environment.api}/companies`);
  }

  public getPlans(id: string): Observable<any> {
    const httpParams = new HttpParams().set("company_id", id);
    return this.http.get<BaseResponse>(`${environment.api}/simpackages`, { params: httpParams });
  }

  public getCallees(): Observable<BaseResponse> {
    const callees: Array<any> = [];
    for (let i = 0; i < _.random(2, 6); ++i) {
      callees.push({
        name: `Callee ${i + 1}`,
        lastCall: new Date().toISOString()
      })
    }
    return of({
      content: callees,
      metadata: {}
    }).pipe(delay(200));
  }

  public getPlan(id: string): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(`${environment.api}/simpackages/${id}`);
  }

  public getMyPlan(): Observable<any> {
    return of({
      id: _.random(1, 100000),
      calls: _.random(1, 500),
      internet: _.random(1, 200),
      sms: _.random(1, 200),
      used: {
        calls: _.random(1, 500),
        internet: _.random(1, 200),
        sms: _.random(1, 200)
      }
    }).pipe(delay(200));
  }

  public confirmPlan(data: any): Observable<any> {
    return of(data).pipe(delay(200));
  }

  public getMyCompanyId(): Observable<number> {
    return of(_.random(0, 2)).pipe(delay(100));
  }

  public register(data: FormData): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${environment.api}/registration`, data);
  }

  public socialRegister(data: { type: string, social_token: string }): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${environment.api}/social-registration`, data);
  }

  public socialUnregister(data: { type: string }): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${environment.api}/social-unregistration`, data);
  }

  public postImages(data: FormData) {
    // const headers = new HttpHeaders({
    //   "cache-control": "no-cache"
    // })
    // return this.http.post<BaseResponse>(`${environment.api}/user/profile/photo`, data, { headers });

    return this.http.post<BaseResponse>(`${environment.api}/user/profile/photo`, data);
  }

  public googleLogin(data: { token: string }): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${environment.api}/login-google`, data);
  }

  public facebookLogin(data: { token: string }): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${environment.api}/login-facebook`, data);
  }

  public login(data: FormData): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${environment.api}/login`, data);
  }

  public logout(): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(`${environment.api}/logout`);
  }

  public async googleLogout() {
    await this.googlePlus.disconnect();
  }

  public async facebookLogout() {
    await this.fb.logout();
  }

  public getToken(): Observable<any> {
    return this.storage.get<any>("token");
  }

  public getProfile(): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(`${environment.api}/user/profile`);
  }

  public editProfile(id: number, user: ProfileEditRequest): Observable<BaseResponse> {
    return this.http.patch<BaseResponse>(`${environment.api}/users/${id}`, user);
  }

  postDeviceId(data): Observable<BaseResponse> {
    return of({
      content: {
        success: "success"
      },
      metadata: {}
    }).pipe(delay(200));
  }

  public checkCallPossibility(): Observable<BaseResponse> {
    return of({
      content: {
        id: "aaaa",
        token: "aaaaa",
        possible: true
      },
      metadata: {}
    });
  }

  public postCallInformation(info: any): Observable<BaseResponse> {
    return of({
      content: {
        duration: info.duration
      },
      metadata: {}
    }).pipe(delay(200));
  }



  // public editProfile(data: FormData) {
  //   return of({
  //     name: "name",
  //     email: "email",
  //     language: "english",
  //     profile_photo: "../../assets/screens/test.png",
  //     airline_photo: "../../assets/screens/test.png",
  //     travel_photo: "../../assets/screens/test.png",
  //     passport_photo: "../../assets/screens/test.png"
  //   }).pipe(delay(200));
  // }

}