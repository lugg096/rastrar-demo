import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-demo-inicio',
  templateUrl: './demo-inicio.component.html',
  styleUrls: ['./demo-inicio.component.scss'],
})
export class DemoInicioComponent implements OnInit {

  constructor(private _modal: ModalController) { }
  page = 'info';
  user:any;
  trace:any;
  ngOnInit() {
  }

  permisoLogin(data) {
    this.page = 'process';

  }

  closeModal() {
    this._modal.dismiss({ confirm: false});
  }

  confirm() {
    this._modal.dismiss({ confirm: true});
  }

}
