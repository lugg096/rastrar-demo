import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
/* Galeria de fotos */
/* import { ImagePicker } from '@ionic-native/image-picker/ngx'; */
import { ModalController } from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource, FilesystemDirectory, Capacitor } from '@capacitor/core';
/* import { VerFotoComponent } from '../ver-foto/ver-foto.component'; */
import { IonicComponentsService } from 'src/app/services/ionic-components.service';
import { sha256 } from 'js-sha256';
import { environment as env } from 'src/environments/environment';
/* import { Image } from 'src/app/interface/interfaces'; */
import { Funciones } from 'src/app/compartido/funciones';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
const { Camera, Filesystem } = Plugins;

@Component({
  selector: 'app-capture-images',
  templateUrl: './capture-images.component.html',
  styleUrls: ['./capture-images.component.scss'],
})
export class CaptureImagesComponent implements OnInit {

  imgForm: FormGroup;
  constructor(
    private fun: Funciones,
    public _comp: IonicComponentsService,
    private _modal: ModalController,
    public formBuilder: FormBuilder) {
    this.imgForm = formBuilder.group({
      description: ['', Validators.required],
    })
  }

  photoPreview = [];

  idPhotoRemove = [];

  field: any;
  value: any;

  idCert: any;
  onlyView = false;

  ngOnInit() {

    console.log('value,', this.value);
    console.log('field,', this.field);
    this.photoPreview = this.value.files;
    console.log(this.photoPreview);
    
    this.imgForm.controls['description'].setValue(this.value.description);
  }

  closeModal() {

    let value = this.photoPreview.length + ' imagenes';
    this.value = {
      files: this.photoPreview,
      description: this.imgForm.controls['description'].value,
      value
    }

    this._modal.dismiss({ value: this.value });
  }

  imgeFile: any = {
    name: ''
  };

  onFileSelected(field) {
    const inputNode: any = document.querySelector('#' + field);
    console.log('inputNode.files', inputNode.files);

    for (let index = 0; index < inputNode.files.length; index++) {
      const file = inputNode.files[index];
      console.log('file', file);

      let f_save: any = {
        ext: file.type.split("/")[1],
        type: file.type,
        b64: ''
      };

      let reader: any = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        console.log('reader.result', reader.result);

        f_save.b64 = reader.result.split(";base64,")[1];
        // console.log('this.contentFile', f_save.b64);
        this.photoPreview.push(f_save);
      };
    }


  }

  deleteImg(index) {
    this.photoPreview.splice(index, 1);
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

    /*   const modal = await this._modal.create({
        component: VerFotoComponent,
        componentProps: {
          img: path,
          onlyView:this.onlyView
        }
      });
      modal.onDidDismiss().then(async (res: any) => {
        if (res.data.delete) this.removeImage(index)
      });
      return await modal.present(); */

  }



}
