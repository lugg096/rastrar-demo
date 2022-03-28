import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import html2canvas from 'html2canvas';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import domtoimage from 'dom-to-image';
import { sha256 } from 'js-sha256';

@Component({
  selector: 'app-get-did',
  templateUrl: './get-did.component.html',
  styleUrls: ['./get-did.component.scss'],
})
export class GetDidComponent implements OnInit {

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = '';
  data: any = {};
  type: any;

  serial = '';
  fechaValid = '';

  constructor(private _modal: ModalController) { }

  ngOnInit() {
    console.log('type', this.type);
    console.log('data', this.data);
    this.value = 'did:ethr:lacchain:' + this.data.data.dids[0].address + '#' + this.data.name+ '#' + this.data.data.idens[0].number;
    this.configSerial();
  }

  configSerial() {
    let hash1 = sha256('COOPECAN');
    hash1 = hash1.substr(0, 2) + hash1.substr(hash1.length - 3, 2);
    let hash2 = this.data.data.dids[0].address.substr(0, 4) + this.data.data.dids[0].address.substr(this.data.data.dids[0].address.length - 5, 4);
    let date = new Date();
    this.serial = hash1 + '-' + hash2 + '-' + date.getFullYear();
    this.fechaValid = '12/' + (date.getFullYear() - 2000 + 4);
    console.log('this.serial', this.serial);

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
    /*     let result = document.querySelector("#result"); */
    //let container = document.querySelector("#container");
    let container = document.getElementById("container");
    domtoimage.toJpeg(container).then(dataUrl => {
      var img = new Image();
      img.src = dataUrl;
      /*       result.appendChild(img); */
      console.log('MOSTRAR IMG', img.src);

      this.downloadImg(this.data.name, img.src);

      /* ********************** */

      /*   const contentType = 'image/png';
        const b64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
        
        const blob = this.b64toBlob(b64Data, contentType);
        const blobUrl = URL.createObjectURL(blob);
        
        let img2 :any= document.createElement('img');
        img2.src = blobUrl;
        console.log('MOSTRAR',img2);
        
        document.body.appendChild(img2);
  return; */

      /* *********************** */

      /*  var link = document.createElement('img');
       link.src = dataUrl; */

      /*  var link1 = document.createElement('img');
       link1.src = dataUrl;
 
       var link2 = document.createElement('img');
       link2.src = dataUrl; */

      // Down below is to open another window with the picture in it and ready to print
      /*  var WinPrint = window.open(
         "",
         "",
         "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0"
       );
       console.log('link.outerHTML',link.outerHTML);
       
 
       WinPrint.document.write(link.outerHTML);
       WinPrint.document.close();
       WinPrint.focus();
       WinPrint.print(); */
    })
  }


  /*   b64toBlob (b64Data, contentType='', sliceSize=512){
     const byteCharacters = atob(b64Data);
     const byteArrays = [];
   
     for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
       const slice = byteCharacters.slice(offset, offset + sliceSize);
   
       const byteNumbers = new Array(slice.length);
       for (let i = 0; i < slice.length; i++) {
         byteNumbers[i] = slice.charCodeAt(i);
       }
   
       const byteArray = new Uint8Array(byteNumbers);
       byteArrays.push(byteArray);
     }
   
     const blob = new Blob(byteArrays, {type: contentType});
     return blob;
   } 
   
   convertBase64ToBlobData(base64Data: string, contentType: string = 'image/png', sliceSize = 512) {
     const byteCharacters = atob(base64Data);
     const byteArrays = [];
 
     for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
       const slice = byteCharacters.slice(offset, offset + sliceSize);
 
       const byteNumbers = new Array(slice.length);
       for (let i = 0; i < slice.length; i++) {
         byteNumbers[i] = slice.charCodeAt(i);
       }
 
       const byteArray = new Uint8Array(byteNumbers);
 
       byteArrays.push(byteArray);
     }
 
     const blob = new Blob(byteArrays, { type: contentType });
     return blob;
   }*/

  closeModal() {
    this._modal.dismiss({ confirm: false });
  }

  confirm() {
    this._modal.dismiss({ confirm: true });
  }

}
