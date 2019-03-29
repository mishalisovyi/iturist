import { Component } from '@angular/core';

import { map, finalize } from "rxjs/operators";
import * as moment from "moment";

import { LanguageService } from "../../../services/language.service";
import { ApiService } from "../../../services/api.service";

import { History, BaseResponse } from "../../../models/models";

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.page.html',
  styleUrls: ['./my-requests.page.scss'],
})
export class MyRequestsPage {

  public text: any;
  public requests: Array<History> = [];
  public requestsAreLoaded: boolean = false;

  constructor(private language: LanguageService, private api: ApiService) { }


  ionViewWillEnter() {
    this.getPageText();
    this.getRequests();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories("my_requests");
  }

  private getRequests() {
    this.api.getHistory()
      .pipe(
        map((res: BaseResponse) => {
          res.content.forEach((item: History) => item.created = moment.utc(item.created.replace("UTC:00", "")));
          return res.content;
        }),
        finalize(() => this.requestsAreLoaded = true)
      )
      .subscribe(
        (res: History[]) => this.requests = res,
        () => this.requests = []
      );
  }
}