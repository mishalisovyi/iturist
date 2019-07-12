import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-sim-card-choose',
  templateUrl: './sim-card-choose.page.html',
  styleUrls: ['./sim-card-choose.page.scss'],
})
export class SimCardChoosePage {

  public text: any;

  constructor(private language: LanguageService, private router: Router) { }

  ionViewWillEnter() {
    this.getPageText();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('sim_card_choose');
  }

  public navigate(route: string) {
    this.router.navigateByUrl(`/${route}`);
  }
}
