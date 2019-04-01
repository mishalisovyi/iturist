import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { AlertController } from '@ionic/angular';

import { finalize } from 'rxjs/operators';

import { LanguageService } from "../../../services/language.service";
import { ActionSheetService } from "../../../services/action-sheet.service";
import { ApiService } from '../../../services/api.service';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-order-sim-form',
  templateUrl: './order-sim-form.page.html',
  styleUrls: ['./order-sim-form.page.scss'],
})
export class OrderSimFormPage implements OnInit {

  public text: any;
  public form: FormGroup;
  public submitTry: boolean;

  constructor(
    private router: Router,
    private language: LanguageService,
    private formBuilder: FormBuilder,
    private action: ActionSheetService,
    private api: ApiService,
    private loading: LoadingService,
    private alert: AlertController
  ) { }

  ngOnInit() {
    this.createForm();
    this.action.actionSheetDismissCompany$.subscribe((res: { label: string, value: number }) => this.form.get("company").setValue(res.label));
  }

  ionViewWillEnter() {
    this.getPageText();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      name: ["", [Validators.required, Validators.pattern("^[\\S][a-zA-Z\\s-]*$")]],
      email: ["", [Validators.required, Validators.email]],
      address: ["", Validators.required],
      city: ["", [Validators.required]],
      phone_number: ["", [Validators.required, Validators.pattern('^\\+?[\\d]+$')]],
      company: ["", Validators.required]
    });
  }

  private getPageText() {
    this.text = this.language.getTextByCategories("order_sim_form");
  }

  private navigate(path: string) {
    this.router.navigateByUrl(`/${path}`);
  }

  private createAlert(error: boolean = false) {
    let confirmText: string;
    this.api.getToken().subscribe(async (res: string) => {
      confirmText = res ? this.text.request_accepted : this.text.request_accepted_without_token;
      const alert = await this.alert.create({
        message: error ? this.text.unknown_error : confirmText,
        buttons: [this.text.ok]
      });
      await alert.present();
      alert.onDidDismiss().then(() => {
        if (!error) this.navigate('main');
      });
    });
  }

  public async presentActionSheet() {
    this.action.createCompanyActionSheet();
  }

  public navigateTo(path: string) {
    this.router.navigateByUrl(`/${path}`);
  }

  public async orderSim() {
    this.submitTry = true;

    if (this.form.valid) {
      await this.loading.createLoading(this.text.creating_order);
      this.api.orderSimCard({
        name: this.form.get('name').value,
        email: this.form.get('email').value,
        address: this.form.get('address').value,
        city: this.form.get('city').value,
        phone_number: this.form.get('phone_number').value,
        company: this.action.company,
        type: 'SIM-REQUEST-DELIVERY'
      })
        .pipe(finalize(async () => await this.loading.dismissLoading()))
        .subscribe(
          () => this.createAlert(),
          () => this.createAlert(true)
        )
    }
  }
}