import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";

import { Network } from '@ionic-native/network/ngx';

import { StorageService } from "../services/storage.service";

@Injectable({
  providedIn: "root"
})
export class NetworkGuard implements CanActivate {
  constructor(private storage: StorageService, private network: Network) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return !(this.network.type === this.network.Connection.NONE);
  }
}