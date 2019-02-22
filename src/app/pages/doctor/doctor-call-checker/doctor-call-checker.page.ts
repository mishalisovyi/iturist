// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';

// import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
// import { NativeAudio } from '@ionic-native/native-audio/ngx';

// import { switchMap } from 'rxjs/operators';

// import { StorageService } from '../../services/storage.service';
// import { ApiService } from '../../services/api.service';
// import { SocketService } from '../../services/socket.service';

// import { Profile } from '../../models/models';

// @Component({
//   selector: 'app-doctor-call-checker',
//   templateUrl: './doctor-call-checker.page.html',
//   styleUrls: ['./doctor-call-checker.page.scss'],
// })
// export class DoctorCallCheckerPage implements OnInit {

//   public socketReceiveData: any;
//   public profile: Profile;
//   public incomingCall: boolean = false;

//   constructor(
//     private router: Router,
//     private storage: StorageService,
//     private api: ApiService,
//     private socket: SocketService,
//     private deviceId: UniqueDeviceID,
//     private notifications: LocalNotifications,
//     private audio: NativeAudio
//   ) { }

//   ngOnInit() { }

//   ionViewWillEnter() {
//     console.log("view will enter");


//     setTimeout(async () => {
//       this.getProfile();
//       await this.socket.createSocket();
//       const id = await this.deviceId.get();
//       console.log("device id", id);

//       await this.socket.connect();
//       await this.socket.sendData(JSON.stringify({ deviceId: id }));

//       (<any>window).chrome.sockets.tcp.onReceive.addListener((res: any) => {
//         console.log("socket response", res);
//         this.socketReceiveData = this.socket.convertDataForReceive(res.data);
//         console.log(this.socketReceiveData)
//         this.incomingCall = true;
//         this.notifications.schedule({
//           title: 'iTurist',
//           text: 'You have incoming call in iTurist application right now. Please, open Call Room to accept the call.'
//         });
//         this.audio.loop('ringtone').then(res => console.log(res));
//       });
//     }, 3000);
//   }

//   private getProfile() {
//     this.api.getProfile().subscribe(res => {
//       if (res) this.profile = res.content;
//     });
//   }

//   private navigateTo(path: string) {
//     this.router.navigateByUrl(path);
//   }

//   public async acceptCall() {
//     this.incomingCall = false;
//     await this.audio.stop('ringtone');
//     this.router.navigate(['/doctor-call-room'], { queryParams: { id: this.socketReceiveData.id, token: this.socketReceiveData.token, key: this.socketReceiveData.key } });
//     console.log("accept call");
//   }

//   public logout() {
//     this.api.logout()
//       .pipe(switchMap(() => this.storage.remove("token")))
//       .subscribe(() => this.navigateTo("/profile"));
//   }
// }






import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

import { switchMap } from 'rxjs/operators';

import { StorageService } from '../../../services/storage.service';
import { ApiService } from '../../../services/api.service';
import { SocketService } from '../../../services/socket.service';

import { Profile } from '../../../models/models';

@Component({
  selector: 'app-doctor-call-checker',
  templateUrl: './doctor-call-checker.page.html',
  styleUrls: ['./doctor-call-checker.page.scss'],
})
export class DoctorCallCheckerPage implements OnInit {

  public socketReceiveData: any;
  public profile: Profile;
  public incomingCall: boolean = false;

  constructor(
    private router: Router,
    private storage: StorageService,
    private api: ApiService,
    private socket: SocketService,
    private deviceId: UniqueDeviceID,
    private notifications: LocalNotifications,
    private audio: NativeAudio,
    private platform: Platform
  ) { }

  ngOnInit() {
    // console.log("on init");

    // this.platform.ready().then(async () => {

    //   this.getProfile();
    //   await this.socket.createSocketAndConnect();
    //   const id = await this.deviceId.get();
    //   console.log("device id", id);

    //   // await this.socket.connect();
    //   await this.socket.sendData(JSON.stringify({ deviceId: id }));

    //   (<any>window).chrome.sockets.tcp.onReceive.addListener((res: any) => {
    //     console.log("socket response", res);
    //     this.socketReceiveData = this.socket.convertDataForReceive(res.data);
    //     console.log(this.socketReceiveData)
    //     this.incomingCall = true;
    //     this.notifications.schedule({
    //       title: 'iTurist',
    //       text: 'You have incoming call in iTurist application right now. Please, open Call Room to accept the call.'
    //     });
    //     this.audio.loop('ringtone').then(res => console.log(res));
    //   });
    // })
  }

  ionViewWillEnter() {
    console.log("view enter");

    console.log()

    this.platform.ready().then(async () => {

      this.incomingCall = false;
      this.getProfile();
      await this.socket.createSocket();
      await this.socket.connect();
      const id = await this.deviceId.get();
      console.log("device id", id);

      // await this.socket.connect();
      await this.socket.sendData(JSON.stringify({ deviceId: id }));

      const that = this;
      (<any>window).chrome.sockets.tcp.onReceive.addListener((res) => {
        console.log("socket response", res);
        that.socketReceiveData = that.socket.convertDataForReceive(res.data);
        console.log(that.socketReceiveData)
        that.incomingCall = true;
        that.notifications.schedule({
          title: 'iTurist',
          text: 'You have incoming call in iTurist application right now. Please, open Call Room to accept the call.'
        });
        that.audio.loop('ringtone').then(res => console.log(res));
      });
    })
  }

  async ionViewWillLeave() {
    console.log("view leave");
    // (<any>window).chrome.sockets.tcp.onReceive.removeListener();
    await this.socket.disconnect();
  }

  private getProfile() {
    this.api.getProfile().subscribe(res => {
      if (res) this.profile = res.content;
    });
  }

  private navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }

  public async acceptCall() {
    await this.audio.stop('ringtone');
    this.incomingCall = false;
    this.router.navigate(['/doctor-call-room'], { queryParams: { id: this.socketReceiveData.id, token: this.socketReceiveData.token, key: this.socketReceiveData.key } });
    console.log("accept call");
  }

  public logout() {
    this.api.logout()
      .pipe(switchMap(() => this.storage.remove("token")))
      .subscribe(() => this.navigateTo("/profile"));
  }
}