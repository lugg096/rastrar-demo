import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { ViewMultimediaComponent } from '../view-multimedia/view-multimedia.component';
import { environment as env } from 'src/environments/environment';
import { ViewCertComponent } from '../../view-cert/view-cert.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-multimedia',
  templateUrl: './multimedia.component.html',
  styleUrls: ['./multimedia.component.scss'],
})
export class MultimediaComponent implements OnInit {


  @Input() data: any;
  @Input() user: any;
  @Input() viewDemo_pre = true;

  credSub: any = {
    portada: '',
    producers: [],
    sections: []
  };

  producer = [];
  multimedia = [];

  dataContact: any = {
    "businessName": {
      "width_bootstrap": "",
      "name": "",
      "type": "",
      "code": "",
      "value": ""
    },
    "logoUrl": {
      "width_bootstrap": "",
      "name": "",
      "type": "",
      "code": "",
      "value": ""
    }

  }

  constructor(
    private _sanitizer: DomSanitizer,
    public _apiMongo: ApiMongoService,
    public _modal: ModalController,) { }

  ngOnInit() {
    this.initData();
  }

  getVideoIframe(url) {
    var video, results;
 
    if (url === null) {
        return '';
    }
    results = url.match('[\\?&]v=([^&#]*)');
    video   = (results === null) ? url : results[1];
 
    return this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video+'?autoplay=1&mute=1');   
}

  async initData() {
    this.credSub = this.data.data.dataCred.credential.verifiableCredential[0].credentialSubject;
    this.producer = this.credSub.producers;
    console.log('this.producer', this.producer);



    console.log('credSub', this.credSub);

    for (let index = 0; index < this.credSub.sections.length; index++) {
      let sec: any = this.credSub.sections[index];
      let jsonData: any = {}
      if (sec.section.code == 'contact') {

        for (let index = 0; index < sec.fields.length; index++) {
          const field = sec.fields[index];
          jsonData[field.code] = field
          if (index == (sec.fields.length - 1)) {
            this.dataContact = jsonData;
            console.log('this.dataContact', this.dataContact);
          }
        }


      }


      for (let x = 0; x < sec.fields.length; x++) {
        let field = sec.fields[x];

        if (field.type == 'imageselect' && field.value.files.length > 0) {
          console.log('field', field);
          this.multimedia.push(field);

        }

        if (field.type == 'urlYouTube') {
          console.log('field urlYouTube', field);
          this.multimedia.push(field);

        }

      }

      if (index == (this.credSub.sections.length - 1)) console.log('this.multimedia', this.multimedia);
    }

    this.producer.forEach(prod => {


      prod.certs.forEach(cert => {
        let _d = {
          name: cert.title,
          lacchainId: cert.lacchainId,
          trxid: cert.trxid,
          imgfile: cert.imgfile,
          titular: prod.name
        }
        this.multimedia.push(_d);
      });
      console.log('prod', this.multimedia);
    });



  }



  async viewCert(dataProv) {
    const modal = await this._modal.create({
      cssClass: 'style-demo',
      component: ViewCertComponent,
      componentProps: {
        dataProv
      }
    });
    modal.onDidDismiss().then(async (res: any) => {
      console.log('res', res);

    });
    await modal.present();
  }


  async view(data) {
    console.log('data', data);
    if (data.trxid) {
      let res_cert: any = await this._apiMongo
        .filter(env.COLLECTION.document,
          env.TABLE_SIS.external,
          {
            "data.data_cert.tx.trxid": data.trxid
          });
      console.log('res_cert', res_cert.result[0].external[0]);
      this.viewCert(res_cert.result[0].external[0]);
      return;
    }

    const modal = await this._modal.create({
      cssClass: 'style-demo',
      component: ViewMultimediaComponent,
      componentProps: {
        data
        /*   titleReg: 'objective_cert',
          listSelect: this.registroForm.controls[field.code].value */
      }
    });
    modal.onDidDismiss().then(async (res: any) => {
      console.log('res', res);
      /*       if (this._fun.isVarInvalid(res.data)) return;
            this.imgPortada = res.data.img; */

    });
    await modal.present();

  }

}
