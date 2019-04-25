import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from "@angular/router";

import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: "root"
})
export class MedicalHistoryGuard implements CanActivate {

  constructor(private router: Router, private api: ApiService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.api.checkMedicalHistory()
      .pipe(
        catchError(() => {
          this.router.navigateByUrl('/medical-history');
          return of(false);
        }),
        switchMap(() => of(true))
      )
  }
}