import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import * as _ from 'lodash';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

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

  public getPlans(id: string): Observable<any> {
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
    return of(plans);
  }

  constructor() { }
}
