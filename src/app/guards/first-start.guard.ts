import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from "@angular/router";

import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";

import { StorageService } from "../services/storage.service";

@Injectable({
  providedIn: "root"
})
export class FirstStartGuard implements CanActivate {
  constructor(private storage: StorageService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.storage.get('not_first_launch')
      .pipe(
        switchMap(res => {
          const allowed = res ? false : true;
          if (!allowed) this.router.navigateByUrl('/login');
          return this.storage.set('not_first_launch', 'true').pipe(switchMap(() => of(allowed)));
        })
      )
  }
}