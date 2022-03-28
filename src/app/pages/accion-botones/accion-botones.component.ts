import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Funciones } from 'src/app/compartido/funciones';
import { CreateButtonComponent } from 'src/app/components/create-button/create-button.component';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-accion-botones',
  templateUrl: './accion-botones.component.html',
  styleUrls: ['./accion-botones.component.scss'],
})
export class AccionBotonesComponent implements OnInit {

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
    { key: 'name', name: 'Nombre' },
    { key: 'note', name: 'Descripción' },
    { key: 'type', name: 'Tipo' },
  ];

  optionFilter = [
    { key: 'name', value: '', type: 'string' }
  ];

  /*GET  PARAMAS*/
  listTypeBut = [];
  listCallAct = [];

  action: any;

  constructor(
    private _fun: Funciones,
    private _apiMongo: ApiMongoService,
    private _mod: ModalController,
    public router: Router,
    private route: ActivatedRoute) { }

  getParamas() {

    this._apiMongo._get(env.COLLECTION.general, env.TABLE_SIS.type_button, 'items').subscribe((res: any) => {
      this.listTypeBut = res.result[0][env.TABLE_SIS.type_button];
    })

    this._apiMongo._get(env.COLLECTION.general, env.TABLE_SIS.type_callToAction, 'items').subscribe((res: any) => {
      this.listCallAct = res.result[0][env.TABLE_SIS.type_callToAction];
    })
  }

  ngOnInit() {
    this.getParamas();
    this.key_table = this.route.snapshot.paramMap.get('key');
    this.getList();
  }

  async getList() {
    this.load = true;
    try {
      const res: any = await this._apiMongo.get(env.COLLECTION.object, env.TABLE_SIS.action, this.key_table);

      if (this._fun.isEmpty(res.result)) {
        this.load = false;
        return;
      }
      /*  console.log('res', res); */
      this.action = res.result[0][env.TABLE_SIS.action][0];
      this.list_main = this.action.data.buttons;

/*       console.log('res', res);
      console.log('this.action', this.action);
      console.log('this.list_main', this.list_main); */

      this.list = this.list_main;
      console.log('LIST 01',this.list);
      this.filter();
      console.log('LIST 02',this.list);
      
      this.orderBy.order = true;
      this.orderBy.key = '';
      this.orderByTable('name');

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
    console.log('this.list',this.list);
    console.log('orderBy.key',this.orderBy.key);
    console.log('orderBy.order',this.orderBy.order);
    
    let listOrder = this._fun.sortJSON(this.list, this.orderBy.key, this.orderBy.order);
    this.list = listOrder.filter(item => true);
  }

  back() {
    this.router.navigate(['acciones']);
  }

  async changeStatus(key, status) {

    let alert = await this._fun.alertChangStatus(status);
    if (this._fun.isVarInvalid(alert)) return;

    try {
      await this._apiMongo.changeStatus(env.COLLECTION.object, this.key_table, key, status);
      this.getList();
      await this._fun.alertSucc(status ? env.MSG.SUC_ENABLED : env.MSG.SUC_DISABLED);
    } catch (error) {
      await this._fun.alertError(error);
    }
  }

  async delete(i) {
console.log('index',i);


    this.action.data.buttons;
    var index = this.action.data.buttons.indexOf(i);
    console.log('index',index);
    
    if (index > -1) {
    let a=  this.action.data.buttons.splice(index, 1);
    console.log('NUEVO VALOR',a);
    
    }
    console.log('buttons',this.action.data.buttons);
    
    return;

    let alert = await this._fun.alertDelete();
    if (this._fun.isVarInvalid(alert)) return;

    try {
/*       await this._apiMongo.delete(env.COLLECTION.object, this.key_table, key); */
      this.getList();
      this.updateTableCount();
      await this._fun.alertSucc(env.MSG.SUC_DELETE);
    } catch (error) {
      await this._fun.alertError(error);
    }
  }

  async updateTableCount() {

    try {
      let resTable: any = await this._apiMongo.getkey(env.COLLECTION.object, env.TABLE_SIS.action, this.key_table);
      console.log('resTable', resTable);

      let table = resTable.result[0].action[0];
      let count = table.data.properties.count - 1;
      console.log('table', table);
      var body: any = {
        name: table.name,
        properties: { count, eliminabled: false }
      }
      console.log('body', body);
      const res: any = await this._apiMongo.create(env.COLLECTION.object, env.TABLE_SIS.action, this.key_table, body, true);
      console.log('res', res);
      if (this._fun.isVarInvalid(res.result)) {
        await this._fun.alertError(res.message);
        return;
      }
    } catch (error) {
      await this._fun.alertError(error);
    }
  }

  async form(data?,index?) {
    /*   if (this._fun.isEmpty(this.listTypeBut, this.listCallAct)) return;
   */
    const modal = await this._mod.create({
      component: CreateButtonComponent,
      /*   cssClass: 'modal-small', */
      componentProps: {
        index,
        action:this.action,
        data,
        listTypeBut: this.listTypeBut,
        listCallAct: this.listCallAct
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
