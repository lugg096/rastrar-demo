import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController } from '@ionic/angular';
import { CaptureImagesComponent } from 'src/app/components/capture-images/capture-images.component';
import { Certificado } from 'src/app/interface/interfaces';
import { DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment as env } from 'src/environments/environment';

import { Plugins, FilesystemDirectory } from '@capacitor/core';
import { sha256 } from 'js-sha256';
import { FileService } from 'src/app/services/file.service';
import { Funciones } from 'src/app/compartido/funciones';
import { IonicComponentsService } from 'src/app/services/ionic-components.service';
import { DataService } from 'src/app/services/data-service.service';
import { ApiService } from 'src/app/services/api.service';
import { CodeAlmacenComponent } from 'src/app/components/code-almacen/code-almacen.component';
import { ListSelectComponent } from 'src/app/components/list-select/list-select.component';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
const { Filesystem } = Plugins;

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  constructor(
    private _apiMongo: ApiMongoService,
    private _api: ApiService,
    private _data: DataService,
    private _fun: Funciones,
    public _comp: IonicComponentsService,
    private fileService: FileService,
    private route: ActivatedRoute,
    private _storage: StorageService,
    public router: Router,
    public formBuilder: FormBuilder,
    private db: DatabaseService,
    private barcodeScanner: BarcodeScanner,
    public _modal: ModalController) {
    this.fileService.mkdir(env.FOLDER_CERT);
  }
  public submitAttempt: boolean = false;

  metadata: any = { title: '', certificateType: { key: '' } };
  user: any;
  fields = [];
  buttons = [];
  photoPreview = [];
  idPhotoRemove = [];
  registroForm: FormGroup;
  id_param = '';
  idCert = '';
  isEdit = false;
  loading: any;
  saved = false;

  contract_card = '';
  code_card = '';

  ngOnInit() {
    this.registroForm = this.formBuilder.group({});
    this.id_param = this.route.snapshot.paramMap.get('id');//ID CERT
    this.initData();
  }

  selectChang(event, array, groupForm) {
    let key = event.detail.value;
    let value: any = array.filter(r => r.key == key)[0].name;

    this.registroForm.controls[groupForm].setValue({
      key,
      value
    });
    console.log('fieldForm', this.registroForm.value);
  }

  selectMulti(event, array, groupForm) {
    let keys = event.detail.value;
    let value = '';
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      let val: any = array.filter(r => r.key == key)[0].name;

      if (index == 0) value = val;
      else value += ', ' + val;


      if (index == (keys.length - 1)) {
        this.registroForm.controls[groupForm].setValue({
          key: keys,
          value
        });
        console.log('fieldForm', this.registroForm.value);
      }

    }




  }

  initForm = false;
  async initData() {
    this.registroForm = this.formBuilder.group({});
    this.user = await this._storage.getLocalStorage('DATA');
    this._data.getDataForm().subscribe(screen => {

      if (this._fun.isVarInvalid(screen) || this.initForm) return;
      this.initForm = true;
      this.metadata = screen;
      console.log('this.metadata', this.metadata);

      this.createForm();
      if (this._fun.isVarInvalid(this.id_param)) {
        this.isEdit = false;
        this.idCert = sha256(new Date().getTime() + this.metadata.code + this.user.publicKey);
      } else this.editData();
    });
  }

  async editData() {
    this.isEdit = true;
    this.loading = await this._comp.presentLoading();
    await this.db.getData({ id: this.id_param }, env.TABLE.CERT).then(res => {
      if (!res) this.loading.dismiss();

      this.idCert = res[0].id;
      let dataForm = JSON.parse(res[0].data);
      console.log('dataForm...........1', dataForm);
      dataForm.f_emision = this._fun.dateTmsToStr(dataForm.f_emision);
      dataForm.f_vencimiento = this._fun.dateTmsToStr(dataForm.f_vencimiento);
      console.log('dataForm...........2', dataForm);
      this.registroForm.patchValue(dataForm);
    });
    await this.db.getData({ id_cert: this.id_param, status: env.STATUS_REG.SAVED }, env.TABLE.IMG).then(res => {
      if (!res) this.loading.dismiss();
      console.log('IMAGES', res);
      this.photoPreview = res;
    });
    this.loading.dismiss();
  }

  async createForm() {
    /*this.metadata = JSON.parse(this.user.metadata)[0]; */
    this.metadata.fields.forEach(field => {
      let validators = [];
      if (field.required) validators.push(Validators.required);
      if (field.long) validators.push(Validators.maxLength(field.long));
      if (field.max && field.inputtype == 'number') validators.push(Validators.max(field.max));
      if (field.min && field.inputtype == 'number') validators.push(Validators.min(field.min));

      /*if (field.code == 'photo') this.registroForm.addControl(field.code, this.formBuilder.array([]));
        else this.registroForm.addControl(field.code, new FormControl(field.value, validators)); */
      let valueDefauld = field.value;
      if (field.propertiesConfig) {
        if (field.propertiesConfig) {
          valueDefauld = this.functionField(field.propertiesConfig);
          console.log('valueDefauld', valueDefauld);
        }
      }

      if (field.type == 'listByApi') {
        if (this._fun.isVarInvalid(valueDefauld)) valueDefauld = [];
        console.log('listByApi VALUE', valueDefauld);

        this.registroForm.addControl(field.code, new FormControl(valueDefauld, validators));
      } else if (field.type == 'checkbox' || field.type == 'select') {
        this.registroForm.addControl(field.code, this.formBuilder.group({
          key: ['', Validators.required],
          value: ['']
        }));
      } else {
        this.registroForm.addControl(field.code, new FormControl(valueDefauld, validators));
      }
      console.log(this.registroForm.value);

      this.fields.push(field);
    });

    this.metadata.buttons.forEach(field => {
      this.buttons.push(field);
    });
  }

  functionField(jsonExe) {
    let newDate = new Date();
    let strJson = JSON.stringify(jsonExe);
    let var_strJson = JSON.stringify(jsonExe);
    console.log('strJson', strJson);


    strJson = strJson.replace('getTitleScreen()', this.metadata.title);
    strJson = strJson.replace('getDate()', Math.floor((newDate.getTime()) / 1000).toString());
    console.log('strJson...1', strJson);

    let validJson = this._fun.validJson(strJson);
    if (this._fun.isString(validJson)) validJson = JSON.parse(validJson);
    console.log('validJson..1', validJson);

    if (validJson == null) return '';

    if (var_strJson.includes('getDate()')) {
      let varSum = validJson.valueDefault.split('+');
      let sum = 0;
      for (let index = 0; index < varSum.length; index++) {
        sum += Number(varSum[index]);
      }
      validJson.valueDefault = this._fun.dateTmsToStr(sum);
    }
    console.log('validJson.valueDefault', validJson.valueDefault);

    return validJson.valueDefault;
  }

  async imagesCapture(field) {
    const modal = await this._modal.create({
      component: CaptureImagesComponent,
      componentProps: {
        idCert: this.idCert,
        field: field,
        photoPreview: this.photoPreview,
        idPhotoRemove: this.idPhotoRemove
      }
    });

    modal.onDidDismiss().then(async (res: any) => {
      this.photoPreview = res.data.photoPreview;
      this.idPhotoRemove = res.data.idPhotoRemove;
      let textValue = '';
      if (this.photoPreview.length != 0) textValue = this.photoPreview.length + ' fotos';
      this.registroForm.controls[field.code].setValue(textValue);
    });
    return await modal.present();
  }


  /*   getlist(){} */


  configParamas(params) {
    let lengthObj = Object.keys(params).length;
    let count = 0;

    for (const p1 in params) {
      if (typeof params[p1] === 'object' || params[p1] instanceof Object) params[p1] = this.configParamas(params[p1])
      else if (p1 == '$lte' || p1 == '$gt') params[p1] = Number(params[p1]);
      count++;
      if (count == lengthObj) return params;
    }
  }


  async selectList(field) {

    console.log('adrx_titular',this.registroForm.controls['adrx_titular'].value);
    
    if (this._fun.isVarInvalid(this.registroForm.controls['adrx_titular'].value)) {
      this._fun.alertWarning('Primero debe ingresar ingresar dirección de usuario', 'Entendido');
      return;
    }

    console.log('field', field);

    let data: any = field.propertiesConfig.listByApi;
    let dateNow: any = Math.floor(new Date().getTime() / 1000);
    let filter_list: any;

    if (typeof data === 'string' || data instanceof String) {

      data = data.replace(/_dateNow_/g, dateNow)
      data = data.replace(/_adrx_/g, this.registroForm.controls['adrx_titular'].value)

      console.log('data1', data);

      filter_list = JSON.parse(data);
    } else filter_list = data;
    console.log('filter_list2', filter_list);

    //CONFIG PARAMAS
    let paramas = this.configParamas(filter_list.listByApi.params);

    let res: any = await this._apiMongo.filter(filter_list.listByApi.collection, filter_list.listByApi.table, paramas);
    console.log('res', res);
    if (this._fun.isEmpty(res.result)) {
      this._fun.alertWarning('No se encontro certificados validos', 'Entendido');
      return;
    }

    let res_list = res.result[0][filter_list.listByApi.table];
    let list_main = this.configList(res_list);

    const modal = await this._modal.create({
      cssClass: 'style-list-select',
      backdropDismiss: false,
      component: ListSelectComponent,
      componentProps: {
        list_main,
        titleReg: 'objective_cert',
        listSelect: this.registroForm.controls[field.code].value
      }
    });
    modal.onDidDismiss().then(async (res: any) => {
      console.log('res', res);
      if (this._fun.isVarInvalid(res.data)) return;
      if (!this._fun.isVarInvalid(res.data.list)) {
        console.log('this.registroForm', this.registroForm.value);
        this.registroForm.controls[field.code].setValue(res.data.list);
      }
    });
    await modal.present();

  }

  configList(list) {
    let listConfig = [];

    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      let reg = {
        name: item.name,//name document
        key: item.key,
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

  tiggerFields() {
    Object.keys(this.registroForm.controls).forEach(field => {
      let _control = this.registroForm.get(field);
      if (_control instanceof FormControl) _control.markAsTouched({ onlySelf: true });
      if (_control instanceof FormGroup) {
        Object.keys(_control.controls).forEach(field_g => {
          let _control_g = _control.get(field_g);
          if (_control_g instanceof FormControl) _control_g.markAsTouched({ onlySelf: true });
        });
      }
    });
  }

  async actionButton(type: string) {
    console.log('this.registroForm', this.registroForm.value);
    if (type == 'confirm') {
      this.tiggerFields();
      if (this.registroForm.valid) this.grabarCert();
    } else {
      console.log('SE CANCELARA');
    }
  }

  dataForm() {

    let data: any = this.registroForm.value;
    let jsonNew = JSON.parse(JSON.stringify(data));
    let db_f: any = [];

    let objs = Object.keys(data);
    let fields = this.metadata.fields;

    console.log('fields', fields);
    console.log('objs', objs);

    for (let index = 0; index < objs.length; index++) {
      let key = objs[index];
      let values = [];
      let f_index = fields.findIndex(f => f.code == key);

      if (f_index != -1) {

        let dataValue: any;
        if (fields[f_index].type == 'checkbox' || fields[f_index].type == 'select') {
          dataValue = data[key].value;
        } else dataValue = data[key];

        jsonNew[key] = {
          key: key,
          caption: fields[f_index].caption,
          visibility_type: fields[f_index].visibility_type,
          value: dataValue
        }
        /*  db_f.push(f); */
      }
    }

    console.log('MOSTRAR CAMPOS', jsonNew);
    return jsonNew;
  }

  async grabarCert() {
    console.log('this.registroForm.value0', this.registroForm.value);
    /*  return; */

    let textConfirm = this.isEdit ? 'Si, actualizar' : 'Si, guardar';
    let textDes1 = this.isEdit ? env.MSG.ALERT_UPDATE : env.MSG.ALERT_SAVE;
    let a = await this._fun.alert(env.MSG.TYPE_ALERT, textConfirm, env.MSG.ALERT_TITLE, textDes1);
    if (this._fun.isVarInvalid(a)) return;

    var cert: any = {};
    cert.id = this.idCert;

    //CAMBIAR 
    let dataForm = this.registroForm.value;

    /*     if (this.metadata.certificateType.key == 'C1') { */
    dataForm.f_emision = this._fun.dateStrtoTms(this.registroForm.value.f_emision);
    dataForm.f_vencimiento = this._fun.dateStrtoTms(this.registroForm.value.f_vencimiento);

    /*     } else if (this.metadata.certificateType.key == 'C4') {
          dataForm.f_emision = this._fun.dateStrtoTms(this.registroForm.value.f_recepcion);
          dataForm.f_vencimiento = dataForm.f_emision + 31536000
        } */

    cert.data = JSON.stringify(dataForm);
    cert.dataScreen = JSON.stringify(this.dataForm());//CAMBIO
    console.log('cert.dataScreen', cert.dataScreen);

    cert.code = this.metadata.code;
    cert.title = this.metadata.title;
    cert.certificateType = this.metadata.certificateType.key;

    //CAMPO REQUERIDO PARA CERT
    cert.emisor_did = this.user.publicKey;
    cert.emisor_ident = this.user.idens[0].number;
    cert.emisor_name = this.user.name;
    cert.emisor_role = this.user.role.value;

    cert.titular_adrx = this.registroForm.value.adrx_titular;
    cert.titular_name = this.registroForm.value.name_titular;//para ser visto en listado
    cert.objective_cert = this.registroForm.value.objective_cert;//para ser visto en listado
    cert.f_emision = dataForm.f_emision;//para ser visto en listado


    cert.frecord = (new Date().getTime()).toString();
    cert.fsend = '';
    cert.tx = '';
    cert.img_cert = '';
    cert.img_ipfs = '';
    cert.status = env.STATUS_REG.SAVED;

    cert.contract_card = this.contract_card;
    cert.code_card = this.code_card;


    console.log('cert', cert);

    if (!this.isEdit) {
      /*   cert.code_almc = this._fun.genCodeId(); */ //PARA VENTAS
      let addCert = await this.db.addData(cert, env.TABLE.CERT);
      console.log('addCert', addCert);
      if (!addCert) return;

      if (this.photoPreview.length > 0) {
        let addImg = await this.db.addData(this.photoPreview, env.TABLE.IMG);
        console.log('addImg', addImg);
        if (!addImg) return;
      }

    } else {
      cert.code_almc = this.metadata.code_almc;
      this.photoPreview = this.photoPreview.filter(ph => this._fun.isVarInvalid(ph.id));
      let updateCert = await this.db.updateData(cert, { condition: { id: cert.id }, type: 'ONE' }, env.TABLE.CERT);
      if (!updateCert) return;

      /* Guardar imagenes nuevas */
      if (this.photoPreview.length > 0) {
        let addImg = await this.db.addData(this.photoPreview, env.TABLE.IMG);
        if (!addImg) return;
      }

      /* Deshabilitar imagenes quitadas */
      if (this.idPhotoRemove.length > 0) {
        let deleteImg = await this.db.updateData({ status: env.STATUS_REG.DISABLED }, { condition: { id: this.idPhotoRemove }, type: 'MULTIPLE' }, env.TABLE.IMG);
        if (!deleteImg) return;
      }
    }

    let textDes2 = this.isEdit ? env.MSG.SUC_UPDATE : env.MSG.SUC_SAVE;
    await this._fun.alert(env.MSG.TYPE_SUC, ' Ok ', env.MSG.SUC_TITLE, textDes2);
    this.saved = true;/* Bandera para salir de formulario sin aviso de guardado */
    this.router.navigate(['/gestion']);
    if (this.metadata.certificateType.key == 'C4') this.genCode(cert.code_almc);
  }

  async genCode(code) {
    await this._fun.code(env.MSG.TYPE_ALERT, ' Ok ', 'Código', code);
  }

  async goGestion() {
    this.router.navigate(['/gestion']);
  }

  async scan(field) {
    this.barcodeScanner.scan({ prompt: "Lee código QR de " + field.caption }).then(async code => {
      if (code) {
        this.code_card = code.text;

        let name = code.text.split("#")[1];
        this.registroForm.controls['name_titular'].setValue(name);
        let codeType: any = code.text.replace('#' + name, '').split(":");
        let codeFin = '';


        if (codeType[1] == 'cid') {
          let ipfs_code = codeType[3];
          let ipfs_value: any = await this._api.getIpfs(ipfs_code).toPromise();
          console.log('ipfs_value', ipfs_value);
          this.contract_card = ipfs_value.credentialSubject.contract;

          /*  let ipfs_code = 'QmfCwzn3LV9pWrR9fb2RBXGW3vwtrsjayFfpG6HFpZWoLu';
              let ipfs_value :any = await this._api.getIpfs(ipfs_code).toPromise(); */

          console.log('ipfs_value', ipfs_value.credentialSubject.id.split(":")[3]);
          codeFin = ipfs_value.credentialSubject.id.split(":")[3];


        } else if (codeType[1] == 'ethr') {
          codeFin = codeType[3];
        }
        //did:cid:ipfs:<CID>
        //did:ethr:lacchain:
        this.registroForm.controls[field.code].setValue(codeFin);
      }
    }).catch(err => {
      console.log('Error', err);
    })
  }


}
