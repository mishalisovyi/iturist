import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { ApiService } from '../../../services/api.service';
import { LanguageService } from "../../../services/language.service";
import { LoadingService } from '../../../services/loading.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-medical-history',
  templateUrl: './medical-history.page.html',
  styleUrls: ['./medical-history.page.scss'],
})
export class MedicalHistoryPage implements OnInit, OnDestroy {

  private shownGroup: string;
  private languageSubscription: Subscription;

  public choices: any;
  public form: FormGroup;
  public submitTry: boolean = false;
  public text: any;
  public checkValues: Array<boolean>;
  public diseasesValues: Array<any> = [];
  public symptomsValues: Array<any> = [];

  constructor(private api: ApiService, private formBuilder: FormBuilder, private language: LanguageService, private router: Router, private loading: LoadingService) { }

  ngOnInit() {
    this.initForm();
    this.getChoices();
    this.setCheckValues();
  }

  ngOnDestroy() {
    if (this.languageSubscription) this.languageSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.getPageText();
  }

  private getChoices() {
    this.api.getMedicalHistoryChoices().subscribe(res => this.choices = res);
  }

  private initForm() {
    this.form = this.formBuilder.group({
      taking_medication: [null, Validators.required],
      medication_allergies: ["", Validators.required],
      gender: ["", Validators.required],
      use_tobacco: [null, Validators.required],
      illegal_drugs: [null, Validators.required],
      consume_alcohol: ["", Validators.required]
    });
  }

  private setCheckValues() {
    this.checkValues = new Array(8).fill(false);
  }

  private getPageText() {
    this.text = this.language.getTextByCategories("medical_history");
  }

  public manageDiseasesValues(index: number) {
    const value = this.choices.relative_diseases[index][0];

    if (this.diseasesValues.includes(value)) {
      this.checkValues[index] = false;
      const i = this.diseasesValues.findIndex(item => item === value);
      this.diseasesValues.splice(i, 1);
    } else {
      if (value !== 'NOT-SET') {
        if (this.diseasesValues.includes('NOT-SET')) {
          this.checkValues[0] = false;
          const i = this.diseasesValues.findIndex(item => item === 'NOT-SET');
          this.diseasesValues.splice(i, 1);
        }
        this.checkValues[index] = true;
        this.diseasesValues.push(value);
      } else {
        this.diseasesValues = [value];
        this.checkValues.fill(false);
        this.checkValues[0] = true;
      }
    }
  }

  public manageSymptomsValues(index: number) {
    const value = this.choices.current_symptoms[index][0];
    if (this.symptomsValues.includes(value)) {
      const i = this.symptomsValues.findIndex(item => item === value);
      this.symptomsValues.splice(i, 1);
    } else {
      this.symptomsValues.push(value);
    }
  }

  public toggleGroup(group) {
    this.shownGroup = this.isGroupShown(group) ? null : group
  };

  public isGroupShown(group): boolean {
    return this.shownGroup === group;
  };

  public async submit() {
    this.submitTry = true;

    if (this.form.valid && this.diseasesValues.length && this.symptomsValues.length) {
      await this.loading.createLoading(this.text ? this.text.wait_please : 'Wait, please');

      this.api.submitMedicalHistory({
        taking_medication: this.form.value.taking_medication === 'true',
        medication_allergies: this.form.value.medication_allergies,
        gender: this.form.value.gender,
        use_tobacco: this.form.value.use_tobacco === 'true',
        illegal_drugs: this.form.value.illegal_drugs === 'true',
        consume_alcohol: this.form.value.consume_alcohol,
        relative_diseases: this.diseasesValues.map(item => ({ title: item })),
        current_symptoms: this.symptomsValues.map(item => ({ title: item }))
      })
        .pipe(finalize(async () => await this.loading.dismissLoading()))
        .subscribe(() => this.router.navigateByUrl('/online-doctor-choose'));
    } else {
      this.shownGroup = null;
    }
  }
}