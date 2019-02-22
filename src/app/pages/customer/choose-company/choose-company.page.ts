import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../../../services/api.service';

import { BaseResponse } from "../../../models/models";

@Component({
  selector: 'app-choose-company',
  templateUrl: './choose-company.page.html',
  styleUrls: ['./choose-company.page.scss'],
})
export class ChooseCompanyPage {

  public isOrderedSimCard: boolean;
  public companyIsSelected: boolean = false;
  public selectedCompanyId: number;

  constructor(private router: Router, private api: ApiService) { }

  ionViewWillEnter() {
    this.api.getCompanies().subscribe((res: BaseResponse) => console.log(res));
  }

  public selectCompany(id: number) {
    this.selectedCompanyId = id;
    this.companyIsSelected = true;
  }

  public navigateToOrderSimPage() {
    this.router.navigateByUrl('/order-sim');
  }

  public navigateToChoosePlanPage() {
    if (this.companyIsSelected) {
      this.router.navigateByUrl(`/choose-plan/${this.selectedCompanyId}`);
    }
  }
}