import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-imagen',
  templateUrl: './select-imagen.component.html',
  styleUrls: ['./select-imagen.component.scss'],
})
export class SelectImagenComponent implements OnInit {

  constructor(private _modal: ModalController) { }

  ngOnInit() { }


  closeModal() {
    this._modal.dismiss();
  }

  confirm(img) {
    this._modal.dismiss({ confirm: true, img });
  }
}
