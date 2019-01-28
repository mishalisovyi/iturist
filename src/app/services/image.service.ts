import { Injectable } from '@angular/core';

import { LoadingController } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { Platform } from '@ionic/angular';
import { FilePath } from '@ionic-native/file-path/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File as IonicFile, FileEntry } from '@ionic-native/file/ngx';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private loading: any;

  public imgInfo = {
    profile: {
      src: null,
      name: null,
      correctPath: null,
      file: null,
      deleted: true,
      changed: false
    },
    airline: {
      src: null,
      name: null,
      correctPath: null,
      file: null,
      deleted: true,
      changed: false
    },
    travel: {
      src: null,
      name: null,
      correctPath: null,
      file: null,
      deleted: true,
      changed: false
    },
    passport: {
      src: null,
      name: null,
      correctPath: null,
      file: null,
      deleted: true,
      changed: false
    }
  }

  constructor(
    private camera: Camera,
    private platform: Platform,
    private filePath: FilePath,
    private webview: WebView,
    private file: IonicFile,
    private loadingController: LoadingController
  ) { }

  public getPhoto(img: string) {
    if (this.platform.is("android")) {
      this.deletePhoto(img).then(() => {
        setTimeout(() => {
          this.createLoading();
        }, 300);
        this.camera
          .getPicture({
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            mediaType: this.camera.MediaType.PICTURE,
            encodingType: this.camera.EncodingType.PNG
          })
          .then(
            imagePath => {
              this.filePath.resolveNativePath(imagePath)
                .then(file => {
                  this.imgInfo[img].src = this.webview.convertFileSrc(file);
                  this.imgInfo[img].correctPath = file.substr(0, file.lastIndexOf('/') + 1);
                  const currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                  this.copyImageToLocalDir(img, currentName, this.createImageName());
                  alert(this.imgInfo[img].src);
                })
                .finally(() => {
                  alert("dismiss loading");
                  this.dismissLoading();
                })
            },
            err => {
              alert("for view: " + err);
            }
          );
      })
    } else {
      this.camera
        .getPicture({
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          mediaType: this.camera.MediaType.PICTURE,
          destinationType: this.camera.DestinationType.DATA_URL,
          correctOrientation: true
        })
        .then(
          image => {
            this.imgInfo[img].src = "data:image/jpeg;base64," + image;
            this.imgInfo[img].file = new File([this.imgInfo[img].src], this.createImageName(), { type: typeof Blob, lastModified: Date.now() });
            this.imgInfo[img].deleted = false;
          }
        )
        .finally(() => this.dismissLoading());
    }
  }

  public deletePhoto(img: string) {
    return new Promise(resolve => {
      if (this.platform.is('android')) {
        this.file.removeFile(this.file.dataDirectory, this.imgInfo[img].name)
          .then(
            res => alert("file is removed: " + name),
            err => alert("err: " + err)
          )
          .finally(() => {
            this.imgInfo[img].file = null;
            this.imgInfo[img].deleted = true;
            resolve();
          })
      } else {
        this.imgInfo[img].file = null;
        this.imgInfo[img].deleted = true;
        resolve();
      }
    })
  }

  private copyImageToLocalDir(img: string, currentName: string, newFileName: string) {
    alert("start copy to local dir");
    this.file.copyFile(this.imgInfo[img].correctPath, currentName, this.file.dataDirectory, newFileName).then(
      success => {
        this.imgInfo[img].name = newFileName;
        this.imgInfo[img].deleted = false;
        this.imgInfo[img].changed = true;
        alert("image name: " + this.imgInfo[img].name);
      },
      err => {
        if (err.code === 5) {
          this.imgInfo[img].src = null;
          alert("Please, load JPG file!");
        }
      }
    );
  }

  public getImageFromFileEntry(img: string) {
    return new Promise((resolve, reject) => {
      this.file.resolveLocalFilesystemUrl(this.file.dataDirectory + this.imgInfo[img].name)
        .then(entry => {
          (<FileEntry>entry).file(file => {
            alert("file from entry: " + JSON.stringify(file));
            this.readFile(img, file).then(res => {
              resolve();
            });
          })
        })
        .catch(err => {
          reject(err);
          alert('Error while reading file.');
        });
    })
  }

  private readFile(img: string, file: any) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const imgBlob = new Blob([reader.result], {
          type: file.type
        });
        this.imgInfo[img].file = new File([imgBlob], this.imgInfo[img].name, { type: imgBlob.type, lastModified: Date.now() });
        alert(JSON.stringify(this.imgInfo[img].file));
        resolve();
      }
      reader.onerror = err => {
        alert("reader error: " + err);
        reject();
      };
      reader.readAsArrayBuffer(file);
    });
  }

  private async createLoading() {
    this.loading = await this.loadingController.create({
      message: 'Please wait, uploading photo',
      spinner: "dots"
    });
    return this.loading.present();
  }

  private async dismissLoading() {
    await this.loading.dismiss();
  }

  public createImageName(): string {
    const d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }
}
