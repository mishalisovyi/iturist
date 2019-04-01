import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../../../services/api.service';
import { LanguageService } from "../../../services/language.service";

import { BaseResponse } from "../../../models/models";

@Component({
  selector: 'app-choose-company',
  templateUrl: './choose-company.page.html',
  styleUrls: ['./choose-company.page.scss'],
})
export class ChooseCompanyPage {

  public companyIsSelected: boolean = false;
  public selectedCompanyId: number;
  public text: any;

  constructor(
    private router: Router,
    private api: ApiService,
    private language: LanguageService
  ) { }

  ionViewWillEnter() {
    this.api.getCompanies().subscribe((res: BaseResponse) => console.log(res));
    this.getPageText();
    this.deselectCompany();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories("choose_company");
  }

  private deselectCompany() {
    this.selectedCompanyId = null;
    this.companyIsSelected = false;
  }

  public selectCompany(id: number) {
    this.selectedCompanyId = id;
    this.companyIsSelected = true;
  }

  // public navigateToOrderSimPage() {
  //   this.router.navigateByUrl('/order-sim-start');
  // }

  public navigateToChoosePlanPage() {
    if (this.companyIsSelected) {
      this.router.navigateByUrl(`/choose-plan/${this.selectedCompanyId}`);
    }
  }
}