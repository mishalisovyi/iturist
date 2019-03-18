import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { forkJoin } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { ApiService } from '../../../services/api.service';
import { LanguageService } from '../../../services/language.service';
import { StorageService } from "../../../services/storage.service";

@Component({
  selector: 'app-choose-plan',
  templateUrl: './choose-plan.page.html',
  styleUrls: ['./choose-plan.page.scss'],
})
export class ChoosePlanPage implements OnInit {

  private companyId: string;

  public plans: Array<any>;
  public selectedPlanId: string;
  public text: any;
  public hideBage: boolean;
  public planIsSelected: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private language: LanguageService,
    private storage: StorageService
  ) { }

  ngOnInit() {
    this.getCompanyId();
    this.getPlans();
  }

  ionViewWillEnter() {
    this.getPageText();
    this.defineHidingBage();
    this.deselectPlan();
  }

  private defineHidingBage(url: string = this.router.url) {
    this.hideBage = true;

    this.api.getMyPlan().subscribe(res => {
      if (res) this.hideBage = false;
    });
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

  private deselectPlan() {
    this.selectedPlanId = null;
    this.planIsSelected = false;
  }

  public navigateTo(to: string) {
    this.router.navigateByUrl(`/${to}`);
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

  public logout() {
    this.storage.get("auth_type")
      .pipe(
        tap(async (res: string) => {
          if (res === "GOOGLE") await this.api.googleLogout();
          if (res === "FACEBOOK") await this.api.facebookLogout();
        }),
        switchMap(() => this.api.logout().pipe(
          switchMap(() => forkJoin(this.storage.remove("token"), this.storage.remove("profile"), this.storage.remove("auth_type"), this.storage.remove('phone')))
        ))
      )
      .subscribe(() => this.navigateTo('login'));
  }
}