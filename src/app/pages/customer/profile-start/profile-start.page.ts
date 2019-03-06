import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';

import { forkJoin } from "rxjs";
import { switchMap, tap } from 'rxjs/operators';

import { StorageService } from '../../../services/storage.service';
import { ApiService } from '../../../services/api.service';
import { LanguageService } from "../../../services/language.service";

import { Profile } from '../../../models/models';

@Component({
  selector: 'app-profile-start',
  templateUrl: './profile-start.page.html',
  styleUrls: ['./profile-start.page.scss'],
})
export class ProfileStartPage {

  public profile: Profile;
  public text: any;
  public iosPlatform: boolean = false;

  constructor(
    private router: Router,
    private storage: StorageService,
    private api: ApiService,
    private language: LanguageService,
    private platform: Platform
  ) { }

  ionViewWillEnter() {
    this.getPageText();
    this.getProfile();
    this.detectPlatform();
  }

  private detectPlatform() {
    if (this.platform.is('ios')) this.iosPlatform = true;
  }

  private getPageText() {
    this.text = this.language.getTextByCategories("profile_start");
  }

  private getProfile() {
    this.api.getProfile().subscribe(res => {
      if (res) this.profile = res.content;
    });
  }

  public navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }

  public logout() {
    this.storage.get("auth_type")
      .pipe(
        tap(async (res: string) => {
          if (res === "GOOGLE") await this.api.googleLogout();
          if (res === "FACEBOOK") await this.api.facebookLogout();
        }),
        switchMap(() => this.api.logout().pipe(
          switchMap(() => forkJoin(this.storage.remove("token"), this.storage.remove("profile"), this.storage.remove("auth_type")))
        ))
      )
      .subscribe(() => this.router.navigateByUrl("/login"));
  }
}