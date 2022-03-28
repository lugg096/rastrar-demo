import { Component, OnInit } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { ModalController } from '@ionic/angular';
import { GetDidComponent } from 'src/app/components/get-did/get-did.component';
import { ImportExcelComponent } from 'src/app/components/import-excel/import-excel.component';
import { Funciones } from 'src/app/compartido/funciones';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { ContractsService } from 'src/app/services/contracts.service';
import { GenCardsComponent } from 'src/app/components/gen-cards/gen-cards.component';
import { ListScreenComponent } from 'src/app/components/list-screen/list-screen.component';
import { AuthService } from 'src/app/services/auth.service';
import { GenerarCodeQRComponent } from 'src/app/components/generar-code-qr/generar-code-qr.component';
import { DemoInicioComponent } from 'src/app/components/comp-demo/demo-inicio/demo-inicio.component';
import { IonicComponentsService } from 'src/app/services/ionic-components.service';
import { GenerationFormComponent } from 'src/app/components/generation-form/generation-form.component';
import { QrMultipleComponent } from 'src/app/components/qr-multiple/qr-multiple.component';

@Component({
  selector: 'app-list-qr',
  templateUrl: './list-qr.component.html',
  styleUrls: ['./list-qr.component.scss'],
})
export class ListQrComponent implements OnInit {

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
    { key: 'name', name: 'Asunto' },
    { key: 'group1', name: 'Comprador' },
    { key: 'group2', name: 'Origen' },
    { key: 'group3', name: 'Destino' },
    { key: 'docment', name: 'Emisión' },
    { key: 'did', name: 'Vencimiento' },
    { key: 'status', name: 'Estado' }
  ];

  optionFilter = [
    { key: 'name', value: '', type: 'string' },
    { key: 'status', value: false, type: 'boolean' }
  ];

  constructor(
    public _comp: IonicComponentsService,
    private _auth: AuthService,
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

  getParamas() { }


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
        objective_cert: item.data.data_cert.data.objective_cert
      };
      listConfig.push(reg);
      if (index == (list.length - 1)) return listConfig;
    }
  }

  ngOnInit() {
/*     let a:any = [1, 2, 3];
    let b = [4, 5, 6];
    a.push(...b);
    console.log('ARRAy', a); */
    this.getParamas();
    this.getList();
  }

  segmentChanged(value) {
    if (this.load) return;// Corrigue erroes al cambiar de tabla rapidamente
    this.key_table = value.detail.value;
    this.list = [];
    this.getList();
  }

  userSesion: any;

  async getList() {
    this.load = true;
    try {

      this._auth.getUser().subscribe(async user => {
        if (!user) return;
        this.userSesion = user;
        this.listReg();

      })

      this.load = false;
    } catch (error) {
      this.load = false;
      await this._fun.alertError(error);
    }
  }

  async listReg() {
    console.log('ACTUALZIAR LISTADO');
    let DNI_USER = this.userSesion.data.idens[0].number;
    const res: any = await this._apiMongo.get(env.COLLECTION.dataQrUser, DNI_USER, 'items');

    console.log('res', res);
    if (this._fun.isEmpty(res.result)) {
      this.load = false;
      return;
    }

    this.list_main = res.result[0][DNI_USER];
    this.list = this.list_main;
    console.log('this.list_main', this.list_main);
  }


  async verQR(data) {
    console.log('data', data);


    const modal = await this._mod.create({

      component: QrMultipleComponent,
      cssClass: 'style-qr',
      backdropDismiss: false,
      componentProps: {
        dataAssociateQR:data.data.dataAssociateQR,
 /*        trxid: data.data.trxid,
        title: data.data.objective_cert */
      }
    });

    modal.onDidDismiss().then(async (res: any) => {
      /*    console.log(res.data);
         if (this._fun.isVarInvalid(res.data)) return;
         if (!this._fun.isVarInvalid(res.data.confirm)) this.getList(); */
    });
    return await modal.present();


  }

  async verDemo(data) {
    console.log('data', data);


    const modal = await this._mod.create({
      component: DemoInicioComponent,
      cssClass: 'style-demo',
      componentProps: {
        data,
        viewDemo_pre: false
      }
    });

    modal.onDidDismiss().then(async (res: any) => {
      /*    console.log(res.data);
         if (this._fun.isVarInvalid(res.data)) return;
         if (!this._fun.isVarInvalid(res.data.confirm)) this.getList(); */
    });
    return await modal.present();

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
    let loading: any = await this._comp.presentLoading();
    try {
      await this._apiMongo.delete(env.COLLECTION.dataQrUser, this.userSesion.data.idens[0].number, data.key);
      this.getList();
      loading.dismiss();
      await this._fun.alertSucc(env.MSG.SUC_DELETE);
    } catch (error) {
      loading.dismiss();
      await this._fun.alertError(error);
    }
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

  async editCred(data) {

    let screem = this._fun.noRefObj(data);
    console.log('screem', screem);

    let screenData = {
      dataSreen: {
        description: "Datos Genéricos",
        imagenUrl: "/files/0xdfc0EBba7Fc2f39F6A79983032C86FE457C9D070/8e1de7bfc2d59cb53ef1ee1d1b17b83b0d61901d8cb1acb443811ecc9df468c2.png/?token=721a685476003a8bd2a481592165a90791924c1572b0226f50d886beb768fabc"
      },
      sectionConfig: screem.data.dataScreem,
      updateData: screem.data.dataCred.credential.verifiableCredential[0].credentialSubject,
      key: screem.key,
      table: screem.table,
      dataAssociateQR: screem.data.dataAssociateQR
    };


    const modal = await this._mod.create({
      cssClass: 'style-form',
      backdropDismiss: false,
      component: GenerationFormComponent,
      componentProps: {
        screenData
      }
    });
    modal.onDidDismiss().then(async (res: any) => {
      console.log('res', res);
      if (this._fun.isVarInvalid(res.data)) return;
      if (!this._fun.isVarInvalid(res.data.refresh)) {
        console.log('CERRAR MODAL DE LISTA DE SCREEN');
        this.listReg();
      }

    });

    await modal.present();


  }


  async selectScreen() {

    const modal = await this._mod.create({
      /*     cssClass: 'style-import-excel', */
      backdropDismiss: false,
      component: ListScreenComponent,
      componentProps: {
      }
    });
    modal.onDidDismiss().then(async (res: any) => {
      /* Actualizar lista */

      if (this._fun.isVarInvalid(res.data)) return;
      if (!this._fun.isVarInvalid(res.data.confirm)) {
        console.log('ACTUALZIAR LISTADO DE CREDENCIALES');
        this.listReg();
        await this._fun.alertSucc(env.MSG.SUC_CREATE);
      }

    });
    await modal.present();

  }

}
