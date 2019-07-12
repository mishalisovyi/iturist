import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-weather-start',
  templateUrl: './weather-start.page.html',
  styleUrls: ['./weather-start.page.scss'],
})
export class WeatherStartPage implements OnInit {

  public text: any;

  constructor(private language: LanguageService, private router: Router) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.getPageText();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('weather_start');
  }

  public navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }
}
