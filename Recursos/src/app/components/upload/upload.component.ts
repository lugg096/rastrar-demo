import { Component, ElementRef, Input, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment as env } from 'src/environments/environment';
import { sha256 } from 'js-sha256';
import { Funciones } from 'src/app/compartido/funciones';
import { DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';
import { ApiService } from 'src/app/services/api.service';
import { Web3jsService } from 'src/app/services/web3js.service';
import { Plugins, FilesystemDirectory, Capacitor } from '@capacitor/core';
const { Camera, Filesystem, Network } = Plugins;

/* Lottie  */
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import domtoimage from 'dom-to-image';
import { Router } from '@angular/router';
import { IonicComponentsService } from 'src/app/services/ionic-components.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {

  @ViewChild('bar', { read: ElementRef }) bar: ElementRef;
  private animationItem: AnimationItem;
  data: any;
  buttonConfim: string = '';
  textTitle: string = '';
  subtitle: string = '';
  type: string = '';// success | danger | alert
  env = env;
  options: AnimationOptions;
  pauseProgress = false;
  /*  dataCert: any = {};
   certData: any = {}; */
  lacchainId = 'STAMPING';
  imgCertUri = '';
  ipfsUri = '';

  constructor(
    public _comp: IonicComponentsService,
    public router: Router,
    private _apiMongo: ApiMongoService,
    private renderer: Renderer2,
    private web3js: Web3jsService,
    private api: ApiService,
    private storage: StorageService,
    private db: DatabaseService,
    private fun: Funciones,
    private ngZone: NgZone,
    private _modal: ModalController) { }

  dataCert: any = {
    adrx_titular: "",
    f_emision: "",
    f_vencimiento: "",
    img_reg: "",
    n_alpacas: "",
    objective_cert: "",
    prod_util: "",
    money_paid: '',
    amount: ''

  };


  certData: any = {
    code: '',
    codeReg: null,
    data: this.dataCert,
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


  ngOnInit() {
    this.configData();
  }

  async convertToImage() {
    return new Promise(async (resolve, reject) => {
      console.log('INICIO');

      let container = document.querySelector("#containerImg");
      let dataUrl: any = await domtoimage.toPng(container);

      console.log('dataUrl', dataUrl);

      var img = new Image();
      img.src = dataUrl;
      /*   console.log('MOSTRAR IMG', img.src); */
      /* ******************************* */

      let date = new Date(),
        time = date.getTime(),
        fileName = time + ".png";

      await Filesystem.writeFile({
        data: img.src,
        path: `${env.FOLDER_CERT}/${fileName}`,
        directory: FilesystemDirectory.Documents,
        recursive: true
      });

      //RUTA DE ARCHIVO
      const finalPhotoUri = await Filesystem.getUri({
        directory: FilesystemDirectory.Documents,
        path: `${env.FOLDER_CERT}/${fileName}`,
      });

      this.imgCertUri = Capacitor.convertFileSrc(finalPhotoUri.uri);
      console.log('this.imgCertUri', this.imgCertUri);

      let res_upload_datafile: any = await this._apiMongo.uploadFile(img.src.split(",")[1], 'png').toPromise();
      console.log('res_upload_datafile', res_upload_datafile.data.url);
      this.ipfsUri = res_upload_datafile.data.url;

      /* *********************** */
      this.dataBD.partyType = 2;//Productor
      this.dataBD.name = this.certData.title;
      this.dataBD.document.iat = this.certData.data.f_emision;
      this.dataBD.document.exp = this.certData.data.f_vencimiento;
      this.dataBD.document.purpose = this.certData.title;
      this.dataBD.document.issuer2 = this.certData.emisor_name;
      this.dataBD.document.subject = {
        name: this.certData.titular_name,
        data: {
          dids:
          {
            address: this.certData.data.adrx_titular
          }

        }
      };

      this.dataBD.document.documentType = {
        collection: "general",
        table: "type_documents",
        key: "C0",
        value: "Certificado"
      };

      this.dataBD.document.datafile = {
        name: this.certData.title,
        bytes: '',
        ext: 'png',
        url: this.ipfsUri,
        hash: sha256(img.src)
      };

      this.dataBD.document.imgfile = this.dataBD.document.datafile;


      /* *********************** */
      resolve(true);

    });
  }


  async datafile_anonymous() {
    return new Promise(async (resolve, reject) => {
      console.log('INICIO');

      let container = document.querySelector("#containerImg_anonymous");
      let dataUrl: any = await domtoimage.toPng(container);

      console.log('dataUrl', dataUrl);

      var img = new Image();
      img.src = dataUrl;

      let res_upload_datafile: any = await this._apiMongo.uploadFile(img.src.split(",")[1], 'png').toPromise();
      console.log('res_upload_datafile', res_upload_datafile.data.url);
      this.ipfsUri = res_upload_datafile.data.url;

      this.dataBD.document.datafile_anonymous = {
        name: this.certData.title,
        bytes: '',
        ext: 'png',
        url: this.ipfsUri,
        hash: sha256(img.src)
      };

      this.dataBD.document.imgfile_anonymous = this.dataBD.document.datafile_anonymous;

      resolve(true);

    });
  }


  getDataCert() {

    return new Promise(async (resolve, reject) => {
      console.log('this.data.....1', this.data);
      let cert: any = this.data.cert;
      this.certData = cert;
      console.log('cert.....1', cert);
      if (typeof cert.data === 'string' || cert.data instanceof String) this.certData.data = this.fun.toJson(cert.data);
      else this.certData.data = cert.data;
      console.log('this.certData', this.certData);

      if (typeof this.certData.tx === 'string' || this.certData.tx instanceof String) this.certData.tx = this.fun.toJson(this.certData.tx);
      else this.certData.tx = this.certData.tx;

      console.log('this.certData.tx', this.certData.tx);
      this.lacchainId = 'https://explorer.lacchain.net/tx/' + this.certData.tx.lacchainId;
      console.log(' this.lacchainId ', this.lacchainId);



      if(this.certData.certificateType=='C1' || this.certData.certificateType=='C2' ) this.imgCert = 'certificado.png';
      if(this.certData.certificateType=='C4') this.imgCert = 'boleta-cert.png';

      resolve(true)
    });

  }

  imgCert = '';

  async configData() {
    let connection: any = await Network.getStatus();
    if (!connection.connected) {
      await this.fun.alertError('No se encuentra con conexión a internet');
      this.closeModal();
      return;
    }

    console.log('data', this.data);
    if (this.data.cert.status == env.STATUS_REG.SAVED) this.firmar();
    else this.subir();
  }

  progress = 0;
  dataBD: any = {
    partyType: 2,
    name: '',
    data_cert: {},
    document: {
      iat: '',
      exp: '',
      purpose: '',
      issuer2: '',
      subject: '',
      documentType: '',
      datafile: {},
      imgfile: {},
      datafile_anonymous: {},
      imgfile_anonymous: {},

    }
  };


  async subir() {

    // SUBIR DATA CERT
    // this.data.cert.code <-- ID DE PANTALLA USADA
    // this.data.cert.id <-- ID UNICO DE CERTIFICADO CREADO 

    let dataImgB4 = [];
    this.dataBD.document.stamp_db = Math.floor(new Date().getTime() / 1000);//Momento en que se graba en bd, se compara con el incio del lote

    let images: any = await this.db.getData({ id_cert: this.data.cert.id, status: env.STATUS_REG.SAVED }, env.TABLE.IMG) || [];

    this.progress = 0;
    let pocentAdd_ = 50 / (images.length);

    let dataCert_res = await this.getDataCert();
    console.log('dataCert_res', dataCert_res);


    let imagesUrl = [];

    for (let index = 0; index < images.length; index++) {
      const img = images[index];
      console.log('img', img);
      let file: any = await Filesystem.readFile({ path: `${env.FOLDER_CERT}/${img.nameFile}`, directory: FilesystemDirectory.Documents });
      console.log('file_img', file);
      dataImgB4.push(file.data);

      let res_upload_datafile: any = await this._apiMongo.uploadFile(file.data, 'png').toPromise();
      imagesUrl.push(res_upload_datafile.data.url);

      this.progress += pocentAdd_;
      this.renderer.setStyle(this.bar.nativeElement, 'width', `${this.progress}%`);
      if (index == (images.length - 1)) {

        //Informacion de CERT lista para guardar
        this.dataBD.data_cert = this.data.cert;
        this.dataBD.imagesUrl = imagesUrl;


        /*   let img_saved_res = await this._apiMongo.create(env.COLLECTION.credential, env.TABLE_SIS.VCRegistry, this.data.cert.id, dataImg, true);
          console.log('img_saved_res', img_saved_res); */

        this.progress = 70;
        this.renderer.setStyle(this.bar.nativeElement, 'width', `${this.progress}%`);
        try {

          await this.datafile_anonymous();
          await this.convertToImage();
          this.progress = 85;
          this.renderer.setStyle(this.bar.nativeElement, 'width', `${this.progress}%`);

          const res: any = await this._apiMongo.create(env.COLLECTION.document, env.TABLE_SIS.external, this.data.cert.id, this.dataBD, false);
          if (this.fun.isVarInvalid(res.result)) {
            await this.fun.alertError(res.message);
            return;
          }
          this.progress = 100;
          this.renderer.setStyle(this.bar.nativeElement, 'width', `${this.progress}%`);

          this.closeModal();
          await this.fun.alert(env.MSG.TYPE_SUC, ' Ok ', env.MSG.SUC_TITLE, 'La acción fue completada correctamente');
          this.closeModal();
          let updateCert = await this.db.updateData({ status: env.STATUS_REG.UPLOADED, img_cert: this.imgCertUri, img_ipfs: this.ipfsUri }, { condition: { id: this.data.cert.id }, type: 'ONE' }, env.TABLE.CERT);

        } catch (error) {
          await this.fun.alertError(error);
        }
      }
    }

    if (images.length == 0) {

      //Informacion de CERT lista para guardar
      this.dataBD.data_cert = this.data.cert;
      await new Promise(f => setTimeout(f, 1500));

      await this.datafile_anonymous();
      await this.convertToImage();
      this.progress = 85;
      this.renderer.setStyle(this.bar.nativeElement, 'width', `${this.progress}%`);

      const res: any = await this._apiMongo.create(env.COLLECTION.document, env.TABLE_SIS.external, this.data.cert.id, this.dataBD, false);
      if (this.fun.isVarInvalid(res.result)) {
        await this.fun.alertError(res.message);
        return;
      }
      this.progress = 100;
      this.renderer.setStyle(this.bar.nativeElement, 'width', `${this.progress}%`);

      this.closeModal();
      await this.fun.alert(env.MSG.TYPE_SUC, ' Ok ', env.MSG.SUC_TITLE, 'La acción fue completada correctamente');
      this.closeModal();
      let updateCert = await this.db.updateData({ status: env.STATUS_REG.UPLOADED, img_cert: this.imgCertUri, img_ipfs: this.ipfsUri }, { condition: { id: this.data.cert.id }, type: 'ONE' }, env.TABLE.CERT);

    }

  }



  dividirFile(strB64_G: string, varDiv_G: number) {
    let lengthB64_G = strB64_G.length;
    /* DIVIDIR ARCHIVO EN PARTES */
    let resto_G = lengthB64_G % varDiv_G;
    let lengthBloque_G = (lengthB64_G - resto_G) / varDiv_G;
    let arrayB64_G = [];
    /*     console.log('lengthB64', lengthB64_G); */
    for (let index = 0; index < varDiv_G; index++) {
      if (index != (varDiv_G - 1)) arrayB64_G.push(strB64_G.substring(index * lengthBloque_G, (index * lengthBloque_G) + lengthBloque_G));
      else arrayB64_G.push(strB64_G.substring(index * lengthBloque_G, (index * lengthBloque_G) + lengthBloque_G + resto_G));
    }
    return arrayB64_G;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async firmar() {
    /*  this.fun.progress({ cert: { status: 2 } });
     this.closeModal();
     return; */
    let userSesion: any = await this.storage.getLocalStorage('DATA');
    console.log('userSesion', userSesion);

    const res: any = await this._apiMongo.filter(env.COLLECTION.party, env.TABLE_SIS.employee, { 'data.email': userSesion.email, 'data.password': userSesion.password });
    console.log('res', res);
    if (this.fun.isEmpty(res.result)) {
      this.storage.clearStorage();
      this.router.navigate(['/home']);
      await this.fun.alertError('Usuario fue eliminado por el adminstrador del sistema');
      return;
    }

    const user_res = res.result[0][env.TABLE_SIS.employee][0];
    console.log('USUARIo', user_res);

    if (!user_res.status) {
      this.storage.clearStorage();
      this.router.navigate(['/home']);
      this._comp.presentToast('Usuario fue deshabilitado', 'danger', 1500);
      return;
    }

    console.log('INICIO DE FIRMA');

    let token = await this.storage.getLocalStorage('TOKEN');

    let certToStr = JSON.stringify(this.data.cert);
    console.log('certToStr', certToStr)
    console.log('this.data', this.data);
    console.log('token', token);

    //FORMCERT
    let dataForm = JSON.parse(this.data.cert.data);

    dataForm.emisor_did = this.data.cert.emisor_did;

    console.log('dataForm', dataForm);


    let body: any = {
      id: this.data.cert.code_card,//did(TOTAL) titular
      idcredential: this.data.cert.id, //id credential
      url: "",//B64 cert
      mode:"mini",
      urltype: "img",//pdf o img o html
      validFrom: dataForm.f_emision,//emision
      validTo: dataForm.f_vencimiento,//Vencimiento
      data: this.data.cert.certificateType == "C2" ?  dataForm  : JSON.stringify(dataForm) 
    }

 /*   let body2 = {
      "id":"ID_PACIENTE",
      "idcredential":"@uuid",
      "mode":"normal",
      "validFrom":"89000000000",
      "validTo":"9900000000",
      "data":{}
      } */


    /* {
"data": "{\"objective_cert\":\"Ex MP\",\"adrx_titular\":\"}",
"id": "did:ethr:lacchain:0xCbaC00890b981bC49d8B11c294ab673Db01faA4D#Juan Carlos Cabanillas",
"idcredential": "ec6f9825e882381e8edc4e87c3d195590fd2b3d2f0bce2b9cdcedba6be658ea3",
"url": "",
"urltype": "img",
"validFrom": 1639198800,
"validTo": 1640840400
  } */

    if (this.data.cert.contract_card != '') body.contract_card = this.data.cert.contract_card;

    this.api.certificate(token, body, this.data.cert.certificateType == "C2" ? true : false).subscribe(async (res: any) => {
      console.log('DATA RETURN', res);

      if (this.fun.isInvalidResApi(res.code)) {
        this.closeModal();
        await this.fun.alert(env.MSG.TYPE_ERROR, 'ok', env.MSG.ERROR_TITLE, res.message);
        return;
      }

      console.log('PASO...........2');
      this.data.cert.tx = JSON.stringify(res);

      let updateCert = await this.db.updateData({ tx: JSON.stringify(res), status: env.STATUS_REG.SIGNED }, { condition: { id: this.data.cert.id }, type: 'ONE' }, env.TABLE.CERT);

      console.log('updateCert', updateCert);
      /* 
      *
      *
       */
      this.data.cert.status = env.STATUS_REG.SIGNED;

      this.fun.progress(this.data);
      this.closeModal();

    }, async err => {
      this.closeModal();
      await this.fun.alert(env.MSG.TYPE_ERROR, 'ok', env.MSG.ERROR_TITLE, err);
    })
  }



  closeModal() {
    this._modal.dismiss();
  }

  confirm() {
    this._modal.dismiss({ confirm: true });
  }

  stop(): void {
    this.ngZone.runOutsideAngular(() => this.animationItem.stop());
  }

  play(): void {
    this.ngZone.runOutsideAngular(() => this.animationItem.play());
  }

  pause(): void {
    this.ngZone.runOutsideAngular(() => this.animationItem.pause());
  }

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
  }
}
