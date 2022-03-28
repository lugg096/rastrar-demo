import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { sha256 } from 'js-sha256';
import { IonicComponentsService } from 'src/app/services/ionic-components.service';

@Component({
  selector: 'app-pin-access',
  templateUrl: './pin-access.component.html',
  styleUrls: ['./pin-access.component.scss'],
})
export class PinAccessComponent implements OnInit {

  constructor(
    public _comp: IonicComponentsService,
    public _storage: StorageService,
    private _modal: ModalController) { }
  data: any;
  type: any;

  ngOnInit() {
    if (this.type != 'onlyPIN') this.getData();
  }

  async getData() {
    this.data = await this._storage.getLocalStorage('DATA');
  }

  closeModal(privateKey?) {
    this._modal.dismiss({
      privateKey
    });
  }

  getOnlyPIN() {

  }

  /* PIN */
  public dataSlideValid = {
    titulo: "Seguridad",
    subTitulo: "Ingresar ePIN",
    texto: "Ingrese ePIN de 6 dígitos"
  }

  pin = '';

  async getClave($event) {
    if (this.type == 'onlyPIN') {
      this.closeModal($event); return;
    }

    this.pin = $event;
    let hash_PINsha256 = sha256(sha256(this.pin.toString()));
    if (hash_PINsha256 == this.data.pin) {

      let position = Number(this.pin.substr(0, 2));
      if (position > 62) position = position - 62;
      if (position == 0) position = 2;
      let n1 = Number(this.pin.substr(2, 2));
      let n2 = Number(this.pin.substr(4, 2))

      let dataSegure = this.data.privateKey.substr(62, this.data.privateKey.length);
      let number01 = Number(dataSegure.split("G")[0]) - n1;
      let number02 = Number(dataSegure.split("G")[1]) - n2;

      let privateKey = this.data.privateKey.substr(0, position)
        + number01.toString(16) + number02.toString(16) + this.data.privateKey.substring(position, 62);
      this.closeModal(privateKey);

    } else this._comp.presentToast('El PIN no es correcto', 'danger', 2000);

  }

}
