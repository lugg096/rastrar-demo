import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ModalController } from '@ionic/angular';
import { sha256 } from 'js-sha256';
import { Funciones } from 'src/app/compartido/funciones';
import { GenerarCodeQRComponent } from 'src/app/components/generar-code-qr/generar-code-qr.component';
import { DataService } from 'src/app/services/data-service.service';
import { environment as env } from 'src/environments/environment';
import domtoimage from 'dom-to-image';
import { Plugins, CameraResultType, CameraSource, FilesystemDirectory, Capacitor } from '@capacitor/core';
import { DatabaseService } from 'src/app/services/database.service';
import { CaptureImagesComponent } from 'src/app/components/capture-images/capture-images.component';
const { Camera, Filesystem } = Plugins;

@Component({
  selector: 'app-certificado',
  templateUrl: './certificado.page.html',
  styleUrls: ['./certificado.page.scss'],
})
export class CertificadoPage implements OnInit {

  constructor(
    private db: DatabaseService,
    private _modal: ModalController,
    private _data: DataService,
    private _fun: Funciones,
    private socialSharing: SocialSharing,
    public router: Router) { }

  ngOnInit() {
    this.getData();
  }

  certData: any = {
  };

  /*  certData = {
      code: "592ca3ae72bc065c49254e8272dcfaac6752bf4a8d3093d3a44e2a2a47a91696",
      codeReg: null,
      data: {
        amount: '200',
        money_paid: '150',
        adrx_titular: "0xeAaA10e4b20427a45724CB40bFe78D1E65d14F87",
        f_emision: "2021-07-10",
        f_vencimiento: "2021-07-31",
        img_reg: "1 fotos",
        n_alpacas: "30",
        objective_cert: "pirmanana",
        prod_util: "ppppapapao"
      },
  
      certificateType: 'C2',
    
      emisor_did: "0x4F19a689447Aa68c6501D5310E19F2b49b9c22E6",
      emisor_name: "EMPLEADO 01",
      emisor_role: "Técnico sanitario",
      titular_name: 'Luiggi Vargas Sacsahuillca',
      frecord: "1625788007545000",
      fsend: "",
      id: "c20aeec84c136dd69053ce9191b81a29bb4497c44dcd240317d7b904f21b2f62",
      status: 3,
      title: "Registro Sanitario Técnico",
      tx: {
        trxid: 'c20aeec84c136dd69053ce9191b81a29bb4497c44dcd240317d7b904f21b2f62'
      }
    }  */

  data: any = {
    adrx_titular: "",
    f_emision: "",
    f_vencimiento: "",
    img_reg: "",
    n_alpacas: "",
    objective_cert: "",
    prod_util: ""
  };

  /*  certData: any = {
     code: '',
     codeReg: null,
     data: this.data,
     emisor_did: '',
     emisor_name: '',
     emisor_role: '',
     titular_name: '',
     frecord: '',
     fsend: '',
     id: '',
     status: '',
     title: '',
     tx: '',
     certificateType: ''
   } */

  url_cert = '';
  trxid = '';
  lacchainId = 'null';
  imgB64: any = '';

  infoCert = [];
  photoPreview = [];

  getData() {
    this.certData = {
      code: '',
      codeReg: null,
      data: this.data,
      emisor_did: '',
      emisor_name: '',
      emisor_role: '',
      titular_name: '',
      frecord: '',
      fsend: '',
      id: '',
      status: '',
      title: '',
      tx: '',
      certificateType: ''
    };

    this.data = {
      adrx_titular: "",
      f_emision: "",
      f_vencimiento: "",
      img_reg: "",
      n_alpacas: "",
      objective_cert: "",
      prod_util: ""
    };

    this._data.getData().subscribe(async cert => {
      console.log('cert', cert);

      this.infoCertInit(cert);
      if (this._fun.isVarInvalid(cert)) return;
      this.certData = cert;
      this.getImages(this.certData.id);
      if (typeof cert.data === 'string' || cert.data instanceof String) this.certData.data = this._fun.toJson(cert.data);
      else this.certData.data = cert.data;
      console.log('this.certData', this.certData);


      let nameFile = this.certData.img_cert.split(`${env.FOLDER_CERT}/`)[1];
      this.imgB64 = await Filesystem.readFile({
        path: `${env.FOLDER_CERT}/${nameFile}`,
        directory: FilesystemDirectory.Documents
      });

      console.log('this.imgB64', this.imgB64);



      if (typeof this.certData.tx === 'string' || this.certData.tx instanceof String) this.certData.tx = this._fun.toJson(this.certData.tx);
      else this.certData.tx = this.certData.tx;


/*       console.log('this.certData.tx', this.certData.tx); */


      this.trxid = this.certData.tx.trxid;
      this.lacchainId = 'https://explorer.lacchain.net/tx/' + this.certData.tx.lacchainId;
      console.log(' this.lacchainId ', this.lacchainId);
   
      console.log('URL GENERADO', this.url_cert);

    });
  }


  async imagesCapture() {
    const modal = await this._modal.create({
      component: CaptureImagesComponent,
      componentProps: {
        idCert: this.certData.id,
        field: {},
        photoPreview: this.photoPreview,
        idPhotoRemove: [],
        onlyView: true
      }
    });

    modal.onDidDismiss().then(async (res: any) => {
      console.log('res', res);

    });
    return await modal.present();
  }


  async getImages(id) {
    await this.db.getData({ id_cert: id, status: env.STATUS_REG.SAVED }, env.TABLE.IMG).then(res => {
      console.log('IMAGES', res);
      this.photoPreview = res;
    });
  }

  infoCertInit(cert) {
    this.infoCert = [];
    if (typeof cert.dataScreen === 'string' || cert.dataScreen instanceof String) {
      let data = this._fun.toJson(cert.dataScreen)
      let objs = Object.keys(data);
      for (let index = 0; index < objs.length; index++) {

        let key = objs[index];
        console.log('key', key);

        if (key != 'objective_cert' && key != 'code_almc' && key != 'emisor_name'
          && key != 'emisor_did' && key != 'emisor_role' && key != 'titular_name'
          && key != 'name_titular' && key != 'adrx_titular' && key != 'f_emision'
          && key != 'f_vencimiento' && data[key].value != "") {
          console.log('data[key]', data[key]);

          this.infoCert.push(data[key]);
        }
      }
    }

  }

  presentar() {
/*     let currentDate = new Date();
    let timestamp = currentDate.getTime(); */
    let currentDate = new Date();
    let timestamp = currentDate.getTime();
    let token = sha256(timestamp + this.trxid + '339f0c28e58986254d1707a3a10efc2f9bb0bec96c1c13dcce1779578fc3afd2');

    this.url_cert = env.url + 'cert/' + this.trxid + '/?mode=credential&token=' + token + '_'+timestamp;


    this._modal.create({
      component: GenerarCodeQRComponent,
      componentProps: {
        codeQR: this.url_cert,
        texto: 'Credencial',
        subTitle: 'Este QR permite transferir la credencial verificable a una billetera digital que soporte EIP712 / EIP1812 usando un link de un solo uso.'
      }
    }).then((modal) => modal.present());

  }

  dasherize(string) {
    return string.replace(/[A-Z]/g, function (char, index) {
      return (index !== 0 ? '-' : '') + char.toLowerCase();
    });
  };

  goGestion() {
    this.router.navigate(['gestion']);
  }

  verCertificado() {
    console.log('VER CERTIFICADO');
  }

  compartir() {
    this.socialSharing.share(
      '',
      '',
      'data:image/jpeg;base64,' + this.imgB64.data,
      this.certData.title + ' otorgado a ' + this.certData.titular_name
    );
  }


  downloadImg(name, IMGb64) {
    const linkSource = IMGb64;
    const downloadLink = document.createElement("a");
    const fileName = name + '.jpeg';

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();

  }


  convertToImage() {
    let container = document.querySelector("#containerImg");
    domtoimage.toJpeg(container).then(dataUrl => {
      var img = new Image();
      img.src = dataUrl;
      console.log('MOSTRAR IMG', img.src);
      /* this.compartir(img.src); */
      /*  this.downloadImg(this.data.name, img.src); */

    })
  }
}
