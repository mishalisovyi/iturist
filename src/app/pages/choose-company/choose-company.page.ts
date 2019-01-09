import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-choose-company',
  templateUrl: './choose-company.page.html',
  styleUrls: ['./choose-company.page.scss'],
})
export class ChooseCompanyPage implements OnInit, OnDestroy {

  private subscription: Subscription;

  public isOrderedSimCard: boolean;
  public companyIsSelected: boolean = false;
  public selectedCompanyId: number;

  constructor(private router: Router, private api: ApiService) { }

  async ngOnInit() {
    await this.getIsOrderedSimCard();

    this.subscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd && event.url === '/choose-company')
      )
      .subscribe((e) => {
        this.getIsOrderedSimCard();
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private getIsOrderedSimCard() {
    this.isOrderedSimCard = this.api.isOrderedSimCard;
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