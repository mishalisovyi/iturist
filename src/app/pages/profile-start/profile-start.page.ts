import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { StorageService } from '../../services/storage.service';
import { ApiService } from '../../services/api.service';

import { Profile } from '../../models/models';

@Component({
  selector: 'app-profile-start',
  templateUrl: './profile-start.page.html',
  styleUrls: ['./profile-start.page.scss'],
})
export class ProfileStartPage implements OnInit {

  public profile: Profile;

  constructor(private router: Router, private storage: StorageService, private api: ApiService) { }

  ngOnInit() {
    this.getProfile();
  }

  private getProfile() {
    this.storage.get("profile").subscribe((profile: Profile) => this.profile = profile);
  }

  public navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }

  public logout() {
    this.api.logout()
      .pipe(switchMap(() => forkJoin(this.storage.remove("authorization"), this.storage.remove("profile"))))
      .subscribe(() => this.navigateTo("/profile"));
  }
}