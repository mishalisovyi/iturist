import { Component, OnInit } from '@angular/core';

import * as io from 'socket.io-client';
import * as OT from '@opentok/client';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-doctor-call-room',
  templateUrl: './doctor-call-room.page.html',
  styleUrls: ['./doctor-call-room.page.scss'],
})
export class DoctorCallRoomPage implements OnInit {

  private socket: any;
  private session: any;
  private publisher: any;
  private apiKey: string = "46253572";
  private sessionId: string = "1_MX40NjI1MzU3Mn5-MTU0OTY0ODI2MjQ4OX4wWmtOTW1HaHIzT2N0TktYaEhpTnd5ajd-fg";
  private publisherToken2: string = "T1==cGFydG5lcl9pZD00NjI1MzU3MiZzaWc9YzBjYjIwMTg4NTBmMWQ4MGU5NWVlZGRlOGQzMjBlMjZmODFhNTVjZjpzZXNzaW9uX2lkPTFfTVg0ME5qSTFNelUzTW41LU1UVTBPVFkwT0RJMk1qUTRPWDR3V210T1RXMUhhSEl6VDJOMFRrdFlhRWhwVG5kNWFqZC1mZyZjcmVhdGVfdGltZT0xNTQ5NjUwNTEyJm5vbmNlPTAuNjM2OTU4NjcxNTA0MjIxNSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTUyMjM4ODkzJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9";

  constructor() { }

  ngOnInit() {
    // this.socket = io.connect(environment.socket);
    // this.socket = io(environment.socket);

    // console.log(this.socket);
    // this.socket.emit('ferret', 'tobi', (data) => {
    //   console.log(data);
    // });
    // this.socket.on('connection', (msg) => {
    //   alert(msg);
      // console.log(msg);
      // this.session = OT.initSession(this.apiKey, this.sessionId);
      // // this.session = OT.initSession(msg.apiKey, msg.sessionId);
      // this.session.connect(this.publisherToken2, () => {
      // // this.session.connect(msg.publisherToken, () => {
      //   console.log('connected');
      // });
      // this.session.on({
      //   streamCreated: (event) => {
      //     this.session.subscribe(event.stream, 'subscriber');
      //     this.publisher = OT.initPublisher('publisher', { publishAudio: true, publishVideo: false });
      //     this.session.publish(this.publisher);
      //   },
      //   streamDestroyed: (event) => {
      //     console.log(`Stream ${event.stream.name} ended because ${event.reason}`);
      //     this.publisher.destroy();
      //   }
      // });
    // });
  }
}