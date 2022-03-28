import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { ModalController } from '@ionic/angular';
import { Funciones } from 'src/app/compartido/funciones';
import { ContractsService } from 'src/app/services/contracts.service';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { environment as env } from 'src/environments/environment';
import { IonicComponentsService } from 'src/app/services/ionic-components.service';
import { error } from 'protractor';

@Component({
  selector: 'app-import-excel',
  templateUrl: './import-excel.component.html',
  styleUrls: ['./import-excel.component.scss'],
})
export class ImportExcelComponent implements OnInit {

  data: any;
  name = '';
  key_table: any;

  /* LIST PARAMAS */
  listTypeDoc: any;
  listG_clie: any;
  listG_empl: any;
  listG_prod: any;
  listTypeProv: any;

  data_db: any = [];

  constructor(
    public _comp: IonicComponentsService,
    private _apiMongo: ApiMongoService,
    private _contractsService: ContractsService,
    private _fun: Funciones,
    private _modal: ModalController
  ) { }

  ngOnInit() { }

  onFileChange(evt: any) {

    const target: DataTransfer = <DataTransfer>(evt.target);
    /*     console.log('target.files[0]',target.files[0]); */
    this.name = target.files[0].name;
    if (target.files.length !== 1) throw new Error('No puede subir mas de una archivo');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;

      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];

      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /*       console.log(ws); */
      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
      this.configProd();

      console.log(' this.data', this.data);
    }


    reader.readAsBinaryString(target.files[0])
  }


  async configProd() {
    let loading: any = await this._comp.presentLoading();
    //Productores
    /* Nombre de proveedor
       Tipo de documento	
       Número de documento	
       Comunidad
       Tipo de proveedor */

    /*    let index = 0; */
    /*     this.data.forEach(async (row) => { */
    for (let index = 2; index < this.data.length; index++) {
      const row: any = this.data[index];


      if (row.length == 0 && index == (this.data.length - 1)) loading.dismiss();
      if (row.length == 0) continue;
      console.log('row', row);

      let error = false;

      let data_user = {
        dids: [],//ok
        documents: [],//ok
        group: { collection: '', table: '', key: '', value: '' },//ok
        idens: [{ number: "", type: "", type_name: "" }],
        name: row[0],//ok
        nonce: "",//ok
        type: { collection: '', table: '', key: '', value: '' }//ok
      }

      data_user.nonce = this._fun.makeDigit(6);

      let cred: any = await this._contractsService.getAccount();
      data_user.dids.push({
        txType: 1,
        hashTransaction: '',
        address: cred.address
      });


      //Tipo de documento
      if (!this._fun.isVarInvalid(row[1]) || !this._fun.isVarInvalid(row[2].toString())) {
        let doc = this.listTypeDoc.filter(r => r.key == row[1]);
        if (doc.length > 0) {

          let docUse = this.data_db.filter(r => r.idens[0].number == row[2].toString());
          if (docUse.length == 0) {
            data_user.idens[0] = { number: row[2].toString(), type: doc[0].key, type_name: doc[0].name };
            this.data[index][1] = this.data[index][1] + '(' + doc[0].name + ')';
          } else {
            data_user.idens[0] = { number: "", type: "", type_name: "" };
            this.data[index][2] = { value: this.data[index][2], error: 'N° de documento repetido' };
            error = true;
          }

        } else {
          data_user.idens[0] = { number: "", type: "", type_name: "" };
          this.data[index][1] = { value: this.data[index][1], error: 'No se encontro registro' };
          error = true;
        }
      } else {
        //   this.data[index][1] = { value: '', error: false };
        data_user.idens[0] = { number: "", type: "", type_name: "" };
      }

      //Comunidad de productor
      if (!this._fun.isVarInvalid(row[3])) {
        let group = this.listG_prod.filter(r => r.key == row[3]);
        if (group.length > 0) {
          data_user.group = { collection: 'general', table: group[0].table, key: group[0].key, value: group[0].name };
          this.data[index][3] = this.data[index][3] + '(' + group[0].name + ')';
        } else {
          data_user.group = { collection: '', table: '', key: '', value: '' };
          this.data[index][3] = { value: this.data[index][3], error: 'No se encontro registro' };
          error = true;
        }
      } else {
        //  this.data[index][3] = { value: '', error: false };
        data_user.group = { collection: '', table: '', key: '', value: '' };
      }

      //Tipo de proveedor
      if (!this._fun.isVarInvalid(row[4])) {
        let type = this.listTypeProv.filter(r => r.key == row[4]);
        if (type.length > 0) {
          data_user.type = { collection: 'general', table: type[0].table, key: type[0].key, value: type[0].name };
          this.data[index][4] = this.data[index][4] + '(' + type[0].name + ')';
        } else {
          data_user.type = { collection: '', table: '', key: '', value: '' };
          this.data[index][4] = { value: this.data[index][4], error: 'No se encontro registro' };
          error = true;
        }
      } else {
        //  this.data[index][4] = { value: '', error: false };
        data_user.type = { collection: '', table: '', key: '', value: '' };
      }



      if (this._fun.isVarInvalid(row[0])) {
        this.data[index][0] = { value: '', error: 'Campo es obligatorio' };
        error = true;
      }
      if (this._fun.isVarInvalid(row[1])) {
        this.data[index][1] = { value: '', error: 'Campo es obligatorio' };
        error = true;
      }
      if (this._fun.isVarInvalid(row[2])) {
        this.data[index][2] = { value: '', error: 'Campo es obligatorio' };
        error = true;
      }

      if (!error) {
        let valid = await this.validDoc(data_user.idens[0]);

        if (!valid) {
          this.data[index][2] = { value: this.data[index][2], error: 'Documento fue asignado a otro usuario' };
          error = true;
        }
      }

      console.log('data_user', data_user);
      if (!error) this.data_db.push(data_user);
      else this.data_invalid.push(data_user);

      if (index == (this.data.length - 1)) loading.dismiss();
    };
  }

  data_invalid = [];
  data_list = [];

  isObject(cell) {
    if (typeof cell == 'object') return true;
    else return false;
  }

  async validDoc(doc) {
    try {
      const res: any = await this._apiMongo.filter(env.COLLECTION.party, env.TABLE_SIS.producer,
        { 'data.idens': { "$all": [{ "number": doc.number.toString().trim(), "type": doc.type, "type_name": doc.type_name }] } });

      console.log('respuesta USER', res);
      if (this._fun.isEmpty(res.result)) return true;
      else return false;

    } catch (error) {
      return false;
    }

  }

  async save() {

    console.log('this.data_db', this.data_db);


    let alert = await this._fun.alertGen('Si, crear', 'Se crearán usuarios a partir de los registros válidos, no se tomará en cuenta a los registros inválidos');
    if (this._fun.isVarInvalid(alert)) return;


    let index = 0;
    this.data_db.forEach(async (data_user) => {
      let key = this._fun.makeCode();

      console.log('INFORMACION A GUARDAR', data_user);
      this._apiMongo._create(env.COLLECTION.party, this.key_table, key, data_user, false)
        .subscribe(async (saved_us: any) => {
          if (this._fun.isVarInvalid(saved_us.result)) {
            await this._fun.alertError(saved_us.message);
            return;
          }

        }, async (error) => await this._fun.alertError(error))
      if (index == (this.data_db.length - 1)){
        this.confirm();
        this.closeModal();
        await this._fun.alertSucc('Registros fueron almacenados correctamente');
      } 

      index++;
    });
  }

  closeModal() {
    this._modal.dismiss();
  }

  confirm() {
    this._modal.dismiss({ confirm: true });
  }
}
