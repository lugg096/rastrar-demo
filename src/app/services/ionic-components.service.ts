import { Injectable } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class IonicComponentsService {

  constructor(

    public loadingController: LoadingController,
    public actionSheetController: ActionSheetController,
    public toastController: ToastController) {

  }


 
  async presentLoading(text?) {
    return new Promise(async (resolve, reject) => {
      const loading = await this.loadingController.create({
        message: text ? text : 'Por favor espere...',
        backdropDismiss: false,
        showBackdrop: true,
        spinner: "bubbles"
      });
      await loading.present();
      resolve(loading);
    });
  }

  /*   async presentLoading( message:string, duration:number ) {
      const loading = await this.loadingController.create({
        message: 'Por favor espere...',
        backdropDismiss: false,
        showBackdrop: true,
        spinner: "bubbles"
      });
      await loading.present();
  
      const { role, data } = await loading.onDidDismiss();
      console.log('Loading dismissed!');
    }
   */

  async presentToast(texto: string, color: string, duracion: number) {
    const toast = await this.toastController.create({
      message: texto,
      duration: duracion,
      color: color
    });
    toast.present();
  }


  resizeImage(base64Str, maxWidth = 180, maxHeight = 150) {
    return new Promise((resolve) => {
      let img = new Image()
      img.src = base64Str
      img.onload = () => {
        let canvas = document.createElement('canvas')
        const MAX_WIDTH = maxWidth
        const MAX_HEIGHT = maxHeight
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }
        canvas.width = width
        canvas.height = height
        let ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL())
      }
    })
  }


}
