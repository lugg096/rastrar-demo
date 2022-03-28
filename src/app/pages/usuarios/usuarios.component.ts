import { Component, OnInit } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { ModalController } from '@ionic/angular';
import { CreateUserComponent } from 'src/app/components/create-user/create-user.component';
import { GetDidComponent } from 'src/app/components/get-did/get-did.component';
import { ImportExcelComponent } from 'src/app/components/import-excel/import-excel.component';
import { Funciones } from 'src/app/compartido/funciones';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { ContractsService } from 'src/app/services/contracts.service';
/* import { ConfigMasterComponent } from 'src/app/components/config-master/config-master.component'; */
import { GenCardsComponent } from 'src/app/components/gen-cards/gen-cards.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {

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
    { key: 'group', name: 'Grupo' },
    { key: 'docment', name: 'Documento' },
    { key: 'did', name: 'DID' },
    { key: 'status', name: 'Estado' }
  ];

  optionFilter = [
    { key: 'name', value: '', type: 'string' },
    { key: 'status', value: false, type: 'boolean' }
  ];

  constructor(
    private _contractsService: ContractsService,
    private _apiMongo: ApiMongoService,
    private _fun: Funciones,
    private _mod: ModalController,
  ) { }

  _env = env;

  /*GET  PARAMAS*/
  listTypeDoc = [];
  listG_clie = [];
  listG_empl = [];
  listG_prod = [];
  listRole = [];
  listTypeProv = [];
  parmasOk = false;

  getParamas() {

    this._apiMongo._get(env.COLLECTION.general, env.TABLE_SIS.type_doc_ident, 'items').subscribe((res: any) => {
      this.listTypeDoc = res.result[0][env.TABLE_SIS.type_doc_ident];
    })

    this._apiMongo._get(env.COLLECTION.general, env.TABLE_SIS.g_clie, 'items').subscribe((res: any) => {
      this.listG_clie = res.result[0][env.TABLE_SIS.g_clie];
    })

    this._apiMongo._get(env.COLLECTION.general, env.TABLE_SIS.g_empl, 'items').subscribe((res: any) => {
      this.listG_empl = res.result[0][env.TABLE_SIS.g_empl];
    })

    this._apiMongo._get(env.COLLECTION.general, env.TABLE_SIS.g_prod, 'items').subscribe((res: any) => {
      this.listG_prod = res.result[0][env.TABLE_SIS.g_prod];
    })

    this._apiMongo._get(env.COLLECTION.general, env.TABLE_SIS.role, 'items').subscribe((res: any) => {
      this.listRole = res.result[0][env.TABLE_SIS.role];
    })

    this._apiMongo._get(env.COLLECTION.general, env.TABLE_SIS.type_proveedor, 'items').subscribe((res: any) => {
      this.listTypeProv = res.result[0][env.TABLE_SIS.type_proveedor];
      console.log('this.listTypeProv', this.listTypeProv);

    })

  }



  configList(list) {
    let listConfig = [];

    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      let reg = {
        name: item.name,//name document
        url: item.data.document.imgfile_anonymous.url,//url
        trxid: item.data.data_cert.tx.trxid,//trxid
        lacchainId: item.data.data_cert.tx.lacchainId,//lacchainId
        name_titular: item.data.document.subject.name,//name titular
        adrx_titular: item.data.document.subject.data.dids.address,//adrx titular
        objective_cert:item.data.data_cert.data.objective_cert
      };
      listConfig.push(reg);
      if (index == (list.length-1)) return listConfig;
    }
  }

  ngOnInit() {
  /*   let a = this.configList(this.data_prueba)
    console.log('LISTADO OK', a); */


    this.key_table = env.TABLE_SIS.producer;
    this.getParamas();
    this.getList();
  }


  segmentChanged(value) {
    if (this.load) return;// Corrigue erroes al cambiar de tabla rapidamente
    this.key_table = value.detail.value;
    this.list = [];
    this.getList();
  }

  async getList() {
    this.load = true;
    try {
      const res: any = await this._apiMongo.get(env.COLLECTION.party, this.key_table, 'items');
      console.log('res', res);
      if (this._fun.isEmpty(res.result)) {
        this.load = false;
        return;
      }

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

  /* ELIMINAR */
  async configMaster(data) {


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

  async changeStatus(data, status) {

    let alert = await this._fun.alertChangStatus(status);
    if (this._fun.isVarInvalid(alert)) return;

    try {
      await this._apiMongo.changeStatus(env.COLLECTION.party, this.key_table, data.key, status);

      /*  if (data.data.dids.length != 0) {
 
         //Validar conexión en MetaMask
         await this._contractsService.connectMT();
 
         let sing: any = await this._contractsService.statusDid(data.data.dids[0].address, status ? 'enable' : 'revoke');
 
         let signData: any = sing.data;
 
         let cred = { address: data.data.dids[0].address, pk: null };
         await this._contractsService.
           signData(signData, (status ? 'enable' : 'revoke') + ' DID', cred, 'did');
       } */
      this.getList();
      await this._fun.alertSucc(status ? env.MSG.SUC_ENABLED : env.MSG.SUC_DISABLED);
    } catch (error) {
      await this._fun.alertError(error);
    }
  }

  async delete(data) {

    let alert = await this._fun.alertDelete();
    if (this._fun.isVarInvalid(alert)) return;

    try {
      await this._apiMongo.delete(env.COLLECTION.party, this.key_table, data.key);
      /*      if (!this._fun.isVarInvalid(data.data.dids) && this.key_table != env.TABLE_SIS.producer) {
             //   await this._contractsService.statusDid(data.data.dids[0].address, 'remove');
     
             //Validar conexión en MetaMask
             await this._contractsService.connectMT();
     
             let sing: any = await this._contractsService.statusDid(data.data.dids[0].address, 'remove');
     
             let signData: any = sing.data;
     
             let cred = { address: data.data.dids[0].address, pk: null };
             await this._contractsService.
               signData(signData, 'remove DID', cred, 'did');
           } */
      this.getList();
      await this._fun.alertSucc(env.MSG.SUC_DELETE);
    } catch (error) {
      await this._fun.alertError(error);
    }
  }

  async form(data?) {

    if (this._fun.isEmpty(this.listTypeProv, this.listTypeDoc, this.listG_clie, this.listG_empl, this.listG_prod, this.listRole)) return;

    const modal = await this._mod.create({
      component: CreateUserComponent,
      /*   cssClass: 'modal-small', */
      backdropDismiss: false,
      componentProps: {
        data,
        key_table: this.key_table,
        listTypeDoc: this.listTypeDoc,
        listG_clie: this.listG_clie,
        listG_empl: this.listG_empl,
        listG_prod: this.listG_prod,
        listRole: this.listRole,
        listTypeProv: this.listTypeProv
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

  /* **************************** */

  async getDid(data) {
    let did = await this._contractsService.statusDid(data.data.dids[0].address, 'get');
    console.log('MOSTRAR INFO DID', did);



    /*  data = { name: 'luiggi', did: '0xAD27e9cD2506EE56f5E4124b56D5Bc85e7EEBc95', data: [''] } */
    this._mod.create({
      cssClass: 'style-card-did',
      component: GetDidComponent,
      componentProps: {
        data,
        type: this.key_table == env.TABLE_SIS.customer ? 'Comprador' : (this.key_table == env.TABLE_SIS.employee ? 'Empleado' : 'Proveedor')

      }
    }).then((modal) => modal.present());
    return;
  }

  async importExcel() {
    if (this._fun.isEmpty(this.listTypeProv, this.listTypeDoc, this.listG_clie, this.listG_empl, this.listG_prod, this.listRole)) return;


    const modal = await this._mod.create({
      cssClass: 'style-import-excel',
      backdropDismiss: false,
      component: ImportExcelComponent,
      componentProps: {
        key_table: this.key_table,
        listTypeDoc: this.listTypeDoc,
        listG_clie: this.listG_clie,
        listG_empl: this.listG_empl,
        listG_prod: this.listG_prod,
        listRole: this.listRole,
        listTypeProv: this.listTypeProv
      }
    });
    modal.onDidDismiss().then(async (res: any) => {
      /* Actualizar lista */
    });
    await modal.present();

  }


  async genCards() {
    if (this._fun.isEmpty(this.listTypeProv, this.listTypeDoc, this.listG_clie, this.listG_empl, this.listG_prod, this.listRole)) return;

    const modal = await this._mod.create({
      cssClass: 'style-import-excel',
      backdropDismiss: false,
      component: GenCardsComponent,
      componentProps: {
        list_main: this.list_main,
        key_table: this.key_table,
        listTypeDoc: this.listTypeDoc,
        listG_clie: this.listG_clie,
        listG_empl: this.listG_empl,
        listG_prod: this.listG_prod,
        listRole: this.listRole,
        listTypeProv: this.listTypeProv
      }
    });
    modal.onDidDismiss().then(async (res: any) => {
      /* Actualizar lista */
    });
    await modal.present();

  }

}
