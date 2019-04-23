import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-up-disclaimer',
  templateUrl: './check-up-disclaimer.page.html',
  styleUrls: ['./check-up-disclaimer.page.scss'],
})
export class CheckUpDisclaimerPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() { }

  public navigateBack() {
    this.router.navigateByUrl('/check-up-services');
  }
}