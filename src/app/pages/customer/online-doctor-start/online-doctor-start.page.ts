import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LanguageService } from "../../../services/language.service";

@Component({
  selector: 'app-online-doctor-start',
  templateUrl: './online-doctor-start.page.html',
  styleUrls: ['./online-doctor-start.page.scss'],
})
export class OnlineDoctorStartPage {

  public text: any;

  constructor(private language: LanguageService, private router: Router) { }

  ionViewWillEnter() {
    this.getPageText();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('online_doctor_start');
  }

  public navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }
}