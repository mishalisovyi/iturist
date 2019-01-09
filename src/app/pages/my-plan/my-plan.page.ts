import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-my-plan',
  templateUrl: './my-plan.page.html',
  styleUrls: ['./my-plan.page.scss'],
})
export class MyPlanPage implements OnInit {

  public plan: any;

  private companyId: number;

  constructor(private router: Router, private api: ApiService) { }

  ngOnInit() {
    this.getMyPlan();
    this.getMyCompanyId();
  }

  private getMyPlan() {
    this.api.getMyPlan().subscribe(res => this.plan = res);
  }

  private getMyCompanyId() {
    this.api.getMyCompanyId().subscribe(id => this.companyId = id);
  }

  public navigateToChoosePlan() {
    this.router.navigateByUrl(`/choose-plan/${this.companyId}`);
  }
}