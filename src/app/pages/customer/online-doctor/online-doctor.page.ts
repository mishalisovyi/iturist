import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../../../services/api.service';

import { BaseResponse } from '../../../models/models';

@Component({
  selector: 'app-online-doctor',
  templateUrl: './online-doctor.page.html',
  styleUrls: ['./online-doctor.page.scss'],
})
export class OnlineDoctorPage implements OnInit {

  constructor(private router: Router, private api: ApiService) { }

  public callDoctor() {
    this.api.checkCallPossibility().subscribe((res: BaseResponse) => {
      if (res.content.possible) {
        this.router.navigate(['/client-call-room'], { queryParams: { id: res.content.id, token: res.content.token, key: res.content.key } });
      } else {
        alert("You can not perform call, because you don't have enough credits");
      }
    })
  }

  ngOnInit() { }
}