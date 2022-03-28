import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Funciones } from 'src/app/compartido/funciones';
import { Screen, User, UserUpdate } from 'src/app/interface/interfaces';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { DataService } from 'src/app/services/data-service.service';
import { DatabaseService } from 'src/app/services/database.service';
import { IonicComponentsService } from 'src/app/services/ionic-components.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment as env } from 'src/environments/environment';
import { Plugins } from '@capacitor/core';
import { AppComponent } from 'src/app/app.component';
const { Network } = Plugins;

@Component({
  selector: 'app-sync-data',
  templateUrl: './sync-data.page.html',
  styleUrls: ['./sync-data.page.scss'],
})
export class SyncDataPage implements OnInit {

  constructor(
    private appComp: AppComponent,
    public _comp: IonicComponentsService,
    private _apiMongo: ApiMongoService,
    private _fun: Funciones,
    private db: DatabaseService,
    private _data: DataService,
    public router: Router,
    private _storage: StorageService,) { }
  listTable = [];

  initDB = false;

  ngOnInit() {
    this.getTables();

  }

  async getTables() {
    this.listTable = [
      { name: 'Procesos asignados', info: 'Se actualizarán los campos solicitados en el formulario del proceso', code: 'screen', icon: 'today-outline' },
      { name: 'Parámetros', info: 'Se actualizarán parámetros usados en el sistema', code: 'params', icon: 'apps' },
      { name: 'Información de usuario', info: 'Se actualizarán todos los datos de su perfil', code: 'user', icon: 'person-outline' },
    ]
  }

  async sync(code) {
    console.log('CODE', code);
    let connection: any = await Network.getStatus();
    if (!connection.connected) {
      await this._fun.alertError('No se encuentra con conexión a internet');
      return;
    }
    this.db.getDatabaseState().subscribe(ready => {
      if (ready) {
        console.log('INICIADA DB');
        if (code == 'params') this.setParamas();
        else if (code == 'screen') this.setScreens();
        else if (code == 'user') this.setUser();
      }
    });
  }


  async closeSesion() {
    this._storage.clearStorage();
    this._storage.initSesion = false;
    this.router.navigate(['/home']);
  }


  dataUserMongoDB: any;

  async setUser() {
    let loading: any = await this._comp.presentLoading();
    try {

      const res: any = await this._apiMongo.filter(env.COLLECTION.party, env.TABLE_SIS.employee, { 'key': this._storage.userSesion.key });


      /*    const res: any = await this._apiMongo.filter(env.COLLECTION.party, env.TABLE_SIS.producer,
           { 'data.idens': { "$all": [{ "number": this._storage.userSesion.idens[0].number.toString().trim(), "type": this._storage.userSesion.idens[0].type, "type_name": this._storage.userSesion.idens[0].type_name }] } });
    */

      console.log('res', res);
      if (this._fun.isEmpty(res.result)) {
        // this.load = false;
        await this._fun.alertError('No se encontro datos de usuario, debe de eliminar la información de su cuenta desde su perfil.');
        return;
      }


      const user = res.result[0][env.TABLE_SIS.employee][0];
      console.log('USUARIo', user);

      this.dataUserMongoDB = user.data;
      this.dataUserMongoDB.key = user.key;
      this.dataUserMongoDB.name = user.name;
      this.dataUserMongoDB.status = user.status;
      this.dataUserMongoDB.table = user.table;
      this.dataUserMongoDB.grupo = user.data.group;


      console.log('this.dataUserMongoDB', this.dataUserMongoDB);

      if (!user.status) {
        this._comp.presentToast('Usuario esta deshabilitado', 'danger', 1500);
        this.closeSesion();
        return;
      }

      if (user.data.idens[0].number == '') {
        await this._fun.alertError('El usuario no tiene una identificación asociada');
        this.closeSesion();
        return;
      }

      const res_role: any = await this._apiMongo.get(env.COLLECTION.general, env.TABLE_SIS.role, this.dataUserMongoDB.role.key);
      console.log('res_role', res_role);

      if (this._fun.isEmpty(res_role.result)) {
        this._comp.presentToast('Rol usuario no existe', 'danger', 1500);
        this.closeSesion();
        return;
      }

      let role = res_role.result[0][env.TABLE_SIS.role][0];
      console.log('role', role);

      if (!role.data.acc_app) {
        this._comp.presentToast('Usuario no tiene permisos de acceso', 'danger', 1500);
        this.closeSesion();
        return;
      }

      // ACTUALIZACION STORAGE
      let userStorage = await this._storage.getLocalStorage('DATA');

      userStorage.email = this.dataUserMongoDB.email;
      userStorage.dids = this.dataUserMongoDB.dids;
      userStorage.grupo = this.dataUserMongoDB.grupo;
      userStorage.idens = this.dataUserMongoDB.idens;
      userStorage.name = this.dataUserMongoDB.name;
      userStorage.password = this.dataUserMongoDB.password;
      userStorage.phone = this.dataUserMongoDB.phone;
      userStorage.properties = this.dataUserMongoDB.properties;
      userStorage.role = this.dataUserMongoDB.role;

      //ACTUALIZACION EN BD
      let user_local: any;
      let userSaved: any = await this.db.getData({
        key: user.key
      }, env.TABLE.USER) || [];
      if (userSaved.length > 0) user_local = userSaved[0];
      else await this._fun.alertError('Error en usuario');


      console.log('pree', user_local);

      user_local.email = this.dataUserMongoDB.email;
      user_local.dids = this.dataUserMongoDB.dids;
      user_local.grupo = this.dataUserMongoDB.grupo;
      user_local.idens = this.dataUserMongoDB.idens;
      user_local.name = this.dataUserMongoDB.name;
      user_local.password = this.dataUserMongoDB.password;
      user_local.phone = this.dataUserMongoDB.phone;
      user_local.properties = this.dataUserMongoDB.properties;
      user_local.role = this.dataUserMongoDB.role;

      await this._storage.setLocalStorage('DATA', userStorage);
      this.appComp.config();

      console.log('dataPre', user_local);
      user_local = this._fun.patchValueJsonStr(new User(), user_local);
      console.log('dataPos', user_local);

      //SAVE IN DB
      let addUser = await this.db.addData(user_local, env.TABLE.USER);
      if (!addUser) {
        loading.dismiss();
        return;
      }

      loading.dismiss();
      await this._fun.alert(env.MSG.TYPE_SUC, ' Ok ', 'Listo!', 'Los su informacion de usuario fue actualizada');

    } catch (error) {
      loading.dismiss();
      await this._fun.alertError(error);
    }
  }

  async setScreens() {

    try {
      let loading: any = await this._comp.presentLoading();
      let screen_data: any = await this.db.getData(null, env.TABLE.SCREEN) || [];

      const res_role: any = await this._apiMongo.get(env.COLLECTION.general, env.TABLE_SIS.role, this._storage.userSesion.role.key);
      console.log('res_role', res_role);

      let role = res_role.result[0][env.TABLE_SIS.role][0];
      console.log('role', role);

      let screensKey = [];
      let listScreens = [];
      if (!role.data.acc_app) {
        loading.dismiss();
        this._comp.presentToast('Usuario no tiene permisos de acceso', 'danger', 1500);

        //Actualizar el campo screens del usuario y dejarlo en array vacio 
        return;
      } else {
        for (let x = 0; x < role.data.conf_app.length; x++) {
          const item: any = role.data.conf_app[x];
          console.log('SCREN..1', item);
          screensKey.push(item.key);

          if (x == (role.data.conf_app.length - 1)) {

            for (let index = 0; index < screensKey.length; index++) {

              let res_screen: any = await this._apiMongo._get(env.COLLECTION.object, env.TABLE_SIS.screen, screensKey[index]).toPromise();
              console.log('res_screen..1', res_screen);

              if (res_screen.result.length != 0) listScreens.push(this._fun.configRegDB(res_screen.result[0][env.TABLE_SIS.screen][0]));
              console.log('res_screen...2', res_screen.result[0][env.TABLE_SIS.screen][0]);

              if (index == (screensKey.length - 1)) {
                console.log('SCREEN', listScreens);

                await this._storage.setLocalStorage('SCREEN', listScreens);
                let screens_pre = this._fun.patchValueJsonStrArry(new Screen(), listScreens);
                console.log('screens_pre', screens_pre);

                let savedItems = await this.db.addData(screens_pre, env.TABLE.SCREEN);
                console.log('GUARDADO', savedItems);

                loading.dismiss();
                await this._fun.alert(env.MSG.TYPE_SUC, ' Ok ', 'Listo!', 'Los procesos han sido actualizados correctamente');
              }


            }

          }
          loading.dismiss();

        }
      }

    } catch (error) {
      await this._fun.alertError(error);
    }

  }

  async setParamas() {
    let loading: any = await this._comp.presentLoading();
    this._apiMongo._get(env.COLLECTION.general, env.TABLE_SIS.tables, 'items').subscribe(async (res: any) => {

      let tablas = res.result[0].tables;

      for (let index = 0; index < tablas.length; index++) {
        const tabla = tablas[index];
        let createTable = await this.db.createTable(tabla.key, 'default');
        console.log('createTable', createTable);
        if (!createTable) {
          await this._storage.setLocalStorage('updateParams', false);
          return;
        }

        this._apiMongo._get(env.COLLECTION.general, tabla.key, 'items').subscribe(async (data_i: any) => {
          let items = data_i.result[0][tabla.key];
          console.log('items DB', items);
          items = this._fun.patchValueJsonStrArry({ data: '', key: '', name: '', status: '' }, items)
          console.log('items', items);
          let savedItems = await this.db.addData(items, tabla.key);
          console.log('savedItems', savedItems);
          /*  let listParams = await this.db.getData(null, tabla.key) || [];
           console.log('listParams', listParams); */
          if (!savedItems) {
            await this._storage.setLocalStorage('updateParams', false);
            loading.dismiss();
            return;
          }
          if (index == (tablas.length - 1)) {
            await this._storage.setLocalStorage('updateParams', true);
            console.log('PARAMTROS ACTUALIZADOS');
            loading.dismiss();
            await this._fun.alert(env.MSG.TYPE_SUC, ' Ok ', 'Listo!', 'Los datos de los parámetros han sido actualizados correctamente');
          }
        }, async (_err) => {

          await this._storage.setLocalStorage('updateParams', false);
          loading.dismiss();
        });


      }

    })
  }

  goGestion() {
    this.router.navigate(['gestion']);
  }

}
