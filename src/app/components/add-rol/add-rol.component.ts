import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { Funciones } from 'src/app/compartido/funciones';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-add-rol',
  templateUrl: './add-rol.component.html',
  styleUrls: ['./add-rol.component.scss'],
})
export class AddRolComponent implements OnInit {

  rolForm: FormGroup;
  data: any;
  isEdit = false;

  /* VAR SELECCT MULTIPLE */
  processSelect = [];

  constructor(
    private _fun: Funciones,
    private _apiMongo: ApiMongoService,
    private _modal: ModalController,
    public formBuilder: FormBuilder) {
    this.rolForm = formBuilder.group({
      key: ['', this._fun.validatorkey],
      name: ['', Validators.required],
      acc_web: [false],
      acc_app: [false]
    });
  }

  conf_web = [
    {
      name: 'Administración',
      modules: [
        { name: 'Usuarios', code: 'use', value: false, section: 'amd' },
        { name: 'Roles', code: 'rol', value: false, section: 'amd' }
      ]
    },
    {
      name: 'Configuración',
      modules: [
        { name: 'Pantallas', code: 'scr', value: false, section: 'con' },
        { name: 'Campos', code: 'fie', value: false, section: 'con' },
        { name: 'Acciones', code: 'acc', value: false, section: 'con' },
        { name: 'Parámetros', code: 'par', value: false, section: 'con' }
      ]
    }
  ];



  conf_web1 = [
    {
      "name": "Usuarios",
      url: '/users',
      icon: 'people',
      "modules": [],
      value: false
    },
    {
      "name": "Roles",
      url: '/roles',
      icon: 'shield-half-outline',
      "modules": [],
      value: false
    },
    {
      "name": "Configuración",
      url: '/config',
      icon: 'build-outline',
      "modules": [
        { name: 'Pantallas', url: '/pantalla', icon: 'today-outline', value: false },
        { name: 'Campos', url: '/campos', icon: 'grid-outline', value: false },
        { name: 'Acciones', url: '/acciones', icon: 'repeat-outline', value: false },
        { name: 'Parámetros', url: '/param', icon: 'apps', value: false }
      ]
    }
  ]

  conf_app = [];
  listScreen = [];

  ngOnInit() {
    if (!this._fun.isVarInvalid(this.data)) this.editData();
    this.getList();
  }

  /* LIST SCREEN */
  async getList() {
    try {
      const res: any = await this._apiMongo.get(env.COLLECTION.object, env.TABLE_SIS.screen, 'items');
      if (this._fun.isEmpty(res.result)) return;

      let list = res.result[0].screen/* .filter(s => s.data.certificateType.key == 'C1' || s.data.certificateType.key == 'C4') */;

      for (let index = 0; index < list.length; index++) {
        const scr = list[index];
        scr.value = false;
         if (this.isEdit) {
           if (this.data.data.conf_app.length > 0) {
             let arr = this.data.data.conf_app.filter(i => i.key == scr.key)
             if (arr.length != 0) scr.value = true;
           }
         }


        this.listScreen.push(scr);
      }
      console.log('this.listScreen', this.listScreen);

    } catch (error) {
      await this._fun.alertError(error);
    }
  }


  changeInput(value) {
    value = value.detail.checked;
    if (!value) this.resetConWeb();
    console.log('this.conf_web', this.conf_web);
  }

  valueConfWeb(value, i0, i1) {
    value = value.detail.checked;
    this.conf_web[i0].modules[i1].value = value;
    console.log('this.conf_web', this.conf_web);
  }

  valueConfApp(value, i1) {
    value = value.detail.checked;
    this.listScreen[i1].value = value;
    console.log('this.conf_web', this.listScreen);
  }

  resetConWeb() {
    this.conf_web.forEach(item => {
      item.modules.forEach(md => {
        md.value = false;
      })
    });
  }

  async editData() {
    this.isEdit = true;
    console.log('this.data', this.data);

    this.conf_web = this.data.data.conf_web;//<--

    let data: any = this.data.data;
    data.name = this.data.name;
    data.key = this.data.key;

    this.rolForm.patchValue(data);
    console.log(' this.rolForm', this.rolForm.value);
  }

  tiggerFields() {
    Object.keys(this.rolForm.controls).forEach(field => {
      let _control = this.rolForm.get(field);
      if (_control instanceof FormControl)
        _control.markAsTouched({ onlySelf: true });
    });
  }

  async validateForm() {
    console.log('conf_web', this.conf_web);
    this.tiggerFields();
    if (this.rolForm.valid) {
      let alert = await this._fun.alertSave(this.isEdit);
      if (this._fun.isVarInvalid(alert)) return;
      this.create();
    }
  }

  async create() {

    let conf_app = this.listScreen.filter(r => r.value == true);

    var body: any = {
      name: this.rolForm.value.name,
      count: 0,
      eliminabled: true,
      process: this.rolForm.value.process,
      conf_web: this.conf_web,
      conf_app: conf_app,
      acc_web: this.rolForm.value.acc_web,
      acc_app: this.rolForm.value.acc_app
    }

    try {
      const res: any = await this._apiMongo.create(env.COLLECTION.general, env.TABLE_SIS.role, this.rolForm.value.key, body, this.isEdit);
      if (this._fun.isVarInvalid(res.result)) {
        await this._fun.alertError(res.message);
        return;
      }
      this.confirm();
      await this._fun.alertSucc(this.isEdit ? env.MSG.SUC_UPDATE : env.MSG.SUC_CREATE);
    } catch (error) {
      await this._fun.alertError(error);
    }

  }

  closeModal() {
    this._modal.dismiss({ confirm: false });
  }

  confirm() {
    this._modal.dismiss({ confirm: true });
  }

}
