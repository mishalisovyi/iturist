import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiService } from '../../../services/api.service';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-choose-plan',
  templateUrl: './choose-plan.page.html',
  styleUrls: ['./choose-plan.page.scss'],
})
export class ChoosePlanPage implements OnInit {

  private companyId: string;
  private planIsSelected: boolean = false;

  public plans: Array<any>;
  public selectedPlanId: string;
  public text: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private language: LanguageService
  ) { }

  ngOnInit() {
    this.getCompanyId();
    this.getPlans();
  }

  ionViewWillEnter() {
    this.getPageText();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories("choose_plan");
  }

  private getCompanyId() {
    this.companyId = this.route.snapshot.params.companyId;
  }

  private getPlans() {
    this.api.getPlans(this.companyId).subscribe(res => this.plans = res.content);
  }

  public selectPlan(id: string) {
    this.selectedPlanId = id;
    this.planIsSelected = true;
  }

  public navigateToConfirmPlan() {
    if (this.planIsSelected) {
      this.router.navigateByUrl(`/confirm-plan/${this.selectedPlanId}`);
    }
  }
}