import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

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

  constructor(private http: HttpClient, private storage: StorageService) { }

  private _isOrderedSimCard: boolean = false;

  public get isOrderedSimCard(): boolean {
    return this._isOrderedSimCard;
  }

  public set isOrderedSimCard(isOrdered: boolean) {
    this._isOrderedSimCard = isOrdered;
  }

  public orderSim(data: any): Observable<any> {
    return of(data).pipe(delay(200));
  }

  public getPlans(id: string): Observable<Array<any>> {
    const plans: Array<any> = [];
    for (let i = 0; i < _.random(3, 10); ++i) {
      plans.push({
        id: _.random(1, 100000),
        calls: _.random(1, 500),
        internet: _.random(1, 200),
        sms: _.random(1, 200),
        price: _.random(1, 100)
      })
    }
    return of(plans).pipe(delay(200));
  }

  public getPlan(id: string): Observable<any> {
    return of({
      id: _.random(1, 100000),
      calls: _.random(1, 500),
      internet: _.random(1, 200),
      sms: _.random(1, 200),
      price: _.random(1, 100)
    }).pipe(delay(200));
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

  public postImages(data: FormData) {
    // const headers = new HttpHeaders({
    //   "cache-control": "no-cache"
    // })
    // return this.http.post<BaseResponse>(`${environment.api}/user/profile/photo`, data, { headers });

    return this.http.post<BaseResponse>(`${environment.api}/user/profile/photo`, data);
  }

  public login(data: FormData): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(`${environment.api}/login`, data);
  }

  public logout(): Observable<BaseResponse> {
    return this.http.get<BaseResponse>(`${environment.api}/logout`);
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