import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
/* import { CertComponent } from '../cert/cert.component'; */
import { environment as env } from 'src/environments/environment';
/* import { VerFotoComponent } from '../ver-foto/ver-foto.component'; */
import { Funciones } from 'src/app/compartido/funciones';

@Component({
  selector: 'app-view-cert',
  templateUrl: './view-cert.component.html',
  styleUrls: ['./view-cert.component.scss'],
})
export class ViewCertComponent implements OnInit {

  listCred: any = [];
  dataProv: any;
  constructor(
    private _fun: Funciones, private _modal: ModalController) { }
  endPoint = env.url.substr(0, env.url.length - 1);

  arrayBand = [];

  ngOnInit() {
    
    this.listCred = [this.dataProv];
    console.log('this.listCred',this.listCred);
    

    for (let index = 0; index < this.listCred.length; index++) {
      this.arrayBand.push(false);
      const element = this.listCred[index];
      this.endPoint = env.url.substr(0, env.url.length - 1);
      this.listCred[index].urlImg = this.endPoint + this.listCred[index].data.document.imgfile_anonymous.url;
      this.listCred[index].urlDoc = this.endPoint + this.listCred[index].data.document.datafile_anonymous.url;
    }

    this.infoCertInit();

  }


  async verFoto(path) {

  /*   const modal = await this._modal.create({
      component: VerFotoComponent,
      componentProps: {
        img: path
      }
    });
    modal.onDidDismiss().then(async (res: any) => {
    });
    return await modal.present(); */

  }


  infoCertInit() {


    for (let index0 = 0; index0 < this.listCred.length; index0++) {
      this.listCred[index0].data.infoCert = [];
      let data = this.listCred[index0].data.data_cert.data;
      let objs = Object.keys(data);
      for (let index = 0; index < objs.length; index++) {

        let key = objs[index];
        

        if (key != 'objective_cert' && key != 'code_almc' && key != 'emisor_name'
          && key != 'emisor_did' && key != 'emisor_role' && key != 'titular_name'
          && key != 'name_titular' && key != 'adrx_titular' && key != 'f_emision'
          && key != 'f_vencimiento' && data[key] != "") {
          

          let caption = this.captionValue(key, this.listCred[index0].data.data_cert.dataScreen);
          let value = data[key]

          let cadena = '';

          if (data[key].value) {
            cadena = data[key].value;
          } else cadena = data[key];

          this.listCred[index0].data.infoCert.push({ caption, value: cadena });
        }
      }

    }

  }


  captionValue(key, estruct: any) {
    let a: any;
    let b: any = estruct;
    if (typeof estruct === 'string' || estruct instanceof String) {
      a = JSON.parse(b);
    } else {
      a = estruct;
    }


    

    let objs = Object.keys(a);
    

    let keyvalue = objs.filter(a => a == key)[0];
    

    return a[keyvalue].caption;

  }



/*   async credential(item) {
    const modal = await this._modal.create({
      cssClass: 'style-cred',
      component: CertComponent,
      componentProps: {
        credential: item
      }
    });

    modal.onDidDismiss().then(async (res: any) => {
      
    });
    return await modal.present();
  } */

  closeModal() {
    this._modal.dismiss();
  }

  confirm() {
    this._modal.dismiss({ confirm: true });
  }

}
