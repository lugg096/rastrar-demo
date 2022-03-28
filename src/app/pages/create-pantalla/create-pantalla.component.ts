import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonReorderGroup, ModalController } from '@ionic/angular';
import { Funciones } from 'src/app/compartido/funciones';
import { AddFieldComponent } from 'src/app/components/add-field/add-field.component';
import { GenScreenComponent } from 'src/app/components/gen-screen/gen-screen.component';
import { ListSelectComponent } from 'src/app/components/list-select/list-select.component';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { environment as env } from 'src/environments/environment';
import { ItemReorderEventDetail } from '@ionic/core';
import { AddSectionComponent } from 'src/app/components/add-section/add-section.component';
import { sha256 } from 'js-sha256';
@Component({
  selector: 'app-create-pantalla',
  templateUrl: './create-pantalla.component.html',
  styleUrls: ['./create-pantalla.component.scss'],
})
export class CreatePantallaComponent implements OnInit {

  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;


  doReorder(ev: any) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    console.log('EVENTO', ev);


    ev.detail.complete();


    let element = this.list[ev.detail.from];
    this.list.splice(ev.detail.from, 1);
    this.list.splice(ev.detail.to, 0, element);

    this.sreenForm.controls['fields'].setValue(this.list);

    /*  let itm: any = this.list[ev.detail.from];
     this.list[ev.detail.from] = this.list[ev.detail.to];
     this.list[ev.detail.to] = itm;
     console.log('LIST',this.list); */

  }

  toggleReorderGroup() {
    this.reorderGroup.disabled = !this.reorderGroup.disabled;
  }

  /* ***************** */



  sreenForm: FormGroup;
  isEdit = false;

  key_table: any;

  _env = env;

  /* LIST PARAMAS */
  listCertType: any;
  listVisType: any;
  listFieldType: any;
  listInputType: any;
  listFieldCert: any;

  fields_EXT_MP = [];
  fields_ASO_MP = [];


  constructor(
    public router: Router,
    private _mod: ModalController,
    private _apiMongo: ApiMongoService,
    private _fun: Funciones,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute) {

    this.sreenForm = formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      imagenText: [''],
      imagenUrl: [''],
      certificateType: this.formBuilder.group({
        collection: [''],
        table: [''],
        key: ['', Validators.required],
        value: ['']
      }),
      action: this.formBuilder.group({
        key: [''],
        name: ['', Validators.required],
        status: [''],
        table: [''],
        _id: [''],
        data: [{}]
      }),
      visibility_type: ['', Validators.required],
      fields: [[]]
    });
  }


  /* CAMPO SELECT SIMPLE*/
  selectChang(event, array, groupForm, table) {
    let key = event.detail.value;
    let value: any = array.filter(r => r.key == key)[0].name;
    this.fieldsSystem(key);
    this.sreenForm.controls[groupForm].setValue({
      collection: "general",
      table,
      key,
      value
    });
    console.log('sreenForm', this.sreenForm.value);
  }

  async getParamas() {

    this._apiMongo._get(env.COLLECTION.general, env.TABLE_SIS.type_certificate, 'items').subscribe((res: any) => {
      this.listCertType = res.result[0][env.TABLE_SIS.type_certificate];
    });

    this._apiMongo._get(env.COLLECTION.general, env.TABLE_SIS.type_visibility, 'items').subscribe((res: any) => {
      this.listVisType = res.result[0][env.TABLE_SIS.type_visibility];
    });

    /*     // Certificado de actividades de campo
        this._apiMongo._filter(env.COLLECTION.object, env.TABLE_SIS.field, { "data.properties.field_req_c1": true }).subscribe((res: any) => {
          this.fields_CERT = res.result[0][env.TABLE_SIS.field];
        });
    
        // Certificado de extraccion de materia prima
        this._apiMongo._filter(env.COLLECTION.object, env.TABLE_SIS.field, { "data.properties.field_req_c2": true }).subscribe((res: any) => {
          this.fields_EXT_MP = res.result[0][env.TABLE_SIS.field];
        });
    
        // Certificado de actividades asociadas a la materia prima
        this._apiMongo._filter(env.COLLECTION.object, env.TABLE_SIS.field, { "data.properties.field_req_c3": true }).subscribe((res: any) => {
          this.fields_ASO_MP = res.result[0][env.TABLE_SIS.field];
        });
     */

    this._apiMongo._get(env.COLLECTION.general, env.TABLE_SIS.type_field, 'items').subscribe((res: any) => {
      this.listFieldType = res.result[0][env.TABLE_SIS.type_field];
    });
    this._apiMongo._get(env.COLLECTION.general, env.TABLE_SIS.type_input, 'items').subscribe((res: any) => {
      this.listInputType = res.result[0][env.TABLE_SIS.type_input];
    });

    this._apiMongo._get(env.COLLECTION.general, env.TABLE_SIS.type_field_cert, 'items').subscribe((res: any) => {
      this.listFieldCert = res.result[0][env.TABLE_SIS.type_field_cert];
    });

  }

  typeCert = '';
  urlImg = '';


  async fieldsSystem(type) {
    this.typeCert = type;
    /*   let arr = this.sreenForm.controls['fields'].value;
      let filter = arr.filter(cf => {
        console.log('type', type);
  
        console.log('cf', cf);
        console.log('KEY', cf.field.data.properties['field_req_' + type.toLowerCase()]);
  
        if (this._fun.isVarInvalid(cf.field.data.properties['field_req_' + type.toLowerCase()])) return false;
        else return true;
      })
      console.log('filter', filter); */
    /*    return; */

    this.sreenForm.controls['fields'].setValue([]);
    /*     this.sreenForm.controls['fields'].setValue(filter); */

    console.log('VALUE', this.sreenForm.controls['fields'].value);


    let field_Cert;
    if (type == 'C1') field_Cert = this.fields_CERT;//ok

    if (type == 'C2') field_Cert = this.fieldGenQR;

    if (type == 'C3') field_Cert = [];

    if (type == 'C4') field_Cert = this.fields_ASO_MP;

    for (let index = 0; index < field_Cert.length; index++) {
      let field = field_Cert[index];

      /*   if (field.data.iscertificade) {
          field.key = field.data.certificateType.properties.codeApp;
        }
        console.log('field...............1', field); */

      /* 
            let config_field = {
              field: field,
              properties: "",
              required: (type == 'C2') ? false : true,
              visibility_type: (field.key == 'NOTES_PRIVATE') ? 'C2' : "C0"
            } */

      let arr = this.sreenForm.controls['fields'].value;
      arr.push(field);
      this.sreenForm.controls['fields'].setValue(arr);
      if (index == (field_Cert.length - 1)) this.getList();
    }
    if (field_Cert.length == 0) this.getList();
  }

  ngOnInit() {
    this.getParamas();
    /*this.fieldsSystem();*/
    this.key_table = this.route.snapshot.paramMap.get('key');
    if (this.key_table != 'new') this.editData();
    /* 
        
        this.list = this.fieldGenQR; */
    console.log('this.list', this.list);


  }

  changeImagen() {
    this.sreenForm.controls['imagenUrl'].setValue('');
  }


  imgeFile = {
    name: '',
    bytes: '',
    ext: '',
    b64: ''
  }

  onFileSelected(field) {
    const inputNode: any = document.querySelector('#' + field);
    console.log('inputNode.files[0]', inputNode.files[0]);

    this.imgeFile.name = inputNode.files[0].name;
    const file = inputNode.files[0];
    this.imgeFile.bytes = file.size;
    this.imgeFile.ext = file.type.split("/")[1];
    console.log('file', file);
    const reader: any = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      this.imgeFile.b64 = reader.result.split(";base64,")[1];
      console.log('this.contentFile', this.imgeFile.b64);
    };
  }

  urlPrevius = '';
  async editData() {
    this.isEdit = true;
    let res: any = await this._apiMongo.get(env.COLLECTION.object, env.TABLE_SIS.screen, this.key_table);
    let screen = res.result[0].screen[0];
    this.sreenForm.patchValue(screen.data);
    this.sreenForm.controls['name'].setValue(screen.name);
    this.typeCert = this.sreenForm.controls['certificateType'].value.key;

    console.log('screen', screen);
    console.log('this.sreenForm', this.sreenForm.value);

    this.list = this.sreenForm.controls['fields'].value;


    if (this.sreenForm.controls['imagenUrl'].value != '') {
      let endPoint = env.url.substr(0, env.url.length - 1);//quitar el "/"
      /*   this.urlPrevius = this.sreenForm.controls['imagenUrl'].value; */
      this.urlImg = endPoint + this.sreenForm.controls['imagenUrl'].value;
      this.getList();
    }

  }

  tiggerFields() {
    Object.keys(this.sreenForm.controls).forEach(field => {
      let _control = this.sreenForm.get(field);
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
    if (this.sreenForm.valid) {
      let alert = await this._fun.alertSave(this.isEdit);
      if (this._fun.isVarInvalid(alert)) return;
      this.create();
    }
  }


  async create() {
    console.log('this.sreenForm.value', this.sreenForm.value);

    try {
      let key = this.isEdit ? this.key_table : this._fun.makeCode();
      console.log('MOSTRAR 1');

      if (this.imgeFile.b64 != '') {
        let res_upload_imgfile: any = await this._apiMongo.uploadFile(this.imgeFile.b64, this.imgeFile.ext).toPromise();
        console.log('res_upload_imgfile', res_upload_imgfile.data.url);
        this.sreenForm.controls['imagenUrl'].setValue(res_upload_imgfile.data.url);
      }

      const res: any = await this._apiMongo.create(env.COLLECTION.object, env.TABLE_SIS.screen, key, this.sreenForm.value, this.isEdit);
      console.log('MOSTRAR 2', res);
      if (this._fun.isVarInvalid(res.result)) {
        await this._fun.alertError(res.message);
        return;
      }
      this.goScreen();
      await this._fun.alertSucc(this.isEdit ? env.MSG.SUC_UPDATE : env.MSG.SUC_CREATE);
    } catch (error) {
      await this._fun.alertError(error);
    }
  }

  async goScreen() {
    this.router.navigate(['pantalla']);
  }


  async listFields() {
    const modal = await this._mod.create({
      cssClass: 'style-list-select',
      component: ListSelectComponent,
      componentProps: {
        type_text: 'acciones',
        key_table: env.TABLE_SIS.action,
        item: this.sreenForm.controls['action'].value,
        collection: env.COLLECTION.object
      }
    });
    modal.onDidDismiss().then(async (res: any) => {
      if (this._fun.isVarInvalid(res.data)) return;
      if (!this._fun.isVarInvalid(res.data.confirm)) {
        this.sreenForm.controls['action'].setValue(res.data.confirm);
        console.log('this.sreenForm.value', this.sreenForm.value);
      }
    });
    await modal.present();
  }

  async addSection(data?, index?) {

    const modal = await this._mod.create({
      cssClass: 'modal-small',
      component: AddSectionComponent,
      componentProps: {
        data,
        index
      }
    });

    modal.onDidDismiss().then(async (res: any) => {

      if (this._fun.isVarInvalid(res.data)) return;
      if (!this._fun.isVarInvalid(res.data.confirm)) {
        console.log(res.data.confirm);
        let arr = this.sreenForm.controls['fields'].value;
        if (this._fun.isVarInvalid(data)) arr.push(res.data.confirm);
        else arr[index] = res.data.confirm;
        this.sreenForm.controls['fields'].setValue(arr);

        console.log('LISTAAA', this.sreenForm.controls['fields'].value);

        this.getList();
      }

    });
    return await modal.present();
  }

  async form(data?, index?) {

    if (this._fun.isEmpty(this.listVisType, this.listFieldType, this.listInputType, this.listFieldCert)) return;

    const modal = await this._mod.create({
      component: AddFieldComponent,
      componentProps: {
        data,
        index,
        listVisType: this.listVisType,
        listFieldType: this.listFieldType,
        listInputType: this.listInputType,
        listFieldCert: this.listFieldCert
      }
    });

    modal.onDidDismiss().then(async (res: any) => {

      if (this._fun.isVarInvalid(res.data)) return;
      if (!this._fun.isVarInvalid(res.data.confirm)) {
        console.log(res.data.confirm);
        let arr = this.sreenForm.controls['fields'].value;
        if (this._fun.isVarInvalid(data)) arr.push(res.data.confirm);
        else arr[index] = res.data.confirm;
        this.sreenForm.controls['fields'].setValue(arr);
        /*         console.log(res.data.confirm.field.data.properties.SYSTEM); */
        console.log('this.sreenForm.value', this.sreenForm.value);
        this.getList();
      }
    });
    return await modal.present();
  }

  /* ********************************* */

  list_main = [];
  pageOfItems: Array<any>;
  list = [];
  load = false;

  orderBy = {
    key: '',
    order: true
  }

  thead = [
    { key: 'key', name: 'Código' },
    { key: 'name', name: 'Nombre' },
    { key: 'status', name: 'Requerido' },
    { key: 'maping', name: 'Mapeo (Certificado)' },

  ];

  optionFilter = [
    { key: 'key', value: '', type: 'string' }
  ];


  fields_CERT = [
    {
      "field": {
        "_id": "60e76c709a97170c24260694",
        "table": "field",
        "key": "objective_cert",
        "status": true,
        "name": "Asunto",
        "data": {
          "key": "objective_cert",
          "value": "",
          "placeholder": "Ingrese asunto de certificado",
          "type": {
            "collection": "general",
            "table": "type_field",
            "key": "C3",
            "value": "textarea",
            "properties": {}
          },
          "inputtype": {
            "collection": "general",
            "table": "type_input",
            "key": "C0",
            "value": "text",
            "properties": {}
          },
          "properties": {
            "SYSTEM": "C1"
          },
          "width": {
            "boost": "col-6",
            "porc": 50
          },
          "optionOf": "",
          "isSystem": false,
          "iscertificade": true,
          "certificateType": {
            "collection": "general",
            "table": "type_field_cert",
            "key": "C6",
            "value": "Asunto a certificar",
            "properties": {
              "codeApp": "objective_cert"
            }
          }
        }
      },
      system: true,
      properties: "",
      required: true,
      visibility_type: "C0"
    },
    {
      "field": {
        "key": "img_reg",
        "name": "Fotos de registro",
        "status": true,
        "table": "field",
        "_id": "60e48a789a97170c24260618",
        "data": {
          "key": "img_reg",
          "value": "",
          "placeholder": "Agregar fotos",
          "type": {
            "collection": "general",
            "table": "type_field",
            "key": "C5",
            "value": "imageselect"
          },
          "inputtype": {
            "collection": "general",
            "table": "type_input",
            "key": "C0",
            "value": "text"
          },
          "properties": "",
          "width": {
            "boost": "col-12",
            "porc": 100
          },
          "optionOf": "",
          "isSystem": false,
          "iscertificade": false
        }
      },
      system: false,
      properties: "",
      required: true,
      visibility_type: "C0"
    },
    {
      "field": {
        "_id": "60e4db529a97170c24260642",
        "table": "field",
        "key": "adrx_titular",
        "status": true,
        "name": "Titular ",
        "data": {
          "key": "adrx_titular",
          "value": "",
          "placeholder": "Ingrese DID (did:ethr:lacchain:address)",
          "type": {
            "collection": "general",
            "table": "type_field",
            "key": "C0",
            "value": "address",
            "properties": {}
          },
          "inputtype": {
            "collection": "general",
            "table": "type_input",
            "key": "C0",
            "value": "text",
            "properties": {}
          },
          "properties": {
            "SYSTEM": "C1"
          },
          "width": {
            "boost": "col-12",
            "porc": 100
          },
          "optionOf": "",
          "isSystem": false,
          "iscertificade": true,
          "certificateType": {
            "collection": "general",
            "table": "type_field_cert",
            "key": "C3",
            "value": "DID del titular",
            "properties": {
              "codeApp": "adrx_titular"
            }
          }
        }
      },
      system: true,
      properties: "",
      required: true,
      visibility_type: "C0"
    },
    {
      "field": {
        "_id": "60e85fa39a97170c2426069f",
        "table": "field",
        "key": "name_titular",
        "status": true,
        "name": "Nombre de titular",
        "data": {
          "key": "name_titular",
          "value": "",
          "placeholder": "Igrese nombre",
          "type": {
            "collection": "general",
            "table": "type_field",
            "key": "C2",
            "value": "input",
            "properties": {}
          },
          "inputtype": {
            "collection": "general",
            "table": "type_input",
            "key": "C0",
            "value": "text",
            "properties": {}
          },
          "properties": {
            "SYSTEM": "C1"
          },
          "width": {
            "boost": "col-12",
            "porc": 100
          },
          "optionOf": "",
          "isSystem": false,
          "iscertificade": true,
          "certificateType": {
            "collection": "general",
            "table": "type_field_cert",
            "key": "C4",
            "value": "Nombre del titular",
            "properties": {
              "codeApp": "name_titular"
            }
          }
        }
      },
      system: true,
      properties: "",
      required: true,
      visibility_type: "C0"
    },

 /*    {
      "field": {
        "_id": "60e48e0e9a97170c24260623",
        "table": "field",
        "key": "f_emision",
        "status": true,
        "name": "Fecha de emisión",
        "data": {
          "key": "f_emision",
          "value": "",
          "placeholder": "Ingresar fecha",
          "type": {
            "collection": "general",
            "table": "type_field",
            "key": "C2",
            "value": "input",
            "properties": {}
          },
          "inputtype": {
            "collection": "general",
            "table": "type_input",
            "key": "C4",
            "value": "date",
            "properties": {}
          },
          "properties": {
            "SYSTEM": "C1"
          },
          "width": {
            "boost": "col-12",
            "porc": 100
          },
          "optionOf": "",
          "isSystem": false,
          "iscertificade": true,
          "certificateType": {
            "collection": "general",
            "table": "type_field_cert",
            "key": "C7",
            "value": "Fecha de emisión",
            "properties": {
              "codeApp": "f_emision"
            }
          }
        }
      },
      system: true,
      properties: "",
      required: true,
      visibility_type: "C0"
    }, */
    {
      "field": {
        "_id": "60e48e389a97170c24260624",
        "table": "field",
        "key": "f_vencimiento",
        "status": true,
        "name": "Fecha de vencimiento",
        "data": {
          "key": "f_vencimiento",
          "value": "",
          "placeholder": "Ingresar fecha",
          "type": {
            "collection": "general",
            "table": "type_field",
            "key": "C2",
            "value": "input",
            "properties": {}
          },
          "inputtype": {
            "collection": "general",
            "table": "type_input",
            "key": "C4",
            "value": "date",
            "properties": {}
          },
          "properties": {
            "SYSTEM": "C1"
          },
          "width": {
            "boost": "col-12",
            "porc": 100
          },
          "optionOf": "",
          "isSystem": false,
          "iscertificade": true,
          "certificateType": {
            "collection": "general",
            "table": "type_field_cert",
            "key": "C8",
            "value": "Fecha de vencimineto",
            "properties": {
              "codeApp": "f_vencimiento"
            }
          }
        }
      },
      system: false,
      properties: "",
      required: true,
      visibility_type: "C0"
    }
  ];


  fieldGenQR = [
    {
      name: "Información comercial",
      code: 'infoComer',
      section: true,
      system: true
    },
    {
      field: {
        key: "objective_cert",
        name: "Asunto (Lote, SKU u Orden de compra)",
        data: {
          "key": "objective_cert",
          "value": "",
          "placeholder": "Ingresar texto",
          "type": {
            "collection": "general",
            "table": "type_field",
            "key": "C2",
            "value": "input",
            "properties": {}
          },
          "inputtype": {
            "collection": "general",
            "table": "type_input",
            "key": "C0",
            "value": "text",
            "properties": {}
          },
          "properties": {},
          "width": {
            "boost": "col-6",
            "porc": 50
          },
          "optionOf": "",
          "isSystem": false,
          "iscertificade": false,
          "certificateType": {
            "collection": "",
            "table": "",
            "key": "",
            "value": false,
            "properties": {}
          }
        }
      },
      system: true,
      properties: "",
      required: true,
      visibility_type: "C0"
    },
    {
      field: {
        key: "buyer",
        name: "Comprador",
        data: {
          "key": "buyer",
          "value": "",
          "placeholder": "Ingresar texto",
          "type": {
            "collection": "general",
            "table": "type_field",
            "key": "C2",
            "value": "input",
            "properties": {}
          },
          "inputtype": {
            "collection": "general",
            "table": "type_input",
            "key": "C0",
            "value": "text",
            "properties": {}
          },
          "properties": {},
          "width": {
            "boost": "col-6",
            "porc": 50
          },
          "optionOf": "",
          "isSystem": false,
          "iscertificade": false,
          "certificateType": {
            "collection": "",
            "table": "",
            "key": "",
            "value": false,
            "properties": {}
          }
        }
      },
      system: true,
      properties: "",
      required: true,
      visibility_type: "C0"
    },
    {
      field: {
        key: "amount",
        name: "Cantidad (Kg)",
        data: {
          "key": "amount",
          "value": "",
          "placeholder": "Ingresar número",
          "type": {
            "collection": "general",
            "table": "type_field",
            "key": "C2",
            "value": "input",
            "properties": {}
          },
          "inputtype": {
            "collection": "general",
            "table": "type_input",
            "key": "C0",
            "value": "number",
            "properties": {}
          },
          "properties": {},
          "width": {
            "boost": "col-6",
            "porc": 50
          },
          "optionOf": "",
          "isSystem": false,
          "iscertificade": false,
          "certificateType": {
            "collection": "",
            "table": "",
            "key": "",
            "value": false,
            "properties": {}
          }
        }
      },
      system: true,
      properties: "",
      required: true,
      visibility_type: "C0"
    },
    {
      field: {
        key: "origin",
        name: "Origen",
        data: {
          "key": "origin",
          "value": "",
          "placeholder": "Ingresar texto",
          "type": {
            "collection": "general",
            "table": "type_field",
            "key": "C2",
            "value": "input",
            "properties": {}
          },
          "inputtype": {
            "collection": "general",
            "table": "type_input",
            "key": "C0",
            "value": "text",
            "properties": {}
          },
          "properties": {},
          "width": {
            "boost": "col-6",
            "porc": 50
          },
          "optionOf": "",
          "isSystem": false,
          "iscertificade": false,
          "certificateType": {
            "collection": "",
            "table": "",
            "key": "",
            "value": false,
            "properties": {}
          }
        }
      },
      system: true,
      properties: "",
      required: true,
      visibility_type: "C0"
    },
    {
      field: {
        key: "destination",
        name: "Destino",
        data: {
          "key": "destination",
          "value": "",
          "placeholder": "Ingresar texto",
          "type": {
            "collection": "general",
            "table": "type_field",
            "key": "C2",
            "value": "input",
            "properties": {}
          },
          "inputtype": {
            "collection": "general",
            "table": "type_input",
            "key": "C0",
            "value": "text",
            "properties": {}
          },
          "properties": {},
          "width": {
            "boost": "col-6",
            "porc": 50
          },
          "optionOf": "",
          "isSystem": false,
          "iscertificade": false,
          "certificateType": {
            "collection": "",
            "table": "",
            "key": "",
            "value": false,
            "properties": {}
          }
        }
      },
      system: true,
      properties: "",
      required: true,
      visibility_type: "C0"
    },
    {
      field: {
        key: "f_emision",
        name: "Fecha de emisión",
        data: {
          "key": "f_emision",
          "value": "",
          "placeholder": "Seleccionar",
          "type": {
            "collection": "general",
            "table": "type_field",
            "key": "C2",
            "value": "input",
            "properties": {}
          },
          "inputtype": {
            "collection": "general",
            "table": "type_input",
            "key": "C4",
            "value": "date",
            "properties": {}
          },
          "properties": {},
          "width": {
            "boost": "col-6",
            "porc": 50
          },
          "optionOf": "",
          "isSystem": false,
          "iscertificade": false,
          "certificateType": {
            "collection": "",
            "table": "",
            "key": "",
            "value": false,
            "properties": {}
          }
        }
      },
      system: true,
      properties: "",
      required: true,
      visibility_type: "C0"
    },
    {
      field: {
        key: "f_vencimineto",
        name: "Fecha de vencimiento",
        data: {
          "key": "f_vencimineto",
          "value": "",
          "placeholder": "Seleccionar",
          "type": {
            "collection": "general",
            "table": "type_field",
            "key": "C2",
            "value": "input",
            "properties": {}
          },
          "inputtype": {
            "collection": "general",
            "table": "type_input",
            "key": "C4",
            "value": "date",
            "properties": {}
          },
          "properties": {},
          "width": {
            "boost": "col-6",
            "porc": 50
          },
          "optionOf": "",
          "isSystem": false,
          "iscertificade": false,
          "certificateType": {
            "collection": "",
            "table": "",
            "key": "",
            "value": false,
            "properties": {}
          }
        }
      },
      system: true,
      properties: "",
      required: true,
      visibility_type: "C0"
    },
    /*2da SECCION  */
    {
      name: "Información de producto",
      code: 'infoProd',
      section: true,
      system: true
    },
    {
      field: {
        key: "desc",
        name: "Descripción",
        data: {
          "key": "desc",
          "value": "",
          "placeholder": "Ingresar texto",
          "type": {
            "collection": "general",
            "table": "type_field",
            "key": "C2",
            "value": "input",
            "properties": {}
          },
          "inputtype": {
            "collection": "general",
            "table": "type_input",
            "key": "C0",
            "value": "text",
            "properties": {}
          },
          "properties": {},
          "width": {
            "boost": "col-6",
            "porc": 50
          },
          "optionOf": "",
          "isSystem": false,
          "iscertificade": false,
          "certificateType": {
            "collection": "",
            "table": "",
            "key": "",
            "value": false,
            "properties": {}
          }
        }
      },
      system: true,
      properties: "",
      required: true,
      visibility_type: "C0"
    },
    /*3da SECCION  */
    {
      name: "Procedencia de Materia Prima",
      code: 'procMP',
      section: true,
      system: true
    },
    /*4ta SECCION  */
    /*  {
       name: "Cadena de Suministro",
       code: 'cadeSumin',
       section: true,
       system: true
     }, */
    /*5ta SECCION  */
    {
      name: "Información de contacto",
      code: 'contact',
      section: true,
      system: true
    },
    {
      field: {
        key: "businessName",
        name: "Nombre de negocio",
        data: {
          "key": "businessName",
          "value": "",
          "placeholder": "Ingresar nombre",
          "type": {
            "collection": "general",
            "table": "type_field",
            "key": "C2",
            "value": "input",
            "properties": {}
          },
          "inputtype": {
            "collection": "general",
            "table": "type_input",
            "key": "C0",
            "value": "text",
            "properties": {}
          },
          "properties": {},
          "width": {
            "boost": "col-6",
            "porc": 50
          },
          "optionOf": "",
          "isSystem": false,
          "iscertificade": false,
          "certificateType": {
            "collection": "",
            "table": "",
            "key": "",
            "value": false,
            "properties": {}
          }
        }
      },
      system: true,
      properties: "",
      required: false,
      visibility_type: "C0"
    },
    {
      field: {
        key: "logoUrl",
        name: "Logo de negocio",
        data: {
          "key": "logoUrl",
          "value": "",
          "placeholder": "Ingresar URL",
          "type": {
            "collection": "general",
            "table": "type_field",
            "key": "C2",
            "value": "input",
            "properties": {}
          },
          "inputtype": {
            "collection": "general",
            "table": "type_input",
            "key": "C0",
            "value": "text",
            "properties": {}
          },
          "properties": {},
          "width": {
            "boost": "col-6",
            "porc": 50
          },
          "optionOf": "",
          "isSystem": false,
          "iscertificade": false,
          "certificateType": {
            "collection": "",
            "table": "",
            "key": "",
            "value": false,
            "properties": {}
          }
        }
      },
      system: true,
      properties: "",
      required: false,
      visibility_type: "C0"
    },

    {
      field: {
        key: "businessDesc",
        name: "Descripción del negocio",
        data: {
          "key": "businessDesc",
          "value": "",
          "placeholder": "Ingresar texto",
          "type": {
            "collection": "general",
            "table": "type_field",
            "key": "C3",
            "value": "textarea",
            "properties": {}
          },
          "inputtype": {
            "collection": "general",
            "table": "type_input",
            "key": "C0",
            "value": "text",
            "properties": {}
          },
          "properties": {},
          "width": {
            "boost": "col-12",
            "porc": 100
          },
          "optionOf": "",
          "isSystem": false,
          "iscertificade": false,
          "certificateType": {
            "collection": "",
            "table": "",
            "key": "",
            "value": false,
            "properties": {}
          }
        }
      },
      system: true,
      properties: "",
      required: false,
      visibility_type: "C0"
    },
    {
      field: {
        key: "facebook",
        name: "Facebook",
        data: {
          "key": "facebook",
          "value": "",
          "placeholder": "Ingresar URL",
          "type": {
            "collection": "general",
            "table": "type_field",
            "key": "C2",
            "value": "input",
            "properties": {}
          },
          "inputtype": {
            "collection": "general",
            "table": "type_input",
            "key": "C0",
            "value": "text",
            "properties": {}
          },
          "properties": {},
          "width": {
            "boost": "col-6",
            "porc": 50
          },
          "optionOf": "",
          "isSystem": false,
          "iscertificade": false,
          "certificateType": {
            "collection": "",
            "table": "",
            "key": "",
            "value": false,
            "properties": {}
          }
        }
      },
      system: true,
      properties: "",
      required: false,
      visibility_type: "C0"
    },
    {
      field: {
        key: "instagram",
        name: "Instagram",
        data: {
          "key": "instagram",
          "value": "",
          "placeholder": "Ingresar URL",
          "type": {
            "collection": "general",
            "table": "type_field",
            "key": "C2",
            "value": "input",
            "properties": {}
          },
          "inputtype": {
            "collection": "general",
            "table": "type_input",
            "key": "C0",
            "value": "text",
            "properties": {}
          },
          "properties": {},
          "width": {
            "boost": "col-6",
            "porc": 50
          },
          "optionOf": "",
          "isSystem": false,
          "iscertificade": false,
          "certificateType": {
            "collection": "",
            "table": "",
            "key": "",
            "value": false,
            "properties": {}
          }
        }
      },
      system: true,
      properties: "",
      required: false,
      visibility_type: "C0"
    },
    {
      field: {
        key: "linkedin",
        name: "Linkedin",
        data: {
          "key": "linkedin",
          "value": "",
          "placeholder": "Ingresar URL",
          "type": {
            "collection": "general",
            "table": "type_field",
            "key": "C2",
            "value": "input",
            "properties": {}
          },
          "inputtype": {
            "collection": "general",
            "table": "type_input",
            "key": "C0",
            "value": "text",
            "properties": {}
          },
          "properties": {},
          "width": {
            "boost": "col-6",
            "porc": 50
          },
          "optionOf": "",
          "isSystem": false,
          "iscertificade": false,
          "certificateType": {
            "collection": "",
            "table": "",
            "key": "",
            "value": false,
            "properties": {}
          }
        }
      },
      system: true,
      properties: "",
      required: false,
      visibility_type: "C0"
    },
    {
      field: {
        key: "youtube",
        name: "Youtube",
        data: {
          "key": "youtube",
          "value": "",
          "placeholder": "Ingresar URL",
          "type": {
            "collection": "general",
            "table": "type_field",
            "key": "C2",
            "value": "input",
            "properties": {}
          },
          "inputtype": {
            "collection": "general",
            "table": "type_input",
            "key": "C0",
            "value": "text",
            "properties": {}
          },
          "properties": {},
          "width": {
            "boost": "col-6",
            "porc": 50
          },
          "optionOf": "",
          "isSystem": false,
          "iscertificade": false,
          "certificateType": {
            "collection": "",
            "table": "",
            "key": "",
            "value": false,
            "properties": {}
          }
        }
      },
      system: true,
      properties: "",
      required: false,
      visibility_type: "C0"
    },
    {
      field: {
        key: "correo",
        name: "Correo",
        data: {
          "key": "correo",
          "value": "",
          "placeholder": "Ingresar correo de contacto",
          "type": {
            "collection": "general",
            "table": "type_field",
            "key": "C2",
            "value": "input",
            "properties": {}
          },
          "inputtype": {
            "collection": "general",
            "table": "type_input",
            "key": "C0",
            "value": "text",
            "properties": {}
          },
          "properties": {},
          "width": {
            "boost": "col-6",
            "porc": 50
          },
          "optionOf": "",
          "isSystem": false,
          "iscertificade": false,
          "certificateType": {
            "collection": "",
            "table": "",
            "key": "",
            "value": false,
            "properties": {}
          }
        }
      },
      system: true,
      properties: "",
      required: false,
      visibility_type: "C0"
    },
    {
      field: {
        key: "web",
        name: "Pagina web oficial",
        data: {
          "key": "correo",
          "value": "",
          "placeholder": "Ingresar URL",
          "type": {
            "collection": "general",
            "table": "type_field",
            "key": "C2",
            "value": "input",
            "properties": {}
          },
          "inputtype": {
            "collection": "general",
            "table": "type_input",
            "key": "C0",
            "value": "text",
            "properties": {}
          },
          "properties": {},
          "width": {
            "boost": "col-6",
            "porc": 50
          },
          "optionOf": "",
          "isSystem": false,
          "iscertificade": false,
          "certificateType": {
            "collection": "",
            "table": "",
            "key": "",
            "value": false,
            "properties": {}
          }
        }
      },
      system: true,
      properties: "",
      required: false,
      visibility_type: "C0"
    },

    {
      name: "Fotos y videos",
      code: 'fotVid',
      section: true,
      system: true
    },
  ];



  async getList() {
    this.load = true;
    try {
      this.list_main = this.sreenForm.controls['fields'].value;
      console.log('this.list_main', this.list_main);

      this.list = this.list_main;

      /*  this.filter(); */
      this.orderBy.order = true;
      this.orderBy.key = '';
      /*  this.orderByTable('key'); */

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
    /*   this.filter(); */
  }

  filter() {
    this.list = this.list_main.filter(a => {
      a = a.field;
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
    /*  this.orderList(); */
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


  async delete(index) {
    let arr = this.sreenForm.controls['fields'].value;
    arr.splice(index, 1);
    this.sreenForm.controls['fields'].setValue(arr);
    this.getList();
  }



  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  /* ************************* */

  async screenTask() {
    console.log('LIST', this.list);
    /*   return; */

    let metadata =
    {
      code: '001',
      title: this.sreenForm.value.name == '' ? 'Sin titulo' : this.sreenForm.value.name,
      icon: '',
      buttons: [
        {
          color: '#fff',
          background: '#1c1c24',
          width: '50',
          text: 'Terminar',
          type: 'confirm'// confirm |  cancel  
        }
      ],
      fields: []
    };

    for (let index = 0; index < this.list.length; index++) {
      const fld = this.list[index];
      console.log('FLD', fld);
      let options = [];
      if (fld.field.data.type.value == 'select' || fld.field.data.type.value == 'checkbox') {
        let res: any = await this._apiMongo.get(env.COLLECTION.general, fld.field.data.tableSelect.key, 'items');
        options = res.result[0][fld.field.data.tableSelect.key];
      }

      if (fld.field.data.type.value == 'searchUser') options.push(fld.field.data.tableSelect);

      let f = {
        code: fld.field.key,//key
        caption: fld.field.name,// name
        value: fld.field.data.value,
        placeholder: fld.field.data.placeholder,//PLaceholder
        type: fld.field.data.type.value, // address | photos | select | textbox | input 
        inputtype: fld.field.data.inputtype.value, // type.value
        rows: null,
        width: fld.field.data.width,
        long: null,//Longitud de caracteres o números
        max: 0,
        min: 0,// Para valores numéricos| fotos o fechas.
        options: options,
        required: fld.required, // requeride
        properties: fld.field.data.properties || null,
        propertiesConfig: fld.properties || null
      };

      metadata.fields.push(f);
      /* console.log('PUSH', metadata); */


      if (index == (this.list.length - 1)) {

        const modal = await this._mod.create({
          component: GenScreenComponent,
          /* cssClass: 'modal-small', */
          componentProps: {
            preview: true,
            metadata,
            task: {},
            data: {},/* ,
            listTypeUnid: this.listTypeUnid */
          }
        });

        modal.onDidDismiss().then(async (res: any) => {
          console.log(res.data);
          if (this._fun.isVarInvalid(res.data)) return;
          if (!this._fun.isVarInvalid(res.data.confirm)) this.getList();
        });
        return await modal.present();
      }
    }

  }


}
