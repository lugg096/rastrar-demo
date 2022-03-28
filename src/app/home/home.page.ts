import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IonicComponentsService } from '../services/ionic-components.service';
import { Router } from '@angular/router';
/* import { DatabaseService } from '../services/database.service'; */
import { sha256, sha224 } from 'js-sha256';
import { StorageService } from '../services/storage.service';
/* import { User, Screen } from '../interface/interfaces';
import { Web3jsService } from '../services/web3js.service'; */
import { environment as env } from 'src/environments/environment';
import { ApiMongoService } from '../services/apiMongo.service';
import { Funciones } from '../compartido/funciones';
import { AppComponent } from '../app.component';

import { Plugins } from '@capacitor/core';
import { AuthService } from '../services/auth.service';
const { Geolocation, Network } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('slidesPadre', { static: false }) private slidesPadre: IonSlides;
  @ViewChild('slidesDatos', { static: false }) private slidesDatos: IonSlides;

  public loginForm: FormGroup;
  accountForm: FormGroup;
  public load = true;
  public indexSlide = 0;
  public initEnd = false;
  public viewPass = false;
  public tipo = "password";
  slideNewAccount = false;
  slideLogin = true;
  methodNewAccount = false;

  public submitAttempt: boolean = false;

  public dataUserDB: any = {
    publicKey: '',
    privateKey: ''
  };
  public dataUserMongoDB: any;
  public dataScreensDB = [];

  constructor(
    private _auth: AuthService,
    private appComp: AppComponent,
    private _fun: Funciones,
    private _apiMongo: ApiMongoService,
    private _storage: StorageService,
    public router: Router,
    public formBuilder: FormBuilder,
    public _comp: IonicComponentsService) {
    this.initForm();
  }

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    speed: 700,
    autoplay: {
      delay: 2500,
    },
  };

  slideOptsOnboarding = {
    allowSlideNext: false,
    allowSlidePrev: false,
    slidesPerView: 1,
    initialSlide: 0,
    speed: 400
  };

  getCurrentPosition: any;

  async getLocation() {
    this.getCurrentPosition = await Geolocation.getCurrentPosition();
    console.log('Current position:', this.getCurrentPosition);
  }

  async connetionStatus() {
    let connection = await Network.getStatus();
  }

  ngOnInit() {
    this.connetionStatus();
    this.getLocation();
  }

  tiggerFields(form) {
    Object.keys(form.controls).forEach(field => {
      let _control = form.get(field);
      if (_control instanceof FormControl)
        _control.markAsTouched({ onlySelf: true });
    });
  }

  async validateForm() {
    this.tiggerFields(this.accountForm);
    if (this.accountForm.valid) this.createAccount();
  }


  validateFormLogin() {
    this.slideNewAccount = false;
    this.tiggerFields(this.loginForm);
    if (this.loginForm.valid) this.login();
  }

  ter = false;

  checkboxClick(e) {
    console.log(e);
    this.ter = e.detail.checked;
  }

  initForm() {
    this.accountForm = this.formBuilder.group({
      name: ['', Validators.required],
      dni: ['', Validators.required],
      email: ['', Validators.required],
      pass: ['', Validators.required]
    });

    this.loginForm = this.formBuilder.group({
      pass: ['', Validators.required],
      email: ['', Validators.required]/* ,
      secreto1: ['', Validators.required], */
    });
  }


  async setParamas() {
    /*     let updateParams = await this.storage.getLocalStorage('updateParams');
        if (!this._fun.isVarInvalid(updateParams)) return;
    
        this._apiMongo._get(env.COLLECTION.general, env.TABLE_SIS.tables, 'items').subscribe(async (res: any) => {
    
          let tablas = res.result[0].tables;
    
          for (let index = 0; index < tablas.length; index++) {
            const tabla = tablas[index];
            let createTable = await this.db.createTable(tabla.key, 'default');
            console.log('createTable', createTable);
            if (!createTable) {
              await this.storage.setLocalStorage('updateParams', false);
              return;
            }
    
            this._apiMongo._get(env.COLLECTION.general, tabla.key, 'items').subscribe(async (data_i: any) => {
              let items = data_i.result[0][tabla.key];
              console.log('items DB', items);
              items = this._fun.patchValueJsonStrArry({ data: '', key: '', name: '', status: '' }, items)
              console.log('items', items);
              let savedItems = await this.db.addData(items, tabla.key);
              console.log('savedItems', savedItems);
              let listParams = await this.db.getData(null, tabla.key) || [];
              console.log('listParams', listParams);
              if (!savedItems) {
                await this.storage.setLocalStorage('updateParams', false);
                return;
              }
            });
    
            if (index == (tablas.length - 1)) {
              await this.storage.setLocalStorage('updateParams', true);
              console.log('PARAMTROS ACTUALIZADOS');
    
            }
          }
    
        }) */
  }

  async access(user) {
    try {

      if (!user.status) {
        this._comp.presentToast('Usuario esta deshabilitado', 'danger', 1500);
        return;
      }

      if (user.data.idens[0].number == '') {
        await this._fun.alertError('El usuario no tiene una identificación asociada, debe solicitar actualizar su información');
        return;
      }

      //VALIDAR ROL DE USUARIO
      /*       const res_role: any = await this._apiMongo.get(env.COLLECTION.general, env.TABLE_SIS.role, user.data.role.key);
            console.log('res_role', res_role);
      
            if (this._fun.isEmpty(res_role.result)) {
              this._comp.presentToast('Rol no existe', 'danger', 1500);
              return;
            }
      
            let role = res_role.result[0][env.TABLE_SIS.role][0];
            console.log('role', role);
      
            if (!role.data.acc_app) {
              this._comp.presentToast('Usuario no tiene permisos de acceso', 'danger', 1500);
              return;
            }
       */

      //AGREGAR PANTALLAS DE USUARIO
      console.log('user', user);

      await this.updateListScreen(user);
      this._auth.currentUser.next(user);
      await this._storage.set(env.TOKEN_KEY, user.key);
      this.router.navigate(['list-qr']);

    } catch (error) {
      await this._fun.alertError(error);
    }
  }


  async updateListScreen(user) {
    return new Promise(async resolve => {
      let DNI_USER = /* '72930779' */  user.data.idens[0].number;
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
        listScreen.push(screen);
        if (index == (res.result[0][DNI_USER].length - 1)) {
          await this._storage.set('screenUser', listScreen);
          resolve(true);
        }
      }

    });


  }


  async createAccount() {
    let loading: any = await this._comp.presentLoading();
    console.log('CREAR 1');
    this.dataUserDB.publicKey = '';
    this.dataUserDB.privateKey = '';
    console.log('this.dataUserDB', this.dataUserDB)


    let user_data_db = {
      idens: [
        {
          number: this.accountForm.controls['dni'].value,
          type: 'DNI',
          type_name: 'DNI'
        }
      ],
      group: {
        "collection": "general",
        "table": "g_prod",
        "key": "C4",
        "value": "Otras funciones"
      },
      documents: [],
      email: this.accountForm.controls['email'].value,
      phone: "",
      password: this.accountForm.controls['pass'].value,
      properties: "{}",
      role: {
        collection: "general",
        key: "ADM_USER",
        table: "role",
        value: "Administrador"
      },
      dids: [
        {
          "txType": 1,
          "hashTransaction": "",
          "address": ''
        }
      ],
      status: true,
      key: this._fun.makeid(5),
      table: "employee",
      name: this.accountForm.controls['name'].value,
      grupo: {
        "collection": "general",
        "table": "g_prod",
        "key": "C4",
        "value": "Otras funciones"
      }
    }

    let saved_us: any = await this._apiMongo.create(env.COLLECTION.party, 'employee', user_data_db.key, user_data_db, false);
    console.log('saved_us',saved_us.result);
    

    if (this._fun.isVarInvalid(saved_us.result)) {
      await this._fun.alertError(saved_us.message);
      loading.dismiss();
      return;
    }

    this._auth.currentUser.next(saved_us.result);
    await this._storage.set(env.TOKEN_KEY, saved_us.result.key);
    loading.dismiss();
    this.router.navigate(['list-qr']);

  }



  ionViewDidEnter() {
    this.backSlidePadre();
    this.backSlidePadre();
    this.backSlidePadre();
    this.backSlidePadre();
    this.slidesPadre.update();//REFRESCAR AL USAR MODAL 
  }



  async login() {
    let connection: any = await Network.getStatus();
    if (!connection.connected) {
      await this._fun.alertError('No se encuentra con conexión a internet');
      return;
    }
    let loading: any = await this._comp.presentLoading();

    const res: any = await this._apiMongo.filter(env.COLLECTION.party, env.TABLE_SIS.employee, { 'data.email': this.loginForm.value.email, 'data.password': this.loginForm.value.pass });
    console.log('res', res);
    loading.dismiss();
    if (this._fun.isEmpty(res.result)) {
      await this._fun.alertError('Usuario no existe');
      return;
    }

    const user = res.result[0][env.TABLE_SIS.employee][0];
    console.log('user',user);
    

    /*     return; */
    this.submitAttempt = true;
    if (this.loginForm.valid) {
      this.load = true;
      this.access(user);
    }

  }

  verSlide() {
    this.slidesDatos.getActiveIndex().then(res => {
      if (!this.initEnd) this.indexSlide = res;
      this.initEnd = false;
    });
  }

  mostrar() {
    if (this.viewPass) {
      this.tipo = "password";
      this.viewPass = false;
    } else {
      this.tipo = "text";
      this.viewPass = true;
    }
  }

  endSlide() {
    this.initEnd = true;
    this.indexSlide = 2;
  }

  nextSlideDatos() {
    this.slidesDatos.slideNext();
  }

  nextSlidePadre() {
    this.slidesPadre.lockSwipeToNext(false);
    this.slidesPadre.slideNext();
    this.slidesPadre.lockSwipeToNext(true);
  }

  backSlidePadre() {
    this.slidesPadre.lockSwipeToPrev(false);
    this.slidesPadre.slidePrev();
    this.slidesPadre.lockSwipeToPrev(true);
  }

}
