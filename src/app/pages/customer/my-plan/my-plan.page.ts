import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';

import { ApiService } from 'src/app/services/api.service';
import { LanguageService } from 'src/app/services/language.service';

import { Plan, BaseResponse } from 'src/app/models/models';

@Component({
  selector: 'app-my-plan',
  templateUrl: './my-plan.page.html',
  styleUrls: ['./my-plan.page.scss'],
})
export class MyPlanPage {

  public plan: Plan;
  public text: any;

  constructor(
    private router: Router,
    private api: ApiService,
    private language: LanguageService
  ) { }

  ionViewWillEnter() {
    this.getPageText();
    this.getMyPlan();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('my_plan');
  }

  private getMyPlan() {
    this.api.getMyPlan().pipe(map((res: BaseResponse) => res.content)).subscribe((res: Array<Plan>) => this.plan = res[0]);
  }

  public navigateToChoosePlan() {
    this.router.navigateByUrl(`/choose-plan/${this.plan.package.company_id}`);
  }
}
