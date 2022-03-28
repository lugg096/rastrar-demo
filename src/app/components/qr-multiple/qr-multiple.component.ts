import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { IonicComponentsService } from 'src/app/services/ionic-components.service';
import domtoimage from "dom-to-image";
import { FormBuilder, FormGroup } from '@angular/forms';
import { sha256 } from 'Recursos/node_modules/js-sha256';

var imagenB64;



@Component({
  selector: 'app-qr-multiple',
  templateUrl: './qr-multiple.component.html',
  styleUrls: ['./qr-multiple.component.scss'],
})
export class QrMultipleComponent implements OnInit {

  /*   @ViewChild("container") container; */
  @ViewChild("container", { read: ElementRef, static: true }) container: ElementRef;
  trxid: any;
  title: any = '';


  dataAssociateQR: any;
  qrForm: FormGroup;

  constructor(
    private _modal: ModalController,
    public _storage: StorageService,
    public formBuilder: FormBuilder,
    /*     private socialSharing: SocialSharing,
        private clipboard: Clipboard, */
    public _comp: IonicComponentsService) {
    this.qrForm = this.formBuilder.group({
      correlativo: ''
    })
  }

  dataQR: any = 'errorCode';
  texto: any = '';

  subTitle: any = '';

  correlativo = 0;

  //http://localhost:8100/appComprador/#/code?id=d2e24c20484f65eeae0fb87e28987cceccb1e051158411bf5dfbc0cd41c9540f&i=1
  ngOnInit() {
    console.log('this.dataAssociateQR', this.dataAssociateQR);
    let secret = sha256('RASTRAR');
    this.correlativo = this.dataAssociateQR.correlative1;
    this.qrForm.controls['correlativo'].setValue(this.correlativo);
    this.dataQR = 'http://rastrar.com/appComprador/#/code?id=' + sha256(this.dataAssociateQR.key + secret) + '&i=' + this.dataAssociateQR.correlative1;
    console.log('codeQR', this.dataQR);
  }

  change(evento){
    console.log('Evento', evento.detail.value);
    this.correlativo = evento.detail.value;
    let secret = sha256('RASTRAR');
    this.dataQR = 'http://rastrar.com/appComprador/#/code?id=' + sha256(this.dataAssociateQR.key + secret) + '&i=' + evento.detail.value;
  }

  ngAfterViewInit() {

  }

  closeModal() {
    this._modal.dismiss({ dataPersonal: null });
  }

  continuar() {
    this._modal.dismiss({
      dataPersonal: {}
    });
  }


  async convertToImage() {
    return new Promise(async (resolve, reject) => {
      console.log('INICIO');

      let container = document.querySelector("#containerImg");
      let dataUrl: any = await domtoimage.toPng(container);

      console.log('dataUrl', dataUrl);

      /*      this.socialSharing.share(
             '',
             '',
             dataUrl,
             ''
           ); */
    });
  }


  copyText() {
    /*     this.clipboard.copy(this.dataQR); */
    this._comp.presentToast('Copiado', 'primary', 100);
  }

  async compartirDireccion() {

    /*     this.socialSharing.share(
          '',
          '',
          imagenB64,
          this.texto + ': ' + this.dataQR
        ); */
  }

}
