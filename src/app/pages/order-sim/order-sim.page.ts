import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-order-sim',
  templateUrl: './order-sim.page.html',
  styleUrls: ['./order-sim.page.scss'],
})
export class OrderSimPage implements OnInit {

  public form: FormGroup;
  public submitTry: boolean = false;

  constructor(private alert: AlertController, private formBuilder: FormBuilder, private router: Router, private api: ApiService) { }

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      address: ["", Validators.required],
      company: ["", Validators.required]
    });
  }

  private async presentAlert() {
    const alert = await this.alert.create({
      message: `
        <p>Your request is accepted</p>
        <p>Delivering is within a few hours</p>
        <p>Check "My request" page</p>
      `,
      buttons: ['ok']
    });
    alert.onDidDismiss().then(() => {
      this.api.isOrderedSimCard = true;
      this.router.navigateByUrl('/choose-company');
    });
    await alert.present();
  }

  public orderSim() {
    this.submitTry = true;
    if (this.form.valid) {
      this.api.orderSim(this.form.value).subscribe(() => this.presentAlert());
    }
  }
}