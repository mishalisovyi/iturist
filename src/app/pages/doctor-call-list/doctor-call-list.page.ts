import { Component, OnInit } from '@angular/core';

// import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-doctor-call-list',
  templateUrl: './doctor-call-list.page.html',
  styleUrls: ['./doctor-call-list.page.scss'],
})
export class DoctorCallListPage implements OnInit {

  // constructor(private socket: SocketService) { }
  constructor() { }

  ngOnInit() {
    // this.socket.createSocket();
  }

}