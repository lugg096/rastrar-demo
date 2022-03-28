import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
/* Galeria de fotos */
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ModalController } from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource, FilesystemDirectory, Capacitor } from '@capacitor/core';
import { VerFotoComponent } from '../ver-foto/ver-foto.component';
import { IonicComponentsService } from 'src/app/services/ionic-components.service';
import { sha256 } from 'js-sha256';
import { environment as env } from 'src/environments/environment';
import { Image } from 'src/app/interface/interfaces';
import { Funciones } from 'src/app/compartido/funciones';
const { Camera, Filesystem } = Plugins;

@Component({
  selector: 'app-capture-images',
  templateUrl: './capture-images.component.html',
  styleUrls: ['./capture-images.component.scss'],
})
export class CaptureImagesComponent implements OnInit {

  constructor(
    private fun: Funciones,
    public _comp: IonicComponentsService,
    private _modal: ModalController,
    private imagePicker: ImagePicker) { }

  photoPreview = [];
  idPhotoRemove = [];
  field: any;
  idCert: any;
  folder_init = 'CERT_COOPECAN';
  onlyView = false;

  ngOnInit() {

    console.log('idPhotoRemove,', this.idPhotoRemove);

  }

  closeModal() {
    this._modal.dismiss({
      photoPreview: this.photoPreview,
      idPhotoRemove: this.idPhotoRemove
    });
  }

  validMax() {
    if (!this.field.max) return false;
    if (this.field.max > this.photoPreview.length) return false;
    this._comp.presentToast('Número máximo de imagenes', 'danger', 1500);
    return true;
  }

  getNameImg(array: any[]) {
    return new Promise((resolve, reject) => {
      let max = '';
      for (let index = 0; index < array.length; index++) {
        if ((array[index].toLowerCase().indexOf(".jpg") > 0) && (array[index] > max)) max = array[index];
        if (index == array.length - 1) {
          resolve(max);
        }
      }

    });
  }

  async takePhoto() {
    const options = {
      quality: 80,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    };

    const originalPhoto = await Camera.getPhoto(options);
    console.log('originalPhoto', originalPhoto);

    const photoInTempStorage = await Filesystem.readFile({ path: originalPhoto.path });
    console.log('photoInTempStorage', photoInTempStorage);
    let date = new Date(),
      time = date.getTime(),
      fileName = time + ".jpeg";

    await Filesystem.writeFile({
      data: photoInTempStorage.data,
      path: fileName,
      directory: FilesystemDirectory.Documents
    });

    const finalPhotoUri = await Filesystem.getUri({
      directory: FilesystemDirectory.Documents,
      path: fileName
    });

    let photoPath = Capacitor.convertFileSrc(finalPhotoUri.uri);
    console.log('photoPath', photoPath);
  }

  async takePicture() {

    const options = {
      quality: 30,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    };

    const originalPhoto = await Camera.getPhoto(options);
    console.log('originalPhoto', originalPhoto);

    const photoInTempStorage = await Filesystem.readFile({ path: originalPhoto.path });
    console.log('photoInTempStorage', photoInTempStorage);
    let date = new Date(),
      time = date.getTime(),
      fileName = time + ".jpeg";

    await Filesystem.writeFile({
      data: photoInTempStorage.data,
      path: `${env.FOLDER_CERT}/${fileName}`,
      directory: FilesystemDirectory.Documents,
      recursive: true
    });

    //RUTA DE ARCHIVO
    const finalPhotoUri = await Filesystem.getUri({
      directory: FilesystemDirectory.Documents,
      path: `${env.FOLDER_CERT}/${fileName}`,
    });
    console.log('finalPhotoUri', finalPhotoUri);

    let photoPath = Capacitor.convertFileSrc(finalPhotoUri.uri);
    console.log('photoPath', photoPath);

    /*  const dataSaved = await Filesystem.readFile({
        path: `${env.FOLDER_CERT}/${fileName}`,
        directory: FilesystemDirectory.Documents
        }); 
    console.log('dataSaved', dataSaved); */
    //let photoPath = 'http://localhost/_capacitor_file_/storage/emulated/0/Documents/'+fileName;

    try {
      
      var imagen: Image = {
        id_cert: this.idCert,
        path: photoPath,
        nameFile: fileName + '',
        webPath: photoPath,
        status_upload: 0,
        status: env.STATUS_REG.SAVED
      };

      console.log('imagen', imagen);
      this.photoPreview.unshift(imagen);
    } catch (e) {
      console.error('Unable to read dir', e);
    }

  }

  async takePicture_() {

    if (this.validMax()) return;

    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      saveToGallery: true
    });

    console.log('image.....1', image);
    try {
      let folder = await Filesystem.readdir({ directory: FilesystemDirectory.Documents, path: '../Pictures' });
      /*let file: any = await Filesystem.readFile({ directory: FilesystemDirectory.Documents, path: `../Pictures/${folder.files[folder.files.length - 1]}` });*/

      let nameFile = await this.getNameImg(folder.files);
      /* folder.files[folder.files.length - 1]; */

      /*
      let typeFile = nameFile.substring(nameFile.lastIndexOf("."), nameFile.length);
      let newName = `${sha256(file.data)}.${typeFile}`;
      */

      /*
      let rename = await Filesystem.rename({
      from: `../Pictures/${nameFile}`,
      to: `../Pictures/${newName}`,
      directory: FilesystemDirectory.Documents});
      console.log('rename', rename);
      */

      let webPath = `http://localhost/_capacitor_file_/storage/emulated/0/Documents/../Pictures/${nameFile}`;
      let path = `file:///storage/emulated/0/Documents/../Pictures/${nameFile}`;

      var imagen: Image = {
        id_cert: this.idCert,
        path,
        nameFile: nameFile + '',
        webPath,
        status_upload: 0,
        status: env.STATUS_REG.SAVED
      };

      console.log('imagen', imagen);
      this.photoPreview.unshift(imagen);
    } catch (e) {
      console.error('Unable to read dir', e);
    }

  }

  removeImage(index) {
    if (!this.fun.isVarInvalid(this.photoPreview[index].id)) {
      this.pushIdRemove(this.photoPreview[index].id);
    }
    this.photoPreview.splice(index, 1);
    console.log('this.idPhotoRemove 2', this.idPhotoRemove);
  }

  pushIdRemove(value) {
    this.idPhotoRemove.push(value);
    console.log('this.idPhotoRemove 1', this.idPhotoRemove);

  }

  async verFoto(path, index) {

    const modal = await this._modal.create({
      component: VerFotoComponent,
      componentProps: {
        img: path,
        onlyView:this.onlyView
      }
    });
    modal.onDidDismiss().then(async (res: any) => {
      if (res.data.delete) this.removeImage(index)
    });
    return await modal.present();

  }

  gallery() {
    if (this.validMax()) return;
    const options = {
      quality: 80,
      outputType: 1,
      maximumImagesCount: this.field.max ? this.field.max - this.photoPreview.length : null,
    };

    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        this.photoPreview.unshift(`data:image/jpeg;base64,${results[i]}`);
        //   console.log('Image URI: ' + results[i]);
      }
    }, (err) => { });
  }

}
