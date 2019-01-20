import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { ApiService } from '../../services/api.service';
import { StorageService } from "../../services/storage.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public form: FormGroup;
  public submitTry: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private api: ApiService, private storage: StorageService) { }

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  public login() {
    this.submitTry = true;
    if (this.form.valid) {
      this.api.login(this.form.value)
        .pipe(switchMap(response => this.storage.set("authorization", response)))
        .subscribe(res => {
          console.log(res);
          this.router.navigateByUrl("/choose-company");
        })
    }
  }

  public navigateToRegister() {
    this.router.navigateByUrl("/register");
  }
}