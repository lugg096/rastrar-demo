import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { Funciones } from 'src/app/compartido/funciones';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment as env } from 'src/environments/environment';

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

  @Input() trace: any = {
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
  }

  @Input() user: any;
  initEnd = false;
  indexSlide = 0;
  listCerts = [];
  endPoint = '';

  constructor(
    private _storage: StorageService,
    public router: Router,
    private _fun: Funciones,
    private _apiMongo: ApiMongoService) {
    this.getCertCooperativa();
  }

  ngOnInit() {
    /* this.endPoint = env.url.substr(0, env.url.length - 1); *///quitar el "/"
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
