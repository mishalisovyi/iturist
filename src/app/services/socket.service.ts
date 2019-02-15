// import { Injectable } from '@angular/core';
// import { environment } from '../../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class SocketService {

//   public socketId: any;

//   constructor() { }

//   private convertDataForSend(data: string): ArrayBuffer {
//     const buffer = new ArrayBuffer(data.length);
//     const bufferView = new Uint8Array(buffer);
//     for (let i = 0; i < data.length; i++) {
//       bufferView[i] = data.charCodeAt(i);
//     }
//     return buffer;
//   }

//   public createSocket(): Promise<any> {
//     return new Promise(resolve => {
//       if (this.socketId) {
//         console.log("existing socket id", this.socketId);
//         resolve();
//       } else {
//         (<any>window).chrome.sockets.tcp.create({}, (createInfo: any) => {
//           this.socketId = createInfo.socketId;
//           console.log("new socket id", this.socketId);
//           resolve();
//         });
//       }
//     })
//   }

//   public connect(): Promise<any> {
//     return new Promise(resolve => {
//       (<any>window).chrome.sockets.tcp.connect(this.socketId, environment.socket_url, environment.socket_port, (res) => {
//         console.log("connected", res);
//         resolve();
//       });
//     })
//   }

//   public sendData(data: string): Promise<any> {
//     return new Promise(resolve => {
//       (<any>window).chrome.sockets.tcp.send(this.socketId, this.convertDataForSend(data), (res) => {
//         console.log("send", res);
//         resolve();
//       });
//     })
//   }

//   public convertDataForReceive(data: ArrayBuffer): string {
//     // return JSON.parse(new TextDecoder("utf-8").decode(new Uint8Array(data)));
//     return new TextDecoder("utf-8").decode(new Uint8Array(data));
//   }
// }






import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public socketId: any;

  constructor() { }

  private convertDataForSend(data: string): ArrayBuffer {
    const buffer = new ArrayBuffer(data.length);
    const bufferView = new Uint8Array(buffer);
    for (let i = 0; i < data.length; i++) {
      bufferView[i] = data.charCodeAt(i);
    }
    return buffer;
  }

  public createSocket(): Promise<any> {
    return new Promise(resolve => {
      // if (this.socketId) {
      //   console.log("existing socket id", this.socketId);
      //   resolve();
      // } else {
      (<any>window).chrome.sockets.tcp.create({}, async (createInfo: any) => {
        this.socketId = createInfo.socketId;
        console.log("new socket id", this.socketId);
        // await this.connect();
        resolve();
      });
      //  }
    })
  }

  public connect(): Promise<any> {
    return new Promise(resolve => {
      (<any>window).chrome.sockets.tcp.connect(this.socketId, environment.socket_url, environment.socket_port, (res) => {
        console.log("connected", res);
        resolve();
      });
    })
  }

  public disconnect(): Promise<any> {
    return new Promise(resolve => {
      (<any>window).chrome.sockets.tcp.connect(this.socketId, (res) => {
        console.log("disconnected", res);
        resolve();
      });
    })
  }

  public sendData(data: string): Promise<any> {
    return new Promise(resolve => {
      (<any>window).chrome.sockets.tcp.send(this.socketId, this.convertDataForSend(data), (res) => {
        console.log("send", res);
        resolve();
      });
    })
  }

  public convertDataForReceive(data: ArrayBuffer): string {
    // return JSON.parse(new TextDecoder("utf-8").decode(new Uint8Array(data)));
    return new TextDecoder("utf-8").decode(new Uint8Array(data));
  }
}