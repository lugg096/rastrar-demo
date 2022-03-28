import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Funciones } from 'src/app/compartido/funciones';
import { ListSelectComponent } from 'src/app/components/list-select/list-select.component';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { DataService } from 'src/app/services/data-service.service';
import { DatabaseService } from 'src/app/services/database.service';
import { IonicComponentsService } from 'src/app/services/ionic-components.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment as env } from 'src/environments/environment';
import { Screen } from '../../interface/interfaces';

@Component({
  selector: 'app-select-screen',
  templateUrl: './select-screen.page.html',
  styleUrls: ['./select-screen.page.scss'],
})
export class SelectScreenPage implements OnInit {

  constructor(
    public _comp: IonicComponentsService,
    private _apiMongo: ApiMongoService,
    private _fun: Funciones,
    public _modal: ModalController,
    private db: DatabaseService,
    private _data: DataService,
    public router: Router,
    private _storage: StorageService,) { }

  _env = env;
  listScreen = [];

  ngOnInit() {
    this.initScreens();
    let a = 'asdadasd';
    let b = '1334';

    let c = Number(b);
    console.log('c', c);

    let d = Number(a);
    console.log('d', d);
  }


  async screenTask(screen) {

    console.log('screen', screen);


    let list = screen.fields;
    console.log('LISTADO DE CAMPOS', list);
    /*   return; */

    let metadata =
    {
      code: screen.key,
      title: screen.name,
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
      fields: [],
      certificateType: screen.certificateType
    };

    for (let index = 0; index < list.length; index++) {
      const fld = list[index];
      let options = [];
      if (fld.field.data.type.value == 'select' || fld.field.data.type.value == 'checkbox') {
        let listParams = await this.db.getData(null, fld.field.data.tableSelect.key) || [];
        console.log('listParams', listParams);

        options = listParams;
        /* let res: any = await this._apiMongo.get(env.COLLECTION.general, fld.field.data.tableSelect.key, 'items');
        options = res.result[0][fld.field.data.tableSelect.key]; */
      }

      //if (fld.field.data.type.value == 'searchUser') options.push(fld.field.data.tableSelect);

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
        propertiesConfig: fld.properties || fld.field.data.properties || null,
        visibility_type: fld.visibility_type
      };

      console.log('FIELD CONFIG', f);
      /*  if(f.code!='g_prod_com') */
      metadata.fields.push(f);
      /* console.log('PUSH', metadata); */

      if (index == (list.length - 1)) {
        this._data.dataSendForm.next(metadata);
        this.router.navigate(['/registro/' + null]);
      }
    }

  }

  campos = [
    {
      caption: "Asunto",
      code: "objective_cert",
      inputtype: "text",
      long: null,
      max: 0,
      min: 0,
      options: [],
      placeholder: "Ingrese asunto de certificado",
      propertiesConfig: { valueDefault: "getTitleScreen()" },
      required: true,
      rows: null,
      type: "textarea",
      value: "",
      width: { boost: "col-6", porc: 50 }
    },
    {
      caption: "Titular ",
      code: "adrx_titular",
      inputtype: "text",
      long: null,
      max: 0,
      min: 0,
      options: [],
      placeholder: "Ingrese DID (did:ethr:lacchain:address)",
      propertiesConfig: null,
      required: true,
      rows: null,
      type: "address",
      value: "",
      width: { boost: "col-12", porc: 100 }
    },
    {
      caption: "Nombre de titular",
      code: "name_titular",
      inputtype: "text",
      long: null,
      max: 0,
      min: 0,
      options: [],
      placeholder: "Igrese nombre",
      propertiesConfig: null,
      required: true,
      rows: null,
      type: "input",
      value: "",
      width: { boost: "col-12", porc: 100 }
    },
    {
      caption: "Cant. suri",
      code: "cant_suri",
      inputtype: "number",
      long: null,
      max: 0,
      min: 0,
      options: [],
      placeholder: "Ingresar cantidad",
      propertiesConfig: null,
      required: true,
      rows: null,
      type: "input",
      value: "",
      width: { boost: "col-12", porc: 100 }
    },
    {
      caption: "Cant. huacaya",
      code: "cant_huacaya",
      inputtype: "number",
      long: null,
      max: 0,
      min: 0,
      options: [],
      placeholder: "Ingresar cantidad",
      propertiesConfig: null,
      required: true,
      rows: null,
      type: "input",
      value: "",
      width: { boost: "col-12", porc: 100 }
    },
    {
      caption: "Machos reprod. suri",
      code: "macho_rep_suri",
      inputtype: "number",
      long: null,
      max: 0,
      min: 0,
      options: [],
      placeholder: "Ingresar cantidad",
      propertiesConfig: null,
      required: true,
      rows: null,
      type: "input",
      value: "",
      width: { boost: "col-12", porc: 100 }
    },
    {
      caption: "Machos reprod. huacaya",
      code: "macho_rep_huacaya",
      inputtype: "number",
      long: null,
      max: 0,
      min: 0,
      options: [],
      placeholder: "Ingresar cantidad",
      propertiesConfig: null,
      required: true,
      rows: null,
      type: "input",
      value: "",
      width: { boost: "col-12", porc: 100 }
    },
    {
      caption: "Infraestructura",
      code: "tipo_campana_san",
      inputtype: "text",
      long: null,
      max: 0,
      min: 0,
      options: [
        {
          data: "{\"properties\":\"\"}",
          key: "C0",
          name: "Covertizo",
          status: "true"
        },
        {
          data: "{\"properties\":\"\"}",
          key: "C1",
          name: "Potreros",
          status: "true"
        },
        {
          data: "{\"properties\":\"\"}",
          key: "C2",
          name: "Fuente de agua",
          status: "true"
        },
        {
          data: "{\"properties\":\"\"}",
          key: "C3",
          name: "Módulo de empadre",
          status: "true"
        },
        {
          data: "{\"properties\":\"\"}",
          key: "C4",
          name: "Dormidero móvil",
          status: "true"
        },
        {
          data: "{\"properties\":\"\"}",
          key: "C5",
          name: "Reservorio",
          status: "true"
        },
        {
          data: "{\"properties\":\"\"}",
          key: "C6",
          name: "Sistema de riego",
          status: "true"
        },
        {
          data: "{\"properties\":\"\"}",
          key: "C7",
          name: "Área de esquila",
          status: "true"
        },
        {
          data: "{\"properties\":\"\"}",
          key: "C8",
          name: "Otros",
          status: "true"
        },


      ],
      placeholder: "Seleccionar",
      propertiesConfig: null,
      required: true,
      rows: null,
      type: "checkbox",
      value: "",
      width: { boost: "col-6", porc: 50 }
    },
    {
      caption: "Fecha de emisión",
      code: "f_emision",
      inputtype: "date",
      long: null,
      max: 0,
      min: 0,
      options: [],
      placeholder: "Ingresar fecha",
      propertiesConfig: { valueDefault: "getDate()" },
      required: true,
      rows: null,
      type: "input",
      value: "",
      width: { boost: "col-12", porc: 100 }
    }

  ]


  async pruebaScreen() {

    let metadata =
    {
      code: '11112122222222222',
      title: 'Certificado situacional',
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
      fields: [],
      certificateType: { key: 'C1' }
    };
    for (let index = 0; index < this.campos.length; index++) {
      metadata.fields.push(this.campos[index]);
      console.log('metadata', metadata);
      if (index == (this.campos.length - 1)) {
        this._data.dataSendForm.next(metadata);
        this.router.navigate(['/registro/' + null]);
      }
    }

  }


  goGestion() {
    this.router.navigate(['gestion']);
  }

  async goGeneration(screen) {
    console.log('screen', screen);

    let dataSreen = {
      description: screen.description,
      imagenUrl: screen.imagenUrl,
      name: screen.name
    };

    let sectionConfig = [];
    let countSection = -1;
    for (let index = 0; index < screen.fields.length; index++) {

      let field = screen.fields[index];
      if (field.section) {
        sectionConfig.push({ section: field, fields: [] })
        countSection++;
      } else {
        let f_config = await this.configField2(field);
        console.log('FIELD CONFIG', f_config);
        sectionConfig[countSection].fields.push(f_config);
      }

      if (index == (screen.fields.length - 1)) {
        console.log('sectionConfig', sectionConfig);
        this._data.dataGeneration.next({ sectionConfig, dataSreen });
        this.router.navigate(['/generation/' + null]);
      }
    }

    return;
    this.router.navigate(['generation']);
  }

  async configField2(field) {

    const fld = field
    let options = [];
    if (fld.field.data.type.value == 'select' || fld.field.data.type.value == 'checkbox') {
      let listParams = await this.db.getData(null, fld.field.data.tableSelect.key) || [];
      console.log('listParams', listParams);
      options = listParams;
    }

    return {
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
      propertiesConfig: fld.properties || fld.field.data.properties || null,
      visibility_type: fld.visibility_type
    };
  }

  async configField(list) {
    let metadata = [];

    for (let index = 0; index < list.length; index++) {
      const fld = list[index];
      let options = [];
      if (fld.field.data.type.value == 'select' || fld.field.data.type.value == 'checkbox') {
        let listParams = await this.db.getData(null, fld.field.data.tableSelect.key) || [];
        console.log('listParams', listParams);

        options = listParams;
        /* let res: any = await this._apiMongo.get(env.COLLECTION.general, fld.field.data.tableSelect.key, 'items');
        options = res.result[0][fld.field.data.tableSelect.key]; */
      }

      //if (fld.field.data.type.value == 'searchUser') options.push(fld.field.data.tableSelect);

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
        propertiesConfig: fld.properties || fld.field.data.properties || null,
        visibility_type: fld.visibility_type
      };

      console.log('FIELD CONFIG', f);
      /*  if(f.code!='g_prod_com') */
      metadata.push(f);
      /* console.log('PUSH', metadata); */

      if (index == (list.length - 1)) {
        return metadata;
      }
    }
  }

  async selectList() {

    let loading: any = await this._comp.presentLoading();
    let res: any = await this._apiMongo
      .filter(env.COLLECTION.object, env.TABLE_SIS.screen, { "data.certificateType.key": 'C2', });

    console.log('res', res.result[0].screen);
    let list_main = res.result[0].screen;

    loading.dismiss();
    const modal = await this._modal.create({
      /*  cssClass: 'style-list-select', */
      backdropDismiss: false,
      component: ListSelectComponent,
      componentProps: {
        list_main,
        title: 'Agregar Producto',
        label: 'description'
      }
    });
    modal.onDidDismiss().then(async (res: any) => {
      console.log('res', res);
      if (this._fun.isVarInvalid(res.data)) return;
      if (!this._fun.isEmpty(res.data.list)) {
        loading = await this._comp.presentLoading();
        console.log('res.data.list', res.data.list);
        console.log('new Screen()', new Screen());

        let storage_screenUser = await this._storage.getLocalStorage('screenUser') || [];
        for (let index = 0; index < res.data.list.length; index++) {
          let elemt = res.data.list[index];
          let DNI_USER = '72930779';/* this._storage.userSesion.DNI; */
          let res_screenUser = await this._apiMongo.create(env.COLLECTION.screenUser, DNI_USER, elemt.key, elemt, true);

          let indexScreenUpdate = storage_screenUser.findIndex(r => r.key == elemt.key);
          if (indexScreenUpdate != -1)  storage_screenUser[indexScreenUpdate] = elemt;
          else storage_screenUser.push(elemt);
          
          if (index == (res.data.list.length - 1)) {
            await this._storage.setLocalStorage('screenUser', storage_screenUser);
            this.initScreens();
            loading.dismiss();
          }
        }
      }
    });
    await modal.present();

  }

  async initScreens() {

    let res_screen = await this._storage.getLocalStorage('screenUser') || [];

    this.listScreen = [];
    for (let index = 0; index < res_screen.length; index++) {
      let screen = res_screen[index].data;
      screen.key = res_screen[index].key;
      this.listScreen.push(screen);
    }
    console.log('this.listScreen', this.listScreen);
  }


  async deleteSreen(data) {

    let confirm = await this._fun.alert(env.MSG.TYPE_ALERT, 'Si, eliminar', env.MSG.ALERT_TITLE, 'Desea eliminar formulario para generación de QR?', 'Cancelar');
    if (!confirm) return;
    let loading: any = await this._comp.presentLoading();
    let DNI_USER = '72930779';/* this._storage.userSesion.DNI; */

    try {
      console.log('data.key', data.key);


      let res_delete = await this._apiMongo.delete(env.COLLECTION.screenUser, DNI_USER, data.key);
      console.log('res_delete', res_delete);

      await this.updateListScreen();
      this.initScreens();
      loading.dismiss();
      await this._fun.alertSucc(env.MSG.SUC_DELETE);
    } catch (error) {
      loading.dismiss();
      await this._fun.alertError(error);
    }
  }


  async updateListScreen() {
    return new Promise(async resolve => {
      let DNI_USER = '72930779';
      const res: any = await this._apiMongo.get(env.COLLECTION.screenUser, DNI_USER, 'items');
      console.log('res_list', res);
      if (this._fun.isEmpty(res.result)) {
        /* this.load = false; */
        await this._storage.setLocalStorage('screenUser', []);
        resolve(false);
        return;
      }

      let listScreen = []
      for (let index = 0; index < res.result[0][DNI_USER].length; index++) {
        let screen = res.result[0][DNI_USER][index].data;
        screen.key = res.result[0][DNI_USER][index].key;
        listScreen.push(screen);
        if (index == (res.result[0][DNI_USER].length - 1)) {
          await this._storage.setLocalStorage('screenUser', listScreen);
          resolve(true);
        }
      }

    });


  }



}
