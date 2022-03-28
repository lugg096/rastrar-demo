import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Funciones } from 'src/app/compartido/funciones';
import { ListSelectComponent } from 'src/app/components/list-select/list-select.component';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data-service.service';
import { IonicComponentsService } from 'src/app/services/ionic-components.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment as env } from 'src/environments/environment';
import { GenerationFormComponent } from '../generation-form/generation-form.component';
import { ListMultiSelectComponent } from '../list-multi-select/list-multi-select.component';

@Component({
  selector: 'app-list-screen',
  templateUrl: './list-screen.component.html',
  styleUrls: ['./list-screen.component.scss'],
})
export class ListScreenComponent implements OnInit {

  constructor(
    private _authService: AuthService,
    public _comp: IonicComponentsService,
    private _apiMongo: ApiMongoService,
    private _fun: Funciones,
    public _modal: ModalController,
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
      /*       if (fld.field.data.type.value == 'select' || fld.field.data.type.value == 'checkbox') {
              let listParams = await this.db.getData(null, fld.field.data.tableSelect.key) || [];
              console.log('listParams', listParams);
              options = listParams;
            } */

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


  goGestion() {
    this.router.navigate(['gestion']);
  }

  async goGeneration(screen) {
    console.log('screen', screen);
    let loading :any = await this._comp.presentLoading();

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
        console.log('field',field);
        console.log('FIELD CONFIG', f_config);
        sectionConfig[countSection].fields.push(f_config);
      }

      if (index == (screen.fields.length - 1)) {
        console.log('sectionConfig', sectionConfig);
        console.log('DATA_SEND', { sectionConfig, dataSreen });
        loading.dismiss();
        this.formScreen({ sectionConfig, dataSreen });
      }
    }
  }


  async formScreen(screenData) {
    const modal = await this._modal.create({
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
        await this._modal.dismiss({ confirm: true });
        this.confirm();//MANDAR A REFRESCAR
        this.confirm();
       }

    });

    await modal.present();

  }


  async configField2(field) {

    const fld = field
    let options = [];
    if (fld.field.data.type.value == 'select' || fld.field.data.type.value == 'checkbox') {
      let res: any = await this._apiMongo.get(env.COLLECTION.general, fld.field.data.tableSelect.key, 'items');
      console.log('RESPIESYA DE LSIATDO', res.result[0][fld.field.data.tableSelect.key]);
      options = res.result[0][fld.field.data.tableSelect.key];
      //options = [];
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
      component: ListMultiSelectComponent,
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


        let storage_screenUser = await this._storage.get('screenUser') || [];
        for (let index = 0; index < res.data.list.length; index++) {
          let elemt = res.data.list[index];
          let DNI_USER = this._authService.userData.data.idens[0].number;/* this._storage.userSesion.DNI; */
          let res_screenUser = await this._apiMongo.create(env.COLLECTION.screenUser, DNI_USER, elemt.key, elemt, true);

          let indexScreenUpdate = storage_screenUser.findIndex(r => r.key == elemt.key);
          if (indexScreenUpdate != -1) storage_screenUser[indexScreenUpdate] = elemt;
          else storage_screenUser.push(elemt);

          if (index == (res.data.list.length - 1)) {
            await this._storage.set('screenUser', storage_screenUser);
            this.initScreens();

            loading.dismiss();
          }
        }
      }
    });

    await modal.present();

  }

  async initScreens() {

    let res_screen = await this._storage.get('screenUser') || [];
    console.log('res_screen', res_screen);

    this.listScreen = [];
    for (let index = 0; index < res_screen.length; index++) {
      let screen = res_screen[index].data;
      screen.key = res_screen[index].key;
      screen.name = res_screen[index].name;
      this.listScreen.push(screen);
    }
    console.log('this.listScreen', this.listScreen);
  }


  async deleteSreen(data) {
    console.log('MOSTRAR');


    let confirm = await this._fun.alert(env.MSG.TYPE_ALERT, 'Si, eliminar', env.MSG.ALERT_TITLE, 'Desea eliminar formulario para generación de QR?');
    if (!confirm) return;
    /*     return; */
    let loading: any = await this._comp.presentLoading();
    let DNI_USER = this._authService.userData.data.idens[0].number;/* this._storage.userSesion.DNI; */

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
      let DNI_USER = this._authService.userData.data.idens[0].number;;
      const res: any = await this._apiMongo.get(env.COLLECTION.screenUser, DNI_USER, 'items');
      console.log('res_list', res);
      if (this._fun.isEmpty(res.result)) {
        /* this.load = false; */
        await this._storage.set('screenUser', []);
        resolve(false);
        return;
      }

      let listScreen = []
      for (let index = 0; index < res.result[0][DNI_USER].length; index++) {
        let screen = res.result[0][DNI_USER][index].data;
        screen.key = res.result[0][DNI_USER][index].key;
        screen.name = res.result[0][DNI_USER][index].name;
        listScreen.push(screen);
        if (index == (res.result[0][DNI_USER].length - 1)) {
          await this._storage.set('screenUser', listScreen);
          resolve(true);
        }
      }

    });


  }



  closeModal() {
    this._modal.dismiss({ confirm: false });
  }

  confirm() {
    this._modal.dismiss({ confirm: true });
  }


}
