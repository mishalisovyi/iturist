import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ApiService } from '../../services/api.service';
import { StorageService } from '../../services/storage.service';

import { BaseResponse } from "../../models/models";

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  public sectionsInfo = {
    securityAlerts: {
      disabled: false,
      number: 3
    },
    currencyRates: {
      disabled: false,
      number: 3
    },
    checkUpService: {
      disabled: true,
      number: 0
    },
    simCard: {
      disabled: false,
      number: 0
    },
    insurance: {
      disabled: true,
      number: 0
    },
    consularService: {
      disabled: false,
      number: 2
    },
    onlineDoctor: {
      disabled: false,
      number: 3
    },
    translationServices: {
      disabled: false,
      number: 9
    },
    tickets: {
      disabled: false,
      number: 0
    },
  }

  public showView: boolean = false;

  constructor(private router: Router, private api: ApiService, private storage: StorageService) { }

  ngOnInit() {
    // this.api.getProfile().subscribe(res => {
    //   console.log(res);
    //   this.storage.set<Profile>("profile", res.content);
    // });
    this.storage.get("role").subscribe(res => {
      if (res === "DOCTOR") {
        this.router.navigateByUrl("/doctor-call-checker");
      } else {
        this.showView = true;
      }
    });
  }

  public navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  public getProfile() {
    this.api.getProfile().subscribe(res => console.log(res));
  }

  public logout() {
    this.api.logout()
      .pipe(switchMap(
        (res: BaseResponse) => {
          alert("Logout: " + JSON.stringify(res));
          console.log(res);
          return forkJoin(this.storage.remove("token"), this.storage.remove("profile"))
        }
      ))
      .subscribe(() => this.router.navigateByUrl("/login"));
  }
}