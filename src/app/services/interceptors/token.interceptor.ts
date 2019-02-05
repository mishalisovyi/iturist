import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { ApiService } from "../api.service";
import { StorageService } from "../storage.service";
import { mergeMap, catchError } from "rxjs/operators";
import { Router } from "@angular/router";

import * as _ from "lodash";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private http: HttpClient;

  constructor(
    private injector: Injector,
    private apiService: ApiService,
    private router: Router,
    private storage: StorageService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.apiService.getToken().pipe(
      mergeMap(token => {
        console.log("token from interceptor: ", token);
        const newRequest = token ? request.clone({ url: request.url + "/", setHeaders: { Authorization: `Token ${token}` } }) : request.clone({ url: request.url + "/" });
        if (!token) {
          request.url.includes('register') ? this.router.navigateByUrl("/register") : this.router.navigateByUrl("/login");
        }

        return next.handle(newRequest).pipe(
          catchError(error => {
            if (error.status === 401 || error.status === 403) {
              this.storage.remove("token").subscribe(() => {
                this.router.navigateByUrl("/login");
              })
            }
            return throwError(error);
          })
        );
      })
    );
  }
}
