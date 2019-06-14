import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-unboarding-tour',
  templateUrl: './unboarding-tour.page.html',
  styleUrls: ['./unboarding-tour.page.scss'],
})
export class UnboardingTourPage {

  public options: any;

  constructor(private router: Router) {
    this.options = {
      autoplay: {
        delay: 5000
      }
    }
  }

  public navigateToLogin() {
    this.router.navigate(['/main']);
  }

  public slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay()
  }
}