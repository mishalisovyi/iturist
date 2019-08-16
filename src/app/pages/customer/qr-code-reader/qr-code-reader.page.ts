import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Platform, AlertController } from '@ionic/angular';
// import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { Subscription } from 'rxjs';

import { LanguageService } from 'src/app/services/language.service';
import { StorageService } from 'src/app/services/storage.service';
import { ApiService } from 'src/app/services/api.service';

import { Profile, ProfileEditRequest } from 'src/app/models/models';

@Component({
  selector: 'app-qr-code-reader',
  templateUrl: './qr-code-reader.page.html',
  styleUrls: ['./qr-code-reader.page.scss'],
})
export class QrCodeReaderPage implements OnInit {

  private languageSubscription: Subscription;
  private scanSubscription: Subscription;
  private profile: Profile;
  private platform: string;
  private phone: string;

  public text: any;

  constructor(
    private language: LanguageService,
    private storage: StorageService,
    // private qrScanner: QRScanner,
    private androidPermissions: AndroidPermissions,
    private ionicPlatform: Platform,
    private api: ApiService,
    private alert: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.getPlatform();
  }

  ionViewWillEnter() {
    this.getProfile();

    if (!this.language.language) {
      this.storage.get('language').subscribe((res: string) => this.language.loadLanguage(res ? res : 'En'));
      this.languageSubscription = this.language.languageIsLoaded$.subscribe(() => this.getPageText());
    } else {
      this.getPageText();
    }
  }

  ionViewWillLeave() {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
    if (this.scanSubscription) {
      this.scanSubscription.unsubscribe();
    }

    // this.qrScanner.hide();
    // this.qrScanner.destroy();
    window.document.querySelector('ion-app').classList.remove('cameraView');
  }

  private getProfile() {
    this.api.getProfile().subscribe(res => {
      if (res) {
        this.profile = res.content;
      }
    });
  }

  private getPlatform() {
    this.platform = this.ionicPlatform.is('android') ? 'android' : 'ios';
  }

  private getPageText() {
    this.text = this.language.getTextByCategories();
  }

  private async requestCameraPermission() {
    const { hasPermission } = await this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA);
    if (hasPermission) {
      // this.scanQrCode();
    }
  }

  private getPhone(phone: string) {
    if (phone.startsWith('972') && phone.length > 9) {
      this.phone = phone;
      return;
    }
    if (phone.startsWith('+972')) {
      this.phone = phone.replace('+972', '972');
      return;
    }
    this.phone = `972${phone}`;
  }

  // public async scanQrCode() {
  //   const { hasPermission } = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA);

  //   if (this.platform === 'ios' || (this.platform === 'android' && hasPermission)) {
  //     this.qrScanner.prepare()
  //       .then((status: QRScannerStatus) => {
  //         if (status.authorized) {
  //           this.qrScanner.show();
  //           window.document.querySelector('ion-app').classList.add('cameraView');

  //           this.scanSubscription = this.qrScanner.scan().subscribe(async (text: string) => {
  //             this.getPhone(text);

  //             this.scanSubscription.unsubscribe();
  //             this.qrScanner.hide();
  //             this.qrScanner.destroy();
  //             window.document.querySelector('ion-app').classList.remove('cameraView');

  //             const profilePhone: ProfileEditRequest = { phone: this.phone };
  //             // const profilePhone: ProfileEditRequest = { sim_number: this.phone };
  //             this.api.editProfile(this.profile.user_id, profilePhone);

  //             const alert = await this.alert.create({
  //               message: `Your mobile phone number: +${this.phone}`,
  //               buttons: [this.text.ok]
  //             });

  //             await alert.present();
  //             alert.onDidDismiss().then(() => this.navigateTo('main'));
  //           });
  //         } else if (status.denied) {
  //           console.log('status denied');
  //           // camera permission was permanently denied
  //           // you must use QRScanner.openSettings() method to guide the user to the settings page
  //           // then they can grant the permission from there
  //         } else {
  //           console.log('permissions denied');
  //           // permission was denied, but not permanently. You can ask for permission again at a later time.
  //         }
  //       })
  //       .catch((e: any) => console.log('Error is', e));

  //     return;
  //   }

  //   this.requestCameraPermission();
  // }

  public navigateTo(path: string) {
    this.router.navigateByUrl(`/${path}`);
  }
}
