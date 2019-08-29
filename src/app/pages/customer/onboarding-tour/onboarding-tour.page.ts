import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IonSlides, Platform } from '@ionic/angular';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-onboarding-tour',
  templateUrl: './onboarding-tour.page.html',
  styleUrls: ['./onboarding-tour.page.scss'],
})
export class OnboardingTourPage {

  public options: any;

  private backBtnSubscription: Subscription;

  constructor(private router: Router, private platform: Platform) {
    this.options = {
      autoplay: {
        delay: 5000
      }
    };
  }

  ionViewWillEnter() {
    this.backBtnSubscription = this.platform.backButton.subscribe(() => navigator['app'].exitApp());
  }

  ionViewWillLeave() {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }
  }

  public navigateToLogin() {
    this.router.navigate(['/main']);
  }

  public slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }
}
