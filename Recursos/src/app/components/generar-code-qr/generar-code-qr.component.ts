import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { IonicComponentsService } from 'src/app/services/ionic-components.service';
import domtoimage from "dom-to-image";

var imagenB64;


@Component({
  selector: 'app-generar-code-qr',
  templateUrl: './generar-code-qr.component.html',
  styleUrls: ['./generar-code-qr.component.scss'],
})
export class GenerarCodeQRComponent implements OnInit {

  /*   @ViewChild("container") container; */
  @ViewChild("container", { read: ElementRef, static: true }) container: ElementRef;
  trxid: any;

  constructor(
    private _modal: ModalController,
    public _storage: StorageService,
    private socialSharing: SocialSharing,
    private clipboard: Clipboard,
    public _comp: IonicComponentsService) {
  }

  dataQR: any = 'errorCode';
  texto: any = '';
  title: any = '';
  subTitle: any = '';
  ngOnInit() {
    this.dataQR = 'https://rastrar.com/qr/'+  this.trxid;
    console.log('codeQR', this.dataQR);
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

      this.socialSharing.share(
        '',
        '',
        dataUrl,
        ''
      );
    });
  }


  copyText() {
    this.clipboard.copy(this.dataQR);
    this._comp.presentToast('Copiado', 'primary', 100);
  }

  async compartirDireccion() {

    this.socialSharing.share(
      '',
      '',
      imagenB64,
      this.texto + ': ' + this.dataQR
    );
  }

}
