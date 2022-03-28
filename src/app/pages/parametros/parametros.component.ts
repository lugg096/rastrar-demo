import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Funciones } from 'src/app/compartido/funciones';
import { CreateTableComponent } from 'src/app/components/create-table/create-table.component';
import { ApiMongoService } from 'src/app/services/apiMongo.service';

import { environment as env } from 'src/environments/environment';
@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.scss'],
})
export class ParametrosComponent implements OnInit {

  list_main = [];
  pageOfItems: Array<any>;
  list = [];
  load = false;

  nameFilter = '';

  orderBy = {
    key: '',
    order: true
  }

  thead = [
    { key: 'key', name: 'Tabla' },
    { key: 'name', name: 'Descripción' },
    { key: 'count', name: 'N° de registros' },
    { key: 'status', name: 'Estado' },
  ];

  optionFilter = [
    { key: 'key', value: '', type: 'string' },
    { key: 'status', value: false, type: 'boolean' }
  ];

  constructor(
    private _apiMongo: ApiMongoService,
    private _fun: Funciones,
    private _mod: ModalController,
    public router: Router) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getList();
  }


  async getList() {
    this.load = true;
    try {
      const res: any = await this._apiMongo.get(env.COLLECTION.general, env.TABLE_SIS.tables, 'items');
      if (this._fun.isEmpty(res.result)) {
        this.load = false;
        return;
      }
      this.list_main = res.result[0].tables;

      this.list_main.forEach(item => {
        item.count = item.data.properties.count;
      });
      this.list = this.list_main;

      console.log('this.list ', this.list);

      this.filter();
      this.orderBy.order = true;
      this.orderBy.key = '';
      this.orderByTable('key');

      this.load = false;
    } catch (error) {
      this.load = false;
      await this._fun.alertError(error);
    }
  }


  changeInput(value, index, type) {
    if (type == 'checkbox') {
      value = value.detail.checked;
    }

    this.optionFilter[index].value = value;
    this.filter();
  }

  filter() {
    this.list = this.list_main.filter(a => {

      let filter1 = true;
      let filter2 = true;

      for (let index = 0; index < this.optionFilter.length; index++) {
        var itemf: any = this.optionFilter[index];

        if (itemf.type == 'string') {
          filter1 = a[itemf.key].toLowerCase().indexOf(itemf.value.toLowerCase()) != -1;
        }

        if (itemf.type == 'boolean') {
          if (a[itemf.key]) filter2 = true;
          else filter2 = itemf.value;
        }
      }
      return filter1 && filter2;
    });
    this.orderList();
  }

  orderByTable(key) {
    if (this.orderBy.key == key) {
      this.orderBy.order = !this.orderBy.order;
    } else {
      this.orderBy.order = true;
    }
    this.orderBy.key = key;
    this.orderList();
  }

  orderList() {
    let listOrder = this._fun.sortJSON(this.list, this.orderBy.key, this.orderBy.order);
    this.list = listOrder.filter(item => true);
  }

  registros(key) {
    this.router.navigate(['table-reg/' + key]);
  }

  async changeStatus(key, status) {

    let alert = await this._fun.alertChangStatus(status);
    if (this._fun.isVarInvalid(alert)) return;

    try {
      await this._apiMongo.changeStatus(env.COLLECTION.general, env.TABLE_SIS.tables, key, status);
      this.getList();
      await this._fun.alertSucc(status ? env.MSG.SUC_ENABLED : env.MSG.SUC_DISABLED);
    } catch (error) {
      await this._fun.alertError(error);
    }
  }

  async delete(key) {
    let alert = await this._fun.alertDelete();
    if (this._fun.isVarInvalid(alert)) return;

    try {
      await this._apiMongo.delete(env.COLLECTION.general, env.TABLE_SIS.tables, key);//Eliminar Tabla
      await this._apiMongo.delete(env.COLLECTION.general, key, 'items');//Eliminar registros de la tabla
      this.getList();
      await this._fun.alertSucc(env.MSG.SUC_DELETE);
    } catch (error) {
      await this._fun.alertError(error);
    }
  }

  async form(data?) {
    const modal = await this._mod.create({
      component: CreateTableComponent,
      cssClass: 'modal-small',
      componentProps: {
        data
      }
    });

    modal.onDidDismiss().then(async (res: any) => {
      console.log(res.data);
      if (this._fun.isVarInvalid(res.data)) return;
      if (!this._fun.isVarInvalid(res.data.confirm)) this.getList();
    });
    return await modal.present();
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

}
