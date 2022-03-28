import { Component,OnInit} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import domtoimage from 'dom-to-image';

@Component({
  selector: 'app-get-cert',
  templateUrl: './get-cert.component.html',
  styleUrls: ['./get-cert.component.scss'],
})
export class GetCertComponent implements OnInit {

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = '';
  data: any = {};

  constructor(private _modal: ModalController) { }

  ngOnInit() {
/*     console.log('type', this.type); */
    let tx= this.data.data.document.credential.hashTransaction;
    this.value = 'https://explorer.lacchain.net/tx/' + tx;
    console.log(this.value);
    console.log(this.data);
  }

  convertToImage() {
    /*     let result = document.querySelector("#result"); */
    let container = document.querySelector("#container");

    domtoimage.toJpeg(container).then(dataUrl => {
      var img = new Image();
      img.src = dataUrl;
      /*       result.appendChild(img); */
      console.log('MOSTRAR IMG', img.src);

      var link = document.createElement('img');
      link.src = dataUrl;

      var link1 = document.createElement('img');
      link1.src = dataUrl;

      var link2 = document.createElement('img');
      link2.src = dataUrl;

      // Down below is to open another window with the picture in it and ready to print
      var WinPrint = window.open(
        "",
        "",
        "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0"
      );
    
      WinPrint.document.write(link.outerHTML);/* 
     WinPrint.document.write(link1.outerHTML);
     WinPrint.document.write(link2.outerHTML); */
      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
    })
  }

  closeModal() {
    this._modal.dismiss({ confirm: false });
  }

  confirm() {
    this._modal.dismiss({ confirm: true });
  }
}
