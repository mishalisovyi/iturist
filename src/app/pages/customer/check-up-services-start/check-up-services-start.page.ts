import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-check-up-services-start',
  templateUrl: './check-up-services-start.page.html',
  styleUrls: ['./check-up-services-start.page.scss'],
})
export class CheckUpServicesStartPage {

  public text: any;

  constructor(private router: Router, private language: LanguageService) { }

  ionViewWillEnter() {
    this.getPageText();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('check_up_start');
  }

  public navigateTo(path: string) {
    this.router.navigateByUrl(`/${path}`);
  }
}
