import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-doctor-call-room',
  templateUrl: './doctor-call-room.page.html',
  styleUrls: ['./doctor-call-room.page.scss'],
})
export class DoctorCallRoomPage {

  private sessionId: string;
  private userToken: string;
  private apiKey: string;

  private session: any;
  private publisher: any;
  private subscriber: any;

  private subscription: Subscription;

  public duration: number;
  public callStarted: boolean;
  public callFinished: boolean;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ionViewWillEnter() {
    this.duration = 0;
    this.callStarted = false;
    this.callFinished = false;

    this.route.queryParams.subscribe(res => {
      this.sessionId = res.id;
      this.userToken = res.token;
      this.apiKey = res.api;

      const that = this;
      setTimeout(() => {
        that.callStarted = true;
        this.subscription = interval(1000).pipe(take(300)).subscribe(
          next => ++that.duration,
          err => { },
          () => that.finishCall()
        );
      }, 2000);

      // this.session = OT.initSession(this.apiKey, this.sessionId);

      // console.log("ion view will enter");
      // this.session.connect(this.userToken, () => {
      //   console.log('connected');
      //   this.publisher = OT.initPublisher('publisher', { publishAudio: true, publishVideo: false, insertMode: "append" });
      //   this.session.publish(this.publisher);
      // });

      // this.session.on({
      //   streamCreated: (event) => {
      //     this.subscriber = this.session.subscribe(event.stream, 'subscriber');
      //     this.callStarted = true;
      //     this.subscription = interval(1000).pipe(take(300)).subscribe(
      //       next => ++this.duration,
      //       err => { },
      //       () => this.finishCall()
      //     );
      //   },
      //   streamDestroyed: (event) => {
      //     console.log(`Stream ${event.stream.name} ended because ${event.reason}`);
      //     this.finishCall();
      //   }
      // });
    });
  }

  public finishCall() {
    // this.session.unsubscribe(this.subscriber);
    // this.session.unpublish(this.publisher);
    // this.session.disconnect();
    this.subscription.unsubscribe();
    this.callFinished = true;
    this.router.navigateByUrl("/doctor-call-checker");
  }

  public getMinutes() {
    return Math.floor(this.duration / 60);
  }

  public getSeconds() {
    return ('0' + (this.duration - 60 * Math.floor(this.duration / 60))).slice(-2);
  }
}