import { Injectable } from "@angular/core";
import { Observable, from, Subject } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { Storage } from "@ionic/storage";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class StorageService {

  private _roleChange$: Subject<string> = new Subject();
  public roleChange$: Observable<string> = this._roleChange$.asObservable();

  constructor(private storage: Storage) { }

  set<T>(key: string, value: any): Observable<T> {
    if (!key) throw Error('argument "key" is required');
    if (!value) throw Error('argument "value" is required');

    if (key === "role") this._roleChange$.next(value);
    return from(this.storage.set(this.key(key), JSON.stringify(value))).pipe(switchMap(() => this.get(key)));
  }

  get<T>(key: string): Observable<T> {
    if (!key) throw Error('argument "key" is required');
    return from(this.storage.get(this.key(key))).pipe(map(res => JSON.parse(res)));
  }

  getBase<T>(key: string): Observable<T> {
    if (!key) throw Error('argument "key" is required');
    return from(this.storage.get(this.key(key))).pipe(map(res => JSON.parse(res)["content"]));
  }

  remove<T>(key: string): Observable<any> {
    if (!key) throw Error('argument "key" is required');
    return from(this.storage.remove(this.key(key))).pipe(map(res => { }));
  }

  key(key: string): string {
    return `${environment.storage}_${key}`;
  }
}
