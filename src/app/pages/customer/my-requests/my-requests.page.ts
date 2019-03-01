import { Component, OnInit } from '@angular/core';

import { map } from "rxjs/operators";
import * as moment from "moment";

import { LanguageService } from "../../../services/language.service";
import { ApiService } from "../../../services/api.service";

import { History, BaseResponse } from "../../../models/models";

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.page.html',
  styleUrls: ['./my-requests.page.scss'],
})
export class MyRequestsPage implements OnInit {

  public text: any;
  public requests: Array<History>;

  constructor(private language: LanguageService, private api: ApiService) { }

  ngOnInit() {
    this.getRequests();
  }

  ionViewWillEnter() {
    this.getPageText();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories("my_requests");
  }

  private getRequests() {
    this.api.getHistory()
      .pipe(
        map((res: BaseResponse) => {
          res.content.forEach((item: History) => item.created = moment(item.created.replace("UTC:00", "")));
          return res.content;
        })
      )
      .subscribe((res: History[]) => this.requests = res);
  }
}