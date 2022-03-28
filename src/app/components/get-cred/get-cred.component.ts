import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { environment as env } from 'src/environments/environment';
@Component({
  selector: 'app-get-cred',
  templateUrl: './get-cred.component.html',
  styleUrls: ['./get-cred.component.scss'],
})
export class GetCredComponent implements OnInit {

  constructor(private _modal: ModalController,) { }

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = "";
  data: any;
  tx = '';
  urlImg = '';
  urlDoc = '';

  ngOnInit() {
    console.log('this.data', this.data);
    let endPoint = env.url.substr(0, env.url.length - 1);//quitar el "/"
    this.urlImg = endPoint + this.data.data.document.imgfile.url;
    this.urlDoc = endPoint + this.data.data.document.datafile.url;
    console.log('urlImg',this.urlImg);

  }

  closeModal() {
    this._modal.dismiss({ confirm: false });
  }

  confirm() {
    this._modal.dismiss({ confirm: true });
  }


}
