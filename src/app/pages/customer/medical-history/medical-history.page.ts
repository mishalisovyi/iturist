import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';

import { ApiService } from 'src/app/services/api.service';
import { LanguageService } from 'src/app/services/language.service';
import { LoadingService } from 'src/app/services/loading.service';

import { MedicalHistory } from 'src/app/models/models';

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
  public submitTry = false;
  public text: any;
  public checkValuesDiseases: Array<boolean>;
  public checkValuesSymptoms: Array<boolean>;
  public diseasesValues: Array<any> = [];
  public symptomsValues: Array<any> = [];

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private language: LanguageService,
    private router: Router,
    private loading: LoadingService
  ) { }

  ngOnInit() {
    this.initForm();
    this.getChoicesAndSetStartHistoryValues();
    this.setcheckValues();
  }

  ngOnDestroy() {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.getPageText();
    this.getMedicalHistory();
  }

  private getChoicesAndSetStartHistoryValues() {
    this.api.getMedicalHistoryChoices()
      .pipe(switchMap(res => {
        this.choices = res;
        return this.api.checkMedicalHistory();
      }))
      .subscribe(res => {
        if (res) {
          this.setMedicalHistoryValues(res.content[res.content.length - 1]);
        }
      });
  }

  private initForm() {
    this.form = this.formBuilder.group({
      taking_medication: [null, Validators.required],
      medication_allergies: ['', Validators.required],
      gender: ['', Validators.required],
      use_tobacco: [null, Validators.required],
      illegal_drugs: [null, Validators.required],
      consume_alcohol: ['', Validators.required]
    });
  }

  private setcheckValues() {
    this.checkValuesDiseases = new Array(8).fill(false);
    this.checkValuesSymptoms = new Array(12).fill(false);
  }

  private getPageText() {
    this.text = this.language.getTextByCategories('medical_history');
  }

  private getMedicalHistory() {
    if (this.choices) {
      this.api.checkMedicalHistory().subscribe(res => {
        if (res) {
          this.setMedicalHistoryValues(res.content[res.content.length - 1]);
        }
      });
    }
  }

  private setMedicalHistoryValues(data: MedicalHistory) {
    this.form.setValue({
      taking_medication: `${data.taking_medication}`,
      medication_allergies: data.medication_allergies,
      gender: data.gender,
      use_tobacco: `${data.use_tobacco}`,
      illegal_drugs: `${data.illegal_drugs}`,
      consume_alcohol: data.consume_alcohol
    });
    this.diseasesValues = data.relative_diseases.map(item => item.title);
    this.symptomsValues = data.current_symptoms.map(item => item.title);
    for (const item of this.diseasesValues) {
      this.checkValuesDiseases[this.choices.relative_diseases.findIndex(it => it[0] === item)] = true;
    }
    for (const item of this.symptomsValues) {
      this.checkValuesSymptoms[this.choices.current_symptoms.findIndex(it => it[0] === item)] = true;
    }
  }

  public manageDiseasesValues(index: number) {
    const value = this.choices.relative_diseases[index][0];

    if (this.diseasesValues.includes(value)) {
      this.checkValuesDiseases[index] = false;
      const i = this.diseasesValues.findIndex(item => item === value);
      this.diseasesValues.splice(i, 1);
    } else {
      if (value !== 'NOT-SET') {
        if (this.diseasesValues.includes('NOT-SET')) {
          this.checkValuesDiseases[0] = false;
          const i = this.diseasesValues.findIndex(item => item === 'NOT-SET');
          this.diseasesValues.splice(i, 1);
        }
        this.checkValuesDiseases[index] = true;
        this.diseasesValues.push(value);
      } else {
        this.diseasesValues = [value];
        this.checkValuesDiseases.fill(false);
        this.checkValuesDiseases[0] = true;
      }
    }
  }

  public manageSymptomsValues(index: number) {
    const value = this.choices.current_symptoms[index][0];
    if (this.symptomsValues.includes(value)) {
      const i = this.symptomsValues.findIndex(item => item === value);
      this.symptomsValues.splice(i, 1);
      this.checkValuesSymptoms[index] = true;
    } else {
      this.symptomsValues.push(value);
      this.checkValuesSymptoms[index] = false;
    }
  }

  public toggleGroup(group) {
    this.shownGroup = this.isGroupShown(group) ? null : group;
  }

  public isGroupShown(group): boolean {
    return this.shownGroup === group;
  }

  public async submit() {
    this.submitTry = true;

    if (this.form.valid && this.diseasesValues.length && this.symptomsValues.length) {
      this.shownGroup = null;
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
