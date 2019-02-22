import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File as IonicFile } from '@ionic-native/file/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

import { LoadingService } from "./loading.service";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  public imgInfo = {
    profile: {
      src: null,
      file: null,
      deleted: true,
      changed: false
    },
    airline: {
      src: null,
      file: null,
      deleted: true,
      changed: false
    },
    travel: {
      src: null,
      file: null,
      deleted: true,
      changed: false
    },
    passport: {
      src: null,
      file: null,
      deleted: true,
      changed: false
    }
  }

  constructor(
    private camera: Camera,
    private filePath: FilePath,
    private webview: WebView,
    private file: IonicFile,
    private loading: LoadingService,
    private platform: Platform,
    private backgroundMode: BackgroundMode
  ) { }

  private getPromiseForFile(directory: any, filename: any, imagePath: any): Promise<any> {
    if (this.platform.is("ios")) {
      return Promise.all([this.file.readAsArrayBuffer(directory, filename)]);
    } else {
      return Promise.all([
        this.file.readAsArrayBuffer(directory, filename),
        this.filePath.resolveNativePath(imagePath)
      ]);
    }
  }

  public resetPhotoData() {
    for (const image in this.imgInfo) {
      this.imgInfo[image].src = null;
      this.imgInfo[image].file = null;
      this.imgInfo[image].deleted = true;
      this.imgInfo[image].changed = false;
    }
  }

  public getPhoto(img: string) {

    this.backgroundMode.disable();
    this.deletePhoto(img);
    this.loading.createLoading("Please wait, uploading photo");

    this.camera
      .getPicture({
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        mediaType: this.camera.MediaType.PICTURE,
        encodingType: this.camera.EncodingType.PNG
      })
      .then(
        imagePath => {
          console.log("image is readed");
          const n = imagePath.lastIndexOf("/");
          const x = imagePath.lastIndexOf("g");
          const filename = imagePath.substring(n + 1, x + 1);
          const directory = imagePath.substring(0, n);

          this.getPromiseForFile(directory, filename, imagePath)
            .then(
              res => {
                console.log(res);
                this.imgInfo[img].file = new Blob([res[0]], { type: "image/jpeg" });
                this.imgInfo[img].src = this.webview.convertFileSrc(this.platform.is("ios") ? imagePath : res[1]);
                this.imgInfo[img].src = this.webview.convertFileSrc(imagePath);
                this.imgInfo[img].deleted = false;
                this.imgInfo[img].changed = true;
              },
              err => {
                alert(this.platform.is("ios") ? JSON.stringify(err) : "Only JPEG images are allowed");
                console.error(err);
              }
            )
            .finally(() => {
              this.loading.dismissLoading();
              this.backgroundMode.enable();
            });
        },
        err => {
          console.error(err);
          alert(JSON.stringify(err));
          this.loading.dismissLoading();
        }
      )
      .finally(() => this.backgroundMode.enable());
  }

  public deletePhoto(img: string) {
    this.imgInfo[img].file = null;
    this.imgInfo[img].src = null;
    this.imgInfo[img].deleted = true;
    this.imgInfo[img].changed = false;
  }

  public createImageName(): string {
    const d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }
}