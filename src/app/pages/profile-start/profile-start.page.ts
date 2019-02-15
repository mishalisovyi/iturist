import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    this.api.getProfile().subscribe(res => {
      if (res) this.profile = res.content;
    });
  }

  public navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }

  public logout() {
    this.api.logout()
      .pipe(switchMap(() => this.storage.remove("token")))
      .subscribe(() => this.navigateTo("/login"));
  }
}