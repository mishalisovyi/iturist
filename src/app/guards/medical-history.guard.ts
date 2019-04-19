import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class MedicalHistoryGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.router.navigateByUrl('/medical-history');
    return false;
  }
}