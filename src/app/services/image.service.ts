import { Injectable } from '@angular/core';
import { Camera } from '@ionic-native/camera/ngx';
import { Platform } from '@ionic/angular';
import { FilePath } from '@ionic-native/file-path/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File as IonicFile, FileEntry } from '@ionic-native/file/ngx';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  public profileImgSrc: string;
  public profileImgName: string;
  public profileImgCorrectPath: string;
  public profileImgFile: File = null;
  public profileImgFileDeleted: boolean = true;
  public profileImgFileChanged: boolean = false;

  public airlineImgSrc: string;
  public airlineImgName: string;
  public airlineImgCorrectPath: string;
  public airlineImgFile: File = null;
  public airlineImgFileDeleted: boolean = true;
  public airlineImgFileChanged: boolean = false;

  public travelImgSrc: string;
  public travelImgName: string;
  public travelImgCorrectPath: string;
  public travelImgFile: File = null;
  public travelImgFileDeleted: boolean = true;
  public travelImgFileChanged: boolean = false;

  public passportImgSrc: string;
  public passportImgName: string;
  public passportImgCorrectPath: string;
  public passportImgFile: File = null;
  public passportImgFileDeleted: boolean = true;
  public passportImgFileChanged: boolean = false;

  constructor(
    private camera: Camera,
    private platform: Platform,
    private filePath: FilePath,
    private webview: WebView,
    private file: IonicFile
  ) { }

  public getProfilePhoto() {
    if (this.platform.is("android")) {
      this.deleteProfilePhoto().then(() => {
        this.camera
          .getPicture({
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            mediaType: this.camera.MediaType.PICTURE
          })
          .then(
            imagePath => {
              this.filePath.resolveNativePath(imagePath)
                .then(file => {
                  this.profileImgSrc = this.webview.convertFileSrc(file);
                  this.profileImgCorrectPath = file.substr(0, file.lastIndexOf('/') + 1);
                  const currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                  this.copyProfileImageToLocalDir(currentName, this.createImageName());
                  alert(this.profileImgSrc);
                });
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
          destinationType: this.camera.DestinationType.DATA_URL
        })
        .then(
          image => {
            this.profileImgSrc = "data:image/jpeg;base64," + image;
            this.profileImgFile = new File([this.profileImgSrc], this.createImageName(), { type: typeof Blob, lastModified: Date.now() });
            this.profileImgFileDeleted = false;
          }
        )
    }
  }

  public getAirlinePhoto() {
    if (this.platform.is("android")) {
      this.camera
        .getPicture({
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          mediaType: this.camera.MediaType.PICTURE
        })
        .then(
          imagePath => {
            this.filePath.resolveNativePath(imagePath)
              .then(file => {
                this.airlineImgSrc = this.webview.convertFileSrc(file);
                this.airlineImgCorrectPath = file.substr(0, file.lastIndexOf('/') + 1);
                const currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                this.copyAirlineImageToLocalDir(currentName, this.createImageName());
                alert(this.airlineImgSrc);
              });
          },
          err => {
            alert("for view: " + err);
          }
        );
    } else {
      this.camera
        .getPicture({
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          mediaType: this.camera.MediaType.PICTURE,
          destinationType: this.camera.DestinationType.DATA_URL
        })
        .then(
          image => {
            this.airlineImgSrc = "data:image/jpeg;base64," + image;
            this.airlineImgFile = new File([this.airlineImgSrc], this.createImageName(), { type: typeof Blob, lastModified: Date.now() });
            this.airlineImgFileDeleted = false;
          }
        )
    }
  }

  public getTravelPhoto() {
    if (this.platform.is("android")) {
      this.camera
        .getPicture({
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          mediaType: this.camera.MediaType.PICTURE
        })
        .then(
          imagePath => {
            this.filePath.resolveNativePath(imagePath)
              .then(file => {
                this.travelImgSrc = this.webview.convertFileSrc(file);
                this.travelImgCorrectPath = file.substr(0, file.lastIndexOf('/') + 1);
                const currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                this.copyTravelImageToLocalDir(currentName, this.createImageName());
                alert(this.travelImgSrc);
              });
          },
          err => {
            alert("for view: " + err);
          }
        );
    } else {
      this.camera
        .getPicture({
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          mediaType: this.camera.MediaType.PICTURE,
          destinationType: this.camera.DestinationType.DATA_URL
        })
        .then(
          image => {
            this.travelImgSrc = "data:image/jpeg;base64," + image;
            this.travelImgFile = new File([this.travelImgSrc], this.createImageName(), { type: typeof Blob, lastModified: Date.now() });
            this.travelImgFileDeleted = false;
          }
        )
    }
  }

  public getPassportPhoto() {
    if (this.platform.is("android")) {
      this.camera
        .getPicture({
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          mediaType: this.camera.MediaType.PICTURE
        })
        .then(
          imagePath => {
            this.filePath.resolveNativePath(imagePath)
              .then(file => {
                this.passportImgSrc = this.webview.convertFileSrc(file);
                this.passportImgCorrectPath = file.substr(0, file.lastIndexOf('/') + 1);
                const currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                this.copyPassportImageToLocalDir(currentName, this.createImageName());
                alert(this.passportImgSrc);
              });
          },
          err => {
            alert("for view: " + err);
          }
        );
    } else {
      this.camera
        .getPicture({
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          mediaType: this.camera.MediaType.PICTURE,
          destinationType: this.camera.DestinationType.DATA_URL
        })
        .then(
          image => {
            this.passportImgSrc = "data:image/jpeg;base64," + image;
            this.passportImgFile = new File([this.passportImgSrc], this.createImageName(), { type: typeof Blob, lastModified: Date.now() });
            this.passportImgFileDeleted = false;
          }
        )
    }
  }

  public deleteProfilePhoto() {
    return new Promise((resolve, reject) => {
      this.file.removeFile(this.file.dataDirectory, this.profileImgName)
        .then(
          success => {
            alert("file is removed: " + name);
            resolve();
          },
          err => {
            alert("err: " + JSON.stringify(err));
            resolve();
          }
        )
        .finally(() => {
          this.profileImgFile = null;
          this.profileImgFileDeleted = true;
        })
    })
  }

  public deleteAirlinePhoto() {
    if (this.platform.is('android')) {
      this.file.removeFile(this.file.dataDirectory, this.airlineImgName)
        .then(
          res => alert("file is removed: " + name),
          err => alert("err: " + err)
        )
        .finally(() => {
          this.airlineImgFile = null;
          this.airlineImgFileDeleted = true;
        })
    } else {
      this.airlineImgFile = null;
      this.airlineImgFileDeleted = true;
    }
  }

  public deleteTravelPhoto() {
    if (this.platform.is('android')) {
      this.file.removeFile(this.file.dataDirectory, this.travelImgName)
        .then(
          res => alert("file is removed: " + name),
          err => alert("err: " + err)
        )
        .finally(() => {
          this.travelImgFile = null;
          this.travelImgFileDeleted = true;
        })
    } else {
      this.travelImgFile = null;
      this.travelImgFileDeleted = true;
    }
  }

  public deletePassportPhoto() {
    if (this.platform.is('android')) {
      this.file.removeFile(this.file.dataDirectory, this.passportImgName)
        .then(
          res => alert("file is removed: " + name),
          err => alert("err: " + err)
        )
        .finally(() => {
          this.passportImgFile = null;
          this.passportImgFileDeleted = true;
        })
    } else {
      this.passportImgFile = null;
      this.passportImgFileDeleted = true;
    }
  }

  private copyProfileImageToLocalDir(currentName, newFileName) {
    alert("start copy to local dir");
    this.file.copyFile(this.profileImgCorrectPath, currentName, this.file.dataDirectory, newFileName).then(
      success => {
        this.profileImgName = newFileName;
        this.profileImgFileDeleted = false;
        this.profileImgFileChanged = true;
        alert("image name: " + this.profileImgName);
      },
      err => {
        alert("err: " + err);
      }
    );
  }

  private copyAirlineImageToLocalDir(currentName, newFileName) {
    alert("start copy to local dir");
    this.file.copyFile(this.airlineImgCorrectPath, currentName, this.file.dataDirectory, newFileName).then(
      success => {
        this.airlineImgName = newFileName;
        this.airlineImgFileDeleted = false;
        this.airlineImgFileChanged = true;
        alert("img name: " + this.airlineImgName);
      },
      err => {
        alert(err);
      }
    );
  }

  private copyTravelImageToLocalDir(currentName, newFileName) {
    alert("start copy to local dir");
    this.file.copyFile(this.travelImgCorrectPath, currentName, this.file.dataDirectory, newFileName).then(
      success => {
        this.travelImgName = newFileName;
        this.travelImgFileDeleted = false;
        this.travelImgFileChanged = true;
        alert("img name: " + this.travelImgName);
      },
      err => {
        alert(err);
      }
    );
  }

  private copyPassportImageToLocalDir(currentName, newFileName) {
    alert("start copy to local dir");
    this.file.copyFile(this.passportImgCorrectPath, currentName, this.file.dataDirectory, newFileName).then(
      success => {
        this.passportImgName = newFileName;
        this.passportImgFileDeleted = false;
        this.passportImgFileChanged = true;
        alert("img name: " + this.passportImgName);
      },
      err => {
        alert(err);
      }
    );
  }

  public getProfileImgFromFileEntry() {
    return new Promise((resolve, reject) => {
      this.file.resolveLocalFilesystemUrl(this.file.dataDirectory + this.profileImgName)
        .then(entry => {
          (<FileEntry>entry).file(file => {
            alert("file from entry: " + JSON.stringify(file));
            this.readProfileFile(file).then(res => {
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

  public getAirlineImgFromFileEntry() {
    return new Promise((resolve, reject) => {
      this.file.resolveLocalFilesystemUrl(this.file.dataDirectory + this.airlineImgName)
        .then(entry => {
          (<FileEntry>entry).file(file => {
            alert("file from entry: " + JSON.stringify(file));
            this.readAirlineFile(file).then(res => {
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

  public getTravelImgFromFileEntry() {
    return new Promise((resolve, reject) => {
      this.file.resolveLocalFilesystemUrl(this.file.dataDirectory + this.travelImgName)
        .then(entry => {
          (<FileEntry>entry).file(file => {
            alert("file from entry: " + JSON.stringify(file));
            this.readTravelFile(file).then(res => {
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

  public getPassportImgFromFileEntry() {
    return new Promise((resolve, reject) => {
      this.file.resolveLocalFilesystemUrl(this.file.dataDirectory + this.passportImgName)
        .then(entry => {
          (<FileEntry>entry).file(file => {
            alert("file from entry: " + JSON.stringify(file));
            this.readPassportFile(file).then(res => {
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

  private readProfileFile(file: any) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        // const formData = new FormData();
        const imgBlob = new Blob([reader.result], {
          type: file.type
        });

        this.profileImgFile = new File([imgBlob], this.profileImgName, { type: imgBlob.type, lastModified: Date.now() });
        alert(JSON.stringify(this.profileImgFile));
        resolve();


        // formData.append('file', imgBlob, file.name);
        // this.uploadImageData(formData);
      }
      reader.onerror = err => {
        alert("reader error: " + err);
        reject();
      };
      reader.readAsArrayBuffer(file);
    });
  }

  private readAirlineFile(file: any) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        // const formData = new FormData();
        const imgBlob = new Blob([reader.result], {
          type: file.type
        });
        alert(JSON.stringify({ aa: reader.result, bb: file.type }));


        this.airlineImgFile = new File([imgBlob], this.airlineImgName, { type: imgBlob.type, lastModified: Date.now() });
        resolve();


        // formData.append('file', imgBlob, file.name);
        // this.uploadImageData(formData);
      }
      reader.onerror = err => {
        alert("reader error: " + err);
        reject();
      };
      reader.readAsArrayBuffer(file);
    });
  }

  private readTravelFile(file: any) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        // const formData = new FormData();
        const imgBlob = new Blob([reader.result], {
          type: file.type
        });
        alert(JSON.stringify({ aa: reader.result, bb: file.type }));


        this.travelImgFile = new File([imgBlob], this.travelImgName, { type: imgBlob.type, lastModified: Date.now() });
        resolve();


        // formData.append('file', imgBlob, file.name);
        // this.uploadImageData(formData);
      }
      reader.onerror = err => {
        alert("reader error: " + err);
        reject();
      };
      reader.readAsArrayBuffer(file);
    });
  }

  private readPassportFile(file: any) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        // const formData = new FormData();
        const imgBlob = new Blob([reader.result], {
          type: file.type
        });
        alert(JSON.stringify({ aa: reader.result, bb: file.type }));


        this.passportImgFile = new File([imgBlob], this.passportImgName, { type: imgBlob.type, lastModified: Date.now() });
        resolve();


        // formData.append('file', imgBlob, file.name);
        // this.uploadImageData(formData);
      }
      reader.onerror = err => {
        alert("reader error: " + err);
        reject();
      };
      reader.readAsArrayBuffer(file);
    });
  }

  public createImageName(): string {
    const d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }
}
