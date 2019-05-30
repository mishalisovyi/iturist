import { Component } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import { LanguageService } from "src/app/services/language.service";
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
})
export class WeatherPage {

  private latitude: number;
  private longitude: number;

  public text: any;

  constructor(private language: LanguageService, private geolocation: Geolocation, private api: ApiService) { }

  ionViewWillEnter() {
    this.getPageText();
    this.getWeather();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('');
  }

  private async getWeather() {
    await this.getGeolocation();

    // this.api.getWeather(this.latitude, this.longitude).subscribe(res => console.log(res));
  }

  private async getGeolocation() {
    const { coords: { latitude, longitude } } = await this.geolocation.getCurrentPosition();
    this.latitude = latitude;
    this.longitude = longitude;

    console.log('lat ', this.latitude);
    console.log('long ', this.longitude);
  }
}