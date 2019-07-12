import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-order-sim-start',
  templateUrl: './order-sim-start.page.html',
  styleUrls: ['./order-sim-start.page.scss'],
})
export class OrderSimStartPage {

  public text: any;

  constructor(private router: Router, private language: LanguageService) { }

  ionViewWillEnter() {
    this.getPageText();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('order_sim_start');
  }

  public navigateTo(path: string) {
    this.router.navigateByUrl(`/${path}`);
  }
}
