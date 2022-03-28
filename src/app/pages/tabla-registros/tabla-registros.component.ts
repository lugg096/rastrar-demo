import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Funciones } from 'src/app/compartido/funciones';
import { CreateRegistroComponent } from 'src/app/components/create-registro/create-registro.component';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-tabla-registros',
  templateUrl: './tabla-registros.component.html',
  styleUrls: ['./tabla-registros.component.scss'],
})
export class TablaRegistrosComponent implements OnInit {

  list_main = [];
  pageOfItems: Array<any>;
  list = [];
  load = false;

  key_table = '';

  nameFilter = '';
  orderBy = {
    key: '',
    order: true
  }

  thead = [
    { key: 'key', name: 'Código' },
    { key: 'name', name: 'Valor' },
    { key: 'status', name: 'Estado' },
  ];

  optionFilter = [
    { key: 'key', value: '', type: 'string' },
    { key: 'status', value: false, type: 'boolean' }
  ];


  constructor(
    private _fun: Funciones,
    private _apiMongo: ApiMongoService,
    private _mod: ModalController,
    public router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.key_table = this.route.snapshot.paramMap.get('key');
    this.getList();
  }

  async getList() {
    this.load = true;
    try {
      const res: any = await this._apiMongo.get(env.COLLECTION.general,this.key_table, 'items');
      if (this._fun.isEmpty(res.result)) {
        this.load = false;
        return;
      }
      console.log('res', res);
      this.list_main = res.result[0][this.key_table];

      this.list = this.list_main;
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


  changeInput(value, index,type) {
    if(type=='checkbox'){
      value= value.detail.checked;
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

  back() {
    this.router.navigate(['param']);
  }

  async changeStatus(key, status) {

    let alert = await this._fun.alertChangStatus(status);
    if (this._fun.isVarInvalid(alert)) return;

    try {
      await this._apiMongo.changeStatus(env.COLLECTION.general,this.key_table, key, status);
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
      await this._apiMongo.delete(env.COLLECTION.general,this.key_table, key);
      this.getList();
      this.updateTableCount();
      await this._fun.alertSucc(env.MSG.SUC_DELETE);
    } catch (error) {
      await this._fun.alertError(error);
    }
  }

  async updateTableCount() {

    try {
      let resTable: any = await this._apiMongo.getkey(env.COLLECTION.general,env.TABLE_SIS.tables, this.key_table);
      console.log('resTable',resTable);
      
      let table = resTable.result[0].tables[0];
      let count = table.data.properties.count - 1;
      console.log('table',table);
      var body: any = {
        name: table.name,
        properties: { count, eliminabled: false }
      }
      console.log('body',body);
      const res: any = await this._apiMongo.create(env.COLLECTION.general,env.TABLE_SIS.tables, this.key_table, body, true);
      console.log('res',res);
      if (this._fun.isVarInvalid(res.result)) {
        await this._fun.alertError(res.message);
        return;
      }
    } catch (error) {
      await this._fun.alertError(error);
    }
  }

  async form(data?) {
    const modal = await this._mod.create({
      component: CreateRegistroComponent,
      /*   cssClass: 'modal-small', */
      componentProps: {
        key_table: this.key_table,
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
