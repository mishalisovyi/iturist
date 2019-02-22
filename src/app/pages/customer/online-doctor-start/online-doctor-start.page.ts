import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-online-doctor-start',
  templateUrl: './online-doctor-start.page.html',
  styleUrls: ['./online-doctor-start.page.scss'],
})
export class OnlineDoctorStartPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }
}