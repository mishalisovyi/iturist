import { Component } from '@angular/core';

import { ApiService } from 'src/app/services/api.service';
import { LanguageService } from 'src/app/services/language.service';

import { BaseResponse } from 'src/app/models/models';

@Component({
  selector: 'app-online-doctor-calls-list',
  templateUrl: './online-doctor-calls-list.page.html',
  styleUrls: ['./online-doctor-calls-list.page.scss'],
})
export class OnlineDoctorCallsListPage {

  public text: any;
  public calls: Array<any>;

  constructor(private language: LanguageService, private api: ApiService) { }

  ionViewWillEnter() {
    this.getPageText();
    this.getCalls();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories();
  }

  private getCalls() {
    this.api.getCalls().subscribe((res: BaseResponse) => this.calls = res.content);
  }
}
