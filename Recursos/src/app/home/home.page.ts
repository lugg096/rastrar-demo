import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IonicComponentsService } from '../services/ionic-components.service';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { sha256, sha224 } from 'js-sha256';
import { StorageService } from '../services/storage.service';
import { User, Screen } from '../interface/interfaces';
import { Web3jsService } from '../services/web3js.service';
import { environment as env } from 'src/environments/environment';
import { ApiMongoService } from '../services/apiMongo.service';
import { Funciones } from '../compartido/funciones';
import { AppComponent } from '../app.component';

import { Plugins } from '@capacitor/core';
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
  slideLogin = false;
  methodNewAccount = false;

  public submitAttempt: boolean = false;

  public dataUserDB: any = {
    publicKey: '',
    privateKey: ''
  };
  public dataUserMongoDB: any;
  public dataScreensDB = [];


  constructor(
    private appComp: AppComponent,
    private _fun: Funciones,
    private _apiMongo: ApiMongoService,
    private web3js: Web3jsService,
    private storage: StorageService,
    private db: DatabaseService,
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
    console.log('connection', connection);

  }

  ngOnInit() {
    this.connetionStatus();
    this.getLocation();
    this.db.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.setParamas();
        this.db.getUsers().subscribe((user: any) => {
          console.log('LISTA DE USUARIOS', user);

        })
      }
    });
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
    let updateParams = await this.storage.getLocalStorage('updateParams');
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

    })
  }

  async access(user) {
    try {

      console.log('MOSTRAR 00000000000000001');

      this.dataUserMongoDB = user.data;
      this.dataUserMongoDB.key = user.key;
      this.dataUserMongoDB.name = user.name;
      this.dataUserMongoDB.status = user.status;
      this.dataUserMongoDB.table = user.table;


      this.dataUserDB = this._fun.configRegDB(user);

      console.log('MOSTRAR 00000000000000002');
      if (!user.status) {
        this._comp.presentToast('Usuario esta deshabilitado', 'danger', 1500);
        return;
      }


      if (user.data.idens[0].number == '') {
        await this._fun.alertError('El usuario no tiene una identificación asociada, debe solicitar actualizar su información');
        return;
      }

      const res_role: any = await this._apiMongo.get(env.COLLECTION.general, env.TABLE_SIS.role, this.dataUserDB.role.key);
      console.log('res_role', res_role);

      if (this._fun.isEmpty(res_role.result)) {
        this._comp.presentToast('Rol no existe', 'danger', 1500);
        return;
      }
      console.log('MOSTRAR 00000000000000003');
      let role = res_role.result[0][env.TABLE_SIS.role][0];
      console.log('role', role);

      if (!role.data.acc_app) {
        this._comp.presentToast('Usuario no tiene permisos de acceso', 'danger', 1500);
        return;
      }
      console.log('role ..... PASOOO01', this.dataUserDB.dids);
      this.createAccount();

    } catch (error) {
      //this.load = false;
      await this._fun.alertError(error);
    }
  }

  async createAccount() {
    console.log('CREAR 1');
    this.dataUserDB.publicKey = '';
    let cuenta: any = await this.web3js.account();
    console.log('CREAR 2', cuenta);
    this.dataUserDB.publicKey = cuenta.address;
    console.log('CREAR 3');
    this.dataUserDB.privateKey = cuenta.privateKey;
    console.log('this.dataUserDB', this.dataUserDB);
    this.nextSlidePadre();
  }

  async userInDB(user) {

    let loading: any = await this._comp.presentLoading();
    try {
      const res: any = await this._apiMongo.filter(env.COLLECTION.party, env.TABLE_SIS.employee, { 'data.email': user.email, 'data.password': user.password });
      console.log('res', res);
      if (this._fun.isEmpty(res.result)) {
        loading.dismiss();
        await this._fun.alertError('Usuario no existe');
        return;
      }

      const user_res = res.result[0][env.TABLE_SIS.employee][0];
      console.log('USUARIo', user_res);

      if (!user_res.status) {
        loading.dismiss();
        this._comp.presentToast('Usuario esta deshabilitado', 'danger', 1500);
        return;
      }

      console.log('user_res.data.dids', user_res.data.dids);

      /* if (!this._fun.isEmpty(user_res.data.dids )) {
        loading.dismiss();
        await this._fun.alertError('Su usuario tiene una direccion asociada, si desea asociar otra debe solicitarlo al administrador del sistema');
        return;
      } */

      if (this._fun.isEmpty(user_res.data.dids)) {
        loading.dismiss();
        this.access(this.loginForm.value);
        return;
      }

    } catch (err) {
      loading.dismiss();
      await this._fun.alertError(err);
    }


    loading.dismiss();
    let data: any = await this._fun.accessPin('onlyPIN');

    console.log('PIN DATA', data);
    console.log('PIN ACCESS', data.privateKey);
    console.log('user....2', user);

    let hashPin = sha256(sha256(data.privateKey));
    console.log('hashPin', hashPin);

    if (user.pin != hashPin) {
      this._comp.presentToast('ePIN incorrecto', 'danger', 1500);
      return;
    }

    user.grupo = JSON.parse(user.grupo);
    user.idens = JSON.parse(user.idens);
    user.role = JSON.parse(user.role);
    user.screens = JSON.parse(user.screens);

    let userScreens = [];
    for (let index = 0; index < user.screens.length; index++) {
      let screen_data: any = await this.db.getData({ key: user.screens[index] }, env.TABLE.SCREEN) || [];
      let screen = screen_data[0];
      console.log('PANTALLA', screen);

      screen.action = JSON.parse(screen.action);
      screen.certificateType = JSON.parse(screen.certificateType);
      screen.fields = JSON.parse(screen.fields);
      userScreens.push(screen);

      if (index == (user.screens.length - 1)) {
        console.log('user Storage', user);
        console.log('userScreens Storage', userScreens);
        await this.storage.setLocalStorage('DATA', user);
        await this.storage.setLocalStorage('SCREEN', userScreens);
        this.appComp.config();
        this.router.navigate(['/gestion']);
      }
    }




  }

  ionViewDidEnter() {
    this.backSlidePadre();
    this.backSlidePadre();
    this.backSlidePadre();
    this.backSlidePadre();
    this.slidesPadre.update();//REFRESCAR AL USAR MODAL 
  }

  async alertPIN() {
    await this._fun.alertGen(false, 'ok', 'Debe solicitar al administrador del sistema que desea asociar otra dirección a su cuenta');
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



    this.submitAttempt = true;
    if (this.loginForm.valid) {
      this.load = true;

      this.access(user);

      /*     return;
          if (this.dataUserDB.privateKey == '') {
            let cuenta: any = await this.web3js.account();
            this.dataUserDB.publicKey = cuenta.address;
            this.dataUserDB.privateKey = cuenta.privateKey;
            console.log('this.dataUserDB', this.dataUserDB);
            this.nextSlidePadre();
          } */

    }

  }


  async savePKMongoDB(address, id) {
    console.log('address', address);
    /* PREPARAR DATOS */

    this.getCurrentPosition = await Geolocation.getCurrentPosition();
    let data_resolve: any = {
      address: address,
      currentPosition: this.getCurrentPosition
    }
    console.log('this.getCurrentPosition', this.getCurrentPosition);

    this._apiMongo._create(env.COLLECTION.resolve, id, address, data_resolve, true).subscribe(res => {
      console.log('Direccion guardada', res);
    });

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


  /* Codigo pin */
  public dataSlideCreate = {
    titulo: "",
    subTitulo: "Crear PIN",
    texto: "Nuevo PIN de 6 dígitos"
  }

  public dataSlideValidacion = {
    titulo: "",
    subTitulo: "Confirme su PIN",
    texto: "Ingrese nuevamente PIN de 6 dígitos"
  }


  pin = '';
  getClave($event) {
    this.pin = $event;
    this.nextSlidePadre();
  }

  async getClaveValid($event) {
    if (this.pin == $event) {
      this.dataUserDB.pin = sha256(sha256(this.pin.toString()));

      let position = Number(this.pin.substr(0, 2));
      if (position > 62) position = position - 62;
      if (position == 0) position = 2;
      let n1 = Number(this.pin.substr(2, 2));
      let n2 = Number(this.pin.substr(4, 2))
      console.log(this.dataUserDB);

      let str = this.dataUserDB.privateKey.substr(position, 4);
      console.log(this.dataUserDB);

      let hex1 = str.substr(0, 2);
      let number1 = parseInt(hex1, 16) + n1;

      let hex2 = str.substr(2, 2);
      let number2 = parseInt(hex2, 16) + n2;

      this.dataUserDB.privateKey = this.dataUserDB.privateKey.substr(0, position) +
        this.dataUserDB.privateKey.substr(position + 4, this.dataUserDB.privateKey.length) +
        number1 + 'G' + number2;

      let loading: any = await this._comp.presentLoading();


      //SAVE IN STORAGE SESION LOCAL

      if (this.slideNewAccount) {

        let user_data_st = {
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
              "address": this.dataUserDB.publicKey
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
          },
          "publicKey": this.dataUserDB.publicKey,
          "privateKey": this.dataUserDB.privateKey,
          "pin": this.dataUserDB.pin
        };
        await this.storage.setLocalStorage('DATA', user_data_st);
      } else await this.storage.setLocalStorage('DATA', this.dataUserDB);


      /*      await this.storage.setLocalStorage('SCREEN', this.dataScreensDB); */
      this.appComp.config();
      //CONFIG DATA FOR DB

      console.log('dataPre', this.dataUserDB);
      this.dataUserDB = this._fun.patchValueJsonStr(new User(), this.dataUserDB);

      //SAVE IN DB
      /*    let addUser = await this.db.addData(this.dataUserDB, env.TABLE.USER);
   
         console.log('addUser', addUser); */

      console.log('DATA...final', this.dataUserDB);

      if (this.slideNewAccount) {
      
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
              "address": this.dataUserDB.publicKey
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

        if (this._fun.isVarInvalid(saved_us.result)) {
          await this._fun.alertError(saved_us.message);
          loading.dismiss();
          return;
        }
        this.savePKMongoDB(this.dataUserDB.publicKey, this.accountForm.controls['dni'].value);

      } else {
        this.savePKMongoDB(this.dataUserDB.publicKey, this.dataUserMongoDB.idens[0].number);
      }



      loading.dismiss();
      this.router.navigate(['/gestion']);
    } else this._comp.presentToast('Clave no es la misma', 'danger', 1000);

  }

}
