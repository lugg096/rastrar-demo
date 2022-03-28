import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { sha256 } from 'js-sha256';
import { AppComponent } from 'src/app/app.component';
import { Funciones } from 'src/app/compartido/funciones';
import { GenerarCodeQRComponent } from 'src/app/components/generar-code-qr/generar-code-qr.component';
import { DatabaseService } from 'src/app/services/database.service';
import { IonicComponentsService } from 'src/app/services/ionic-components.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    public _comp: IonicComponentsService,
    private db: DatabaseService,
    private appComp: AppComponent,
    private fun: Funciones,
    private storage: StorageService,
    public router: Router,
    private _modal: ModalController) { }

  user: any = {
    name: '',
    email: '',
    role: {
      value: ''
    },
    idens: [
      { type_name: '', number: '' }
    ],
    publicKey: '',
  };
  ngOnInit() {

  }

  ionViewDidEnter() {
    this.getUser();
  }

  async getUser() {
    /*     this.user = await this.storage.getLocalStorage('DATA'); */
    this.user = this.appComp.user;
    console.log('user...........1', this.user);

  }

  async getPrivateKey() {
    let data: any = await this.fun.accessPin();
    console.log('privateKey', data.privateKey);
    if (data.privateKey) this.generarQR({ value: data.privateKey, text: 'Llave privada' });
  }

  async changePin() {
    let data: any = await this.fun.accessPin();
    console.log('privateKey', data.privateKey);
    if (this.fun.isVarInvalid(data.privateKey)) return;

    let dataSlideValid = {
      titulo: "Seguridad",
      subTitulo: "Ingrese nuevo ePIN",
      texto: "Ingrese ePIN de 6 dígitos"
    };

    let data_newPin: any = await this.fun.accessPin('onlyPIN', dataSlideValid);
    console.log('newPin', data_newPin.privateKey);
    if (this.fun.isVarInvalid(data_newPin.privateKey)) return;

    let pin = data_newPin.privateKey.toString();
    let privateKey = data.privateKey;

    let newPin;
    let newPrivateKey;
    

    newPin = sha256(sha256(pin));

    console.log('pin',pin);
    
    let position = Number(pin.substr(0, 2));
    if (position > 62) position = position - 62;
    if (position == 0) position = 2;
    let n1 = Number(pin.substr(2, 2));
    let n2 = Number(pin.substr(4, 2))

    console.log('privateKey',privateKey);
    let str = privateKey.substr(position, 4);

    console.log('str',str);
    let hex1 = str.substr(0, 2);
    let number1 = parseInt(hex1, 16) + n1;

    let hex2 = str.substr(2, 2);
    let number2 = parseInt(hex2, 16) + n2;

    console.log('privateKey...2',privateKey);
    newPrivateKey = privateKey.substr(0, position) +
      privateKey.substr(position + 4, privateKey.length) +
      number1 + 'G' + number2;

    /*  const loading: any = await this._comp.presentLoading(); */

    let updateCert = await this.db.updateData({ privateKey: newPrivateKey, pin: newPin }, { condition: { id: this.user.id }, type: 'ONE' }, env.TABLE.USER);

    let user = await this.storage.getLocalStorage('DATA');
    user.pin = newPin;
    user.privateKey = newPrivateKey;
    await this.storage.setLocalStorage('DATA', user);
    this._comp.presentToast('Su ePIN de seguridad fue actualizado ', 'success', 2000);
  }



  async getClaveValid($event) {

  }


  goGestion() {
    this.router.navigate(['gestion']);
  }


  generarQR(data) {
    this._modal.create({
      component: GenerarCodeQRComponent,
      componentProps: {
        codeQR: data.value,
        texto: data.text,
      }
    }).then((modal) => modal.present());
  }
}
