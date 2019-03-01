import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable, Subject } from "rxjs";

import { BaseResponse } from "../models/models";

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private languageIsLoadedSubject: Subject<boolean> = new Subject();
  public languageIsLoaded$: Observable<boolean> = this.languageIsLoadedSubject.asObservable();

  private _language: any = {
    common: {
      registration: "Registration",
      password: "Password",
      google_login: "Google Login",
      facebook_login: "Facebook Login",
      my_profile: "My Profile",
      logout: "Logout",
      email_address: "E-mail address",
      attach_photo: "Attach a passport photo, airline tickets, and travel insurance",
      airline_tickets: "airline tickets",
      travel_insurance: "travel insurance",
      passport: "passport",
      select_language: "Select language",
      cancel: "Cancel",
      loading_photo: "Please wait, uploading photo",
      choose_plan: "Choose plan",
      plan: "Plan",
      your_plan: "Your plan",
      name: "Name",
      image_allowed: "Only JPEG images are allowed",
      email_required: "Email is required.",
      email_not_valid: "Email is not valid.",
      password_required: "Password is required.",
      name_required: "Name is required",
      only_letters: "Only a-z, A-Z letters and whitespaces not at the beginning are allowed in name.",
      language_required: "Language is required.",
      login: "Login",
      my_requests: "My requests"
    },
    login: {
      email: "Email",
      sign_in: "Sign In",
      can_not_sign_in: "You can not sign in TravelSim via this Facebook account because you are registered in Facebook using mobile phone"
    },
    registration: {
      to_login: "To login",
      confirm_password: "Confirm Password",
      sign_up: "Sign Up",
      registering: "Registering",
      user_exists_message: "User with this email already exists",
      password_one_digit: "Password should contain at least one digit.",
      password_one_lowercase: "Password should contain at least one lowercase symbol.",
      password_one_uppercase: "Password should contain at least one uppercase symbol.",
      password_minlength: "Password minimum length is 8.",
      confirm_password_validation: "Confirm password.",
      password_not_match: "Passwords do not match."
    },
    menu: {
      sim_card_charges: "SIM Card Charges",
    },
    main: {
      sim_card: "Sim Card",
      welcome_to_israel: "WELCOME TO ISRAEL"
    },
    profile_start: {
      first_text: "You can view and update your profile settings, change application language",
      second_text: "Also you can attach a passport photo, airline tickets, and travel insurance",
      go: "Go"
    },
    profile: {
      language: "Language",
      save: "Save",
      updating_profile_msg: "Wait please, your information is updating",
    },
    choose_company: {
      choose_company: "Choose a media company",
    },
    choose_plan: {
      choose: "choose",
      checkout: "Checkout"
    },
    confirm_plan: {
      payment: "Payment",
      confirm: "Confirm",
      transaction: "The transaction",
      completed: "completed successfully!",
      ok: "ok"
    },
    my_plan: {
      choose_another_plan: "Choose another plan"
    },
    my_requests: {
      your_requests: "Your requests",
      requirement_created: "Requirement created",
      no_any_requests: "You don't have any requests"
    }
  };

  constructor(private http: HttpClient) { }

  public set language(language: any) {
    this._language = language;
  }

  public get language() {
    return this._language;
  }

  public loadLanguage(language: string = "En") {
    // this.http.get<BaseResponse>(`${environment.api}/language`).subscribe((res: BaseResponse) => {
    //   this.language = res.content;
    //   this.languageIsLoadedSubject.next(true);
    // });
    console.log("load language");
    setTimeout(() => {
      this.languageIsLoadedSubject.next(true);
    }, 300);
  }

  public getTextByCategories(category: string) {
    return { ...this.language.common, ...this.language[category] };
  }
}
