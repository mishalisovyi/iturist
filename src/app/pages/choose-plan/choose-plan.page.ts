import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-choose-plan',
  templateUrl: './choose-plan.page.html',
  styleUrls: ['./choose-plan.page.scss'],
})
export class ChoosePlanPage implements OnInit {

  private companyId: string;

  public plans: Array<any>;
  public selectedPlanId: string;

  constructor(private route: ActivatedRoute, private api: ApiService) { }

  ngOnInit() {
    this.getCompanyId();
    this.getPlans();
  }

  private getCompanyId() {
    this.companyId = this.route.snapshot.params.id;
  }

  private getPlans() {
    this.api.getPlans(this.companyId).subscribe(res => this.plans = res);
  }

  public selectPlan(id: string) {
    this.selectedPlanId = id;
  }
}