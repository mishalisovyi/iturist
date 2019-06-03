import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import * as _ from 'lodash';
import * as moment from 'moment';

import { LanguageService } from "src/app/services/language.service";
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
})
export class WeatherPage implements OnInit, AfterViewInit {

  private latitude: number;
  private longitude: number;
  private firstLoad: boolean = false;

  public text: any;
  public weatherIsLoaded: boolean = false;
  public selectCityControl: FormControl;
  public currentDate: Date;
  public currentTemperatue: number;
  public currentIconPath: string;
  public selectedCityKey: string = 'default';
  public threeHourForecast: Array<any>;
  public dailyForecast: Array<any>;
  public cityCoordsMap = [
    {
      key: 'jerusalem',
      lat: 31.76904,
      lon: 35.21633,
      label: 'Jerusalem',
      code: 'IL'
    },
    {
      key: 'telaviv',
      lat: 32.08088,
      lon: 34.78057,
      label: 'Tel Aviv',
      code: 'IL'
    },
    {
      key: 'haifa',
      lat: 32.81841,
      lon: 34.9885,
      label: 'Haifa',
      code: 'IL'
    },
    {
      key: 'rishon',
      lat: 31.97102,
      lon: 34.78939,
      label: 'Rishon LeZion',
      code: 'IL'
    },
    {
      key: 'petah',
      lat: 32.08707,
      lon: 34.88747,
      label: 'Petah Tikva',
      code: 'IL'
    }
  ]

  constructor(private language: LanguageService, private geolocation: Geolocation, private api: ApiService) { }

  ngOnInit() {
    this.createControl();
  }

  ngAfterViewInit() {
    this.selectCityControl.valueChanges.subscribe(res => {
      const index = this.cityCoordsMap.findIndex(({ key }) => key === res);
      this.latitude = this.cityCoordsMap[index].lat;
      this.longitude = this.cityCoordsMap[index].lon;
      this.selectedCityKey = this.cityCoordsMap[index].key;
      this.getCurrentWeather();
      this.getWeatherForecast();
    })
  }

  ionViewWillEnter() {
    this.getPageText();
    this.getLocationAndWeather();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('');
  }

  private getDate() {
    this.currentDate = new Date();
  }

  private createControl() {
    this.selectCityControl = new FormControl('default');
  }

  private async getLocationAndWeather() {
    await this.getGeolocation();
    this.getCurrentWeather();
    this.getWeatherForecast();
    this.getDate();
  }

  private async getGeolocation() {
    const { coords: { latitude, longitude } } = await this.geolocation.getCurrentPosition();
    this.latitude = latitude;
    this.longitude = longitude;
  }

  private getWeatherIcon(code: string, color: string) {
    return {
      '2': `thunder-${color}.svg`,
      '3': `rain-${color}.svg`,
      '5': `rain-${color}.svg`,
      '6': `rain-${color}.svg`,
      '7': `clouds-${color}.svg`,
      '800': `sun-${color}.svg`,
      '801': `half-sun-${color}.svg`,
      '802': `half-sun-${color}.svg`,
      '803': `clouds-${color}.svg`,
      '804': `clouds-${color}.svg`,
    }[code];
  }

  private getCurrentWeather() {
    this.api.getCurrentWeather(this.latitude, this.longitude).subscribe((res: any) => {
      this.currentTemperatue = this.kelvinToCelsius(res.main.temp);
      const index = this.getIndexForWeatherIconsMap(res.weather[0].id);
      this.currentIconPath = `assets/screens/${this.getWeatherIcon(index, 'red')}`;
      if (!this.firstLoad) {
        this.cityCoordsMap.push({
          key: 'default',
          lat: res.coord.lat,
          lon: res.coord.lon,
          label: res.name,
          code: res.sys.country
        });
        this.firstLoad = true;
      }
      this.weatherIsLoaded = true;
    });
  }

  private getWeatherForecast() {
    this.api.getWeatherForecast(this.latitude, this.longitude).subscribe(({ list }: any) => {
      this.threeHourForecast = this.getThreeHourForecast(list);
      this.dailyForecast = this.getDailyForecast(list);
    });
  }

  private kelvinToCelsius(K: number) {
    return Math.round(K - 273.15);
  }

  private getIndexForWeatherIconsMap(code: number) {
    const stringCode = code.toString();
    if (stringCode.startsWith('8')) return stringCode;
    return stringCode.charAt(0);
  }

  private getThreeHourForecast(forecastList) {
    const threeHourElements = forecastList.slice(0, 6);
    return threeHourElements.map(({ weather: { 0: { id } }, dt_txt }) => {
      const index = this.getIndexForWeatherIconsMap(id);
      return {
        icon: `assets/screens/${this.getWeatherIcon(index, 'blue')}`,
        time: moment(dt_txt).format('ha')
      }
    })
  }

  private getDailyForecast(forecastList) {
    const grouped = _.groupBy(forecastList, ({ dt_txt }) => moment(dt_txt).format('dddd'));
    const dailyValues = [];
    for (let key in grouped) {
      const { weather: { 0: { id } } } = grouped[key].reduce((prev, current) => (prev.main.temp > current.main.temp) ? prev : current);
      const index = this.getIndexForWeatherIconsMap(id);
      dailyValues.push({
        icon: `assets/screens/${this.getWeatherIcon(index, 'blue')}`,
        day: key.slice(0, 3)
      })
    }
    return dailyValues;
  }
}