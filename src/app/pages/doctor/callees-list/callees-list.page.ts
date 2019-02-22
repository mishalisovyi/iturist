import { Component, OnInit } from '@angular/core';

import { ApiService } from "../../../services/api.service";

import { BaseResponse } from "../../../models/models";

@Component({
  selector: 'app-callees-list',
  templateUrl: './callees-list.page.html',
  styleUrls: ['./callees-list.page.scss'],
})
export class CalleesListPage implements OnInit {

  public callees: any;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getCallees().subscribe((res: BaseResponse) => this.callees = res.content);
  }

}
