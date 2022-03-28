import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { Funciones } from 'src/app/compartido/funciones';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment as env } from 'src/environments/environment';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-infolot',
  templateUrl: './infolot.component.html',
  styleUrls: ['./infolot.component.scss'],
})
export class InfolotComponent implements OnInit {

  @ViewChild('slidesDatos', { static: false }) private slidesDatos: IonSlides;

  @ViewChild("video") video: ElementRef; // binds to #video in video.html
  videoElement: HTMLVideoElement

  ionViewDidLoad() {
    this.videoElement = this.video.nativeElement;
    this.videoElement.play();
  }


  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    speed: 700,
    autoplay: {
      delay: 4000,
    },
  };

  /*   @Input() trace: any = {
      credentialSubject: {
        details: [],
        header: {
          attributes: {
            country_source: "",
            country_source_key: "",
            country_target: "",
            country_target_key: "",
            delivery_date: null,
            notes: "",
            order_date: null,
            product_type: "",
            product_type_key: "",
            quantity: 0,
            reference_key: "",
            sku: "",
            unit: "",
            via_type: "",
            via_type_key: "",
          }
        }
      }
    } */

  @Input() data: any;
  @Input() user: any;
  initEnd = false;
  indexSlide = 0;
  listCerts = [];
  endPoint = '';

  constructor(
    private _sanitizer: DomSanitizer,

    private _storage: StorageService,
    public router: Router,
    private _fun: Funciones,
    private _apiMongo: ApiMongoService) {
    this.getCertCooperativa();
  }

  dataBasic: any = {
    portada: '',
    objective_cert: '',
    amount: '',
    f_vencimineto: '',
    origin: '',
    destination: '',
    buyer: ''
  };

  producer = [];

  playerConfig = {
    controls: 0,
    mute: 1,
    autoplay: 1
  };

  ngOnInit() {
    this.initData2();
  }

  getVideoIframe(url) {
    var video, results;
 
    if (url === null) {
        return '';
    }
    results = url.match('[\\?&]v=([^&#]*)');
    video   = (results === null) ? url : results[1];
 
    return this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video+'?autoplay=1');   
}


  dataInfCom = [];
  dataInfProd = [];



  sections = [];

  credSub: any = {
    portada: '',
    producers: [],
    sections: []
  };

  /*   multimedia = []; */

  @Input() viewDemo_pre = true;

  async initData2() {
    this.credSub = this.data.data.dataCred.credential.verifiableCredential[0].credentialSubject;
    this.dataBasic.portada = this.credSub.portada;
    this.producer = this.credSub.producers;
    console.log('credSub', this.credSub);

    for (let index = 0; index < this.credSub.sections.length; index++) {
      let sec: any = this.credSub.sections[index];

      if (sec.section.code == 'infoProd') {
        this.dataInfProd = sec.fields;
      }

      if (sec.section.code == 'infoComer') {
        for (let x = 0; x < sec.fields.length; x++) {
          let field = sec.fields[x];
          if (this.dataBasic[field.code] != undefined) this.dataBasic[field.code] = field.value;
          if (field.code != 'objective_cert' && field.code != 'buyer' &&
            field.code != 'amount' && field.code != 'origin' && field.code != 'destination' &&
            field.code != 'f_emision' && field.code != 'f_vencimineto') this.dataInfCom.push(field);
        }
      }else if(sec.fields.length>0 && sec.section.code != 'contact') this.sections.push(sec);
      
     
      if(index == (this.credSub.sections.length-1)) console.log('this.sections',this.sections);
      

      /*       if(index == (this.credSub.sections.length-1)) console.log('this.multimedia',this.multimedia); */

    }
  }

  async initData() {

    if (this.viewDemo_pre) {
      this.dataBasic = this.data.jsonForms;
      this.producer = this.data.jsonForms.producers;
    } else {
      this.dataBasic = this.data.data.dataCredential.credential.verifiableCredential[0].credentialSubject;
      this.producer = this.data.data.dataCredential.credential.verifiableCredential[0].credentialSubject.producers;
    }

    console.log('this.producer ', this.producer);
    let dataRes: any = await this.configData();
    console.log('dataRes', dataRes);

    dataRes.forEach(elm => {
      if (elm.section.code == 'infoComer') {
        elm.fields.forEach(fld => {
          if (fld.code != 'objective_cert' && fld.code != 'buyer' &&
            fld.code != 'amount' && fld.code != 'origin' && fld.code != 'destination' &&
            fld.code != 'f_emision' && fld.code != 'f_vencimineto') this.dataInfCom.push(fld);
        });
      }

      if (elm.section.code == 'infoProd') this.dataInfProd = elm.fields;
    });
  }



  configData() {
    return new Promise((resolve, reject) => {

      let dataForm = [];
      if (this.viewDemo_pre) dataForm = this.data.dataForm;
      else dataForm = this.data.data.dataForm;

      let data_make = [];
      for (let x = 0; x < dataForm.length; x++) {
        let form1 = dataForm[x];
        let jsonValue = form1.formValue;

        let dataF = {
          section: form1.section,
          fields: []
        };

        if (!jsonValue && (x == (dataForm.length - 1))) resolve(data_make);
        if (!jsonValue) continue;

        let count = 0;
        for (var key in jsonValue) {
          let field: any = form1.fields.filter(r => r.code == key)[0];
          if (jsonValue[key].key) field.value_r = jsonValue[key].value;
          else field.value_r = jsonValue[key];

          dataF.fields.push(field);
          if (count == (Object.keys(jsonValue).length - 1)) {
            data_make.push(dataF);
            if (x == (dataForm.length - 1)) resolve(data_make);
          }
          count++;
        }
      }
    });
  }




  prueba(data) {

  }

  async getCertCooperativa() {
    let dateNow = Math.floor(new Date().getTime() / 1000);

    try {
      /*       const res: any =
              await this._apiMongo.filter(env.COLLECTION.document, env.TABLE_SIS.external,
                {
                  'data.document.subject.data.dids.address': env.KEY_COOPERATIVA,
                  "data.document.stamp_db": { "$lte": dateNow },
                  "data.document.iat": { "$lte": dateNow },
                  "data.document.exp": { "$gt": dateNow }
      
                });
            if (this._fun.isEmpty(res.result)) {
              return;
            }
            this.listCerts = res.result[0][env.TABLE_SIS.external]; */

    } catch (error) {
      await this._fun.alertError(error);
    }
  }

  verSlide() {
    this.slidesDatos.getActiveIndex().then(res => {
      if (!this.initEnd) this.indexSlide = res;
      this.initEnd = false;
    });
  }

  endSlide() {
    this.initEnd = true;
    this.indexSlide = 2;
  }

  async sesion() {
    /*     let res: any;
        if (this.user == 'INVITADO') res = await this._fun.alertGen('Iniciar sesión', 'Desea iniciar sesion?');
        else res = await this._fun.alertGen('Si, cerrar', 'Desea cerrar sesión?');
        if (this._fun.isVarInvalid(res)) return;
        await this._storage.remove('USER');
        this.router.navigate(['/login']); */

  }

}
