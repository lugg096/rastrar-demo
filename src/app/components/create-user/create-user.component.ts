import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Funciones } from 'src/app/compartido/funciones';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { ContractsService } from 'src/app/services/contracts.service';
import { environment as env } from 'src/environments/environment';
import { EliminabledService } from 'src/app/services/eliminabled.service';
import { ListSelectComponent } from '../list-select/list-select.component';
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {

  userForm: FormGroup;
  data: any = {};
  isEdit = false;

  key_table: any;
  _env = env;

  /* LIST PARAMAS */
  listTypeDoc: any;
  listG_clie: any;
  listG_empl: any;
  listG_prod: any;
  listTypeProv: any;
  listRole: any;
  listGroup = [];
  nameGroup = '';

  /* VAR SELECCT MULTIPLE */
  rolesSelect = [];

  constructor(
    private _apiMongo: ApiMongoService,
    private _eliminabled: EliminabledService,
    private _fun: Funciones,
    private _contractsService: ContractsService,
    private _modal: ModalController,
    public formBuilder: FormBuilder) {

    this.userForm = formBuilder.group({
      name: ['', Validators.required],
      idens: this.formBuilder.group({
        number: ['', Validators.required],
        type: ['', Validators.required],
        type_name: ['']
      }),
      group: this.formBuilder.group({
        collection: [''],
        table: [''],
        key: [''],
        value: ['']
      }),
      /*  type: this.formBuilder.group({
         collection: [''],
         table: [''],
         key: ['', Validators.required],
         value: ['']
       }), */
      documents: [[]]
    });
  }

  /* CAMPO SELECT SIMPLE*/
  selectChang(event, array, groupForm, table) {

    let key = event.detail.value;
    let value: any = array.filter(r => r.key == key)[0]/* .name */;
    if (this._fun.isVarInvalid(value)) return;
    console.log('value', value);

    this.userForm.controls[groupForm].setValue({
      collection: "general",
      table,
      key,
      value: value.name
    });
  }

  selectType(event, array, groupForm) {
    let key = event.detail.value;
    let value: any = array.filter(r => r.key == key)[0];
    this.userForm.controls[groupForm].patchValue({ type_name: value.name });
  }

  ngOnInit() {
    this.configForm();
    if (!this._fun.isVarInvalid(this.data)) this.editData();
  }

  async editData() {
    this.isEdit = true;
    this.userForm.controls['name'].setValue(this.data.name);
    this.userForm.controls['idens'].setValue(this.data.data.idens[0]);
    if (this.key_table == env.TABLE_SIS.employee) {
      this.data.data.properties = JSON.stringify(this.data.data.properties);
    }
    this.userForm.patchValue(this.data.data);
  }

  tiggerFields() {
    Object.keys(this.userForm.controls).forEach(field => {
      let _control = this.userForm.get(field);
      if (_control instanceof FormControl) _control.markAsTouched({ onlySelf: true });
      if (_control instanceof FormGroup) {
        Object.keys(_control.controls).forEach(field_g => {
          let _control_g = _control.get(field_g);
          if (_control_g instanceof FormControl) _control_g.markAsTouched({ onlySelf: true });
        });
      }
    });
  }

  async validateForm() {

    this.tiggerFields();
    console.log('ERRRRROR.........1');

    if (this.userForm.valid) {
      let alert = await this._fun.alertSave(this.isEdit);
      if (this._fun.isVarInvalid(alert)) return;
      this.create();
    }
  }

  async create() {
    if (this.key_table != env.TABLE_SIS.employee && this.key_table != env.TABLE_SIS.producer  && this.key_table != env.TABLE_SIS.customer&& !this.isEdit) this.createDid();
    else this.saveDB();
  }

  async createDid() {

    try {
      //Validar conexión en MetaMask
      await this._contractsService.connectMT();

      //Llave privada y address
      let cred: any = await this._contractsService.getAccount();
      console.log('CRED...1', cred);


      /* Generar DID y obtener el TX */
      let tx: any = await this._contractsService.createDID(cred, this.userForm.value.name, this.key_table);
      if (!tx) return;
      console.log('TX..1', tx);
      //Guardar usuario en BD
      this.saveDB({ tx, address: cred.address });

    } catch (error) {
      await this._fun.alertError(error);
    }

  }

  async saveDB(d_did?) {

    if(!this.isEdit){
      try {
        console.log('JSON',  { 'data.idens': { "$all": [{ "number": this.userForm.controls['idens'].value.number, "type": this.userForm.controls['idens'].value.type, "type_name": this.userForm.controls['idens'].value.type_name }] } });
        
        const res: any = await this._apiMongo.filter(env.COLLECTION.party, this.key_table,
          { 'data.idens': { "$all": [{"number": this.userForm.controls['idens'].value.number.trim(),
          "type": this.userForm.controls['idens'].value.type.trim(),
          "type_name": this.userForm.controls['idens'].value.type_name.trim()}] } });
  
        console.log('respuesta USER', res);
        if (!this._fun.isEmpty(res.result)){
          await this._fun.alertError('Documento ingresado esta siendo usado por el usuario '+res.result[0][this.key_table][0].name);
          return;
        }
  
      } catch (error) {
         await this._fun.alertError(error);
        return;
      }
    }
  


    console.log('MOSTRAR DID', d_did);

    /* PREPARAR DATOS */
    let data_user: any = this.userForm.value;
    let key: any;
    data_user.dids = [];
    data_user.idens = [];
    data_user.idens.push(this.userForm.controls['idens'].value);

    if (!this.isEdit) {
      key = this._fun.makeCode();
      data_user.nonce = this._fun.makeDigit(6);

      /* Agregar DID creado si no es empleado  */
      if (!this._fun.isVarInvalid(d_did)) {
        data_user.dids.push({
          txType: 1,
          hashTransaction: d_did.tx,
          address: d_did.address
        });
      }else if (this.key_table == env.TABLE_SIS.producer){
        let cred: any = await this._contractsService.getAccount();
        console.log('CRED... PRODUCER', cred);
        data_user.dids.push({
          txType: 1,
          hashTransaction: '',
          address:  cred.address 
        });
      }
    } else {
      key = this.data.key;
      data_user.nonce = this.data.data.nonce;
      data_user.dids = this.data.data.dids;
    }

    try {
      /*    data_user.dids = []; */
      if (this.key_table == env.TABLE_SIS.employee) {
        let properties = this._fun.strToJson(this.userForm.value.properties);
        if (this._fun.isVarInvalid(properties)) return;
        data_user.properties = properties;
        this._eliminabled.role([this.userForm.controls['role'].value]);
      }
      console.log('INFORMACION A GUARDAR', data_user);
  
      let saved_us: any = await this._apiMongo.create(env.COLLECTION.party, this.key_table, key, data_user, this.isEdit);

      if (this._fun.isVarInvalid(saved_us.result)) {
        await this._fun.alertError(saved_us.message);
        return;
      }

      this.confirm();
      await this._fun.alertSucc(this.isEdit ? env.MSG.SUC_UPDATE : env.MSG.SUC_CREATE);
    } catch (error) {
      await this._fun.alertError(error);
    }

  }

  configForm() {
    switch (this.key_table) {
      case env.TABLE_SIS.employee: this.configEmplo(); break;
      case env.TABLE_SIS.producer: this.configProduc(); break;
      case env.TABLE_SIS.customer: this.configCompr(); break;
      default: break;
    }
  }

  configProduc() {
    this.listGroup = this.listG_prod;
    this.nameGroup = 'Comunidad';

    this.userForm.addControl('type', this.formBuilder.group({
      collection: [''],
      table: [''],
      key: [''],
      value: ['', Validators.required]
    }));
  }

  configCompr() {
    this.listGroup = this.listG_clie;
    this.nameGroup = 'Segmento';
    this.userForm.addControl('email', new FormControl('', [Validators.pattern("[^@]+@[^@]+\.[^@]+$"), Validators.required]));
    this.userForm.addControl('phone', new FormControl(''));
    this.userForm.addControl('password', new FormControl('', [Validators.required]));
  }

  configEmplo() {
    this.configCompr();
    this.listGroup = this.listG_empl;
    this.nameGroup = 'Grupo';
    this.userForm.addControl('properties', new FormControl(''));
    this.userForm.addControl('role', this.formBuilder.group({
      collection: [''],
      table: [''],
      key: [''],
      value: ['', Validators.required]
    }));
  }

  async listRol() {
    const modal = await this._modal.create({
      cssClass: 'style-list-select',
      component: ListSelectComponent,
      componentProps: {
        type_text: 'roles',
        key_table: env.TABLE_SIS.role,
        item: this.userForm.controls['role'].value,
        collection: env.COLLECTION.general
      }
    });
    modal.onDidDismiss().then(async (res: any) => {

      if (this._fun.isVarInvalid(res.data)) return;
      if (!this._fun.isVarInvalid(res.data.confirm)) {

        let data = {
          collection: env.COLLECTION.general,
          table: res.data.confirm.table,
          key: res.data.confirm.key,
          value: res.data.confirm.name
        }

        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaa', data);


        this.userForm.controls['role'].setValue(data);

      }
    });
    await modal.present();

  }

  closeModal() {
    this._modal.dismiss({ confirm: false });
  }

  confirm() {
    this._modal.dismiss({ confirm: true });
  }
}
