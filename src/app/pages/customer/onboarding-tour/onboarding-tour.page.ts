import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-onboarding-tour',
  templateUrl: './onboarding-tour.page.html',
  styleUrls: ['./onboarding-tour.page.scss'],
})
export class OnboardingTourPage {

  public options: any;

  constructor(private router: Router) {
    this.options = {
      autoplay: {
        delay: 5000
      }
    };
  }

  public navigateToLogin() {
    this.router.navigate(['/main']);
  }

  public slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }
}
