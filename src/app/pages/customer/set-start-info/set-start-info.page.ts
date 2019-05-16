import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormControl } from "@angular/forms";

import { AlertController } from '@ionic/angular';

import { forkJoin, Subscription } from 'rxjs';
import { tap, switchMap, finalize } from 'rxjs/operators';

import { LanguageService } from '../../../services/language.service';
import { StorageService } from '../../../services/storage.service';
import { ApiService } from '../../../services/api.service';
import { ActionSheetService } from '../../../services/action-sheet.service';
import { LoadingService } from '../../../services/loading.service';

import { ProfileEditRequest } from 'src/app/models/models';

@Component({
  selector: 'app-set-start-info',
  templateUrl: './set-start-info.page.html',
  styleUrls: ['./set-start-info.page.scss'],
})
export class SetStartInfoPage implements OnInit, OnDestroy {

  private userId: number;
  private subscription: Subscription;

  public text: any;
  public phoneControl: FormControl;
  public languageControl: FormControl;
  public submitTry: boolean;

  constructor(
    private language: LanguageService,
    private route: ActivatedRoute,
    private storage: StorageService,
    private api: ApiService,
    private router: Router,
    private action: ActionSheetService,
    private loading: LoadingService,
    private alert: AlertController
  ) { }

  ngOnInit() {
    this.initInputs();

    this.subscription = this.action.actionSheetDismissLanguage$.subscribe(
      (res: { label: string, value: string }) => this.languageControl.setValue(res.label.toLowerCase())
    );
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.getPageText();
    this.getUserId();
  }

  private getPageText() {
    this.text = this.language.getTextByCategories("set_start_info");
  }

  private getUserId() {
    this.userId = parseInt(this.route.snapshot.params.userId);
  }

  private initInputs() {
    this.phoneControl = new FormControl("", Validators.required);
    this.languageControl = new FormControl("", Validators.required);
  }

  public logout() {
    this.storage.get("auth_type")
      .pipe(
        tap(async (res: string) => {
          if (res === "GOOGLE") await this.api.googleLogout();
          if (res === "FACEBOOK") await this.api.facebookLogout();
        }),
        switchMap(() => this.api.logout().pipe(
          switchMap(() => forkJoin(this.storage.remove("token"), this.storage.remove("profile"), this.storage.remove("auth_type")))
        ))
      )
      .subscribe(() => this.router.navigate(['login']));
  }

  public validatePhone() {
    const value = this.phoneControl.value;
    if (this.phoneControl.hasError('required')) return;

    this.phoneControl.setErrors(null);
    if (value.includes('+972') && value.length < 14) this.phoneControl.setErrors({ minlength: true });
    if (!value.includes('+972') && value.length < 9) this.phoneControl.setErrors({ minlength: true });
  }

  public async presentActionSheet() {
    await this.action.createLanguageActionSheet();
  }

  public requireValidator(): boolean {
    return this.phoneControl.hasError('required') || this.languageControl.hasError('required');
  }

  public async submit() {
    this.submitTry = true;

    if (this.phoneControl.valid && this.languageControl.valid) {
      await this.loading.createLoading(this.text.save);

      let phone: string = this.phoneControl.value;
      if (!phone.includes('+972 ')) phone = '+972 '.concat(phone);
      phone = phone.replace('+972 ', '972');

      const profile: ProfileEditRequest = {
        language: this.action.language,
        phone
      }   
      this.storage.set("language", this.action.language)
      .pipe(
        finalize(async () => await this.loading.dismissLoading()),
        switchMap(() => this.api.editProfile(this.userId, profile))
      )
      .subscribe(
        () => this.router.navigate(['main']),
        async () => {
          const message: string = this.text.unknown_error;
          const alert = await this.alert.create({
            message,
            buttons: [this.text.ok]
          });
          await alert.present();
        }
      )        
    }
  }
}