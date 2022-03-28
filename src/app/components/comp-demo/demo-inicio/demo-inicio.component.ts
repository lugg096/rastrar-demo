import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-demo-inicio',
  templateUrl: './demo-inicio.component.html',
  styleUrls: ['./demo-inicio.component.scss'],
})
export class DemoInicioComponent implements OnInit {

  constructor(private _modal: ModalController) { }
  data: any;


  viewDemo_pre = true;
  dataVenta: any;
  dataProduct: any;
  dataProcedencia: any;

  page = 'info';
  user: any;
  trace: any;
  ngOnInit() {
    console.log('DATA PRINCIPAL',this.data);
    
  }

  permisoLogin(data) {
    this.page =data;
  }

  closeModal() {
    this._modal.dismiss({ confirm: false });
  }

  confirm() {
    this._modal.dismiss({ confirm: true });
  }

}
