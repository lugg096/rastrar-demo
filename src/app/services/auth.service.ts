import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { Router } from '@angular/router';
import { ApiMongoService } from './apiMongo.service';
import { environment as env } from 'src/environments/environment';
import { Funciones } from '../compartido/funciones';
import { StorageService } from './storage.service';

export interface User {
  name: string;
  role: string;
  permissions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser: BehaviorSubject<any> = new BehaviorSubject(null);
  public dataSend: BehaviorSubject<any> = new BehaviorSubject(null);
  public userData :any;

  constructor(
    private _storage: StorageService,
    private _fun: Funciones,
    private _apiMongo: ApiMongoService,
    private router: Router) {
  }

   loadUser() {
    return new Promise(async (resolve, reject) => {
      try {
        let keyUser = await this._storage.get(env.TOKEN_KEY);
        console.log('RESPUESTA DE LOADUSER', keyUser);
        if (keyUser) {
          const res_u: any = await this._apiMongo.get(env.COLLECTION.party, env.TABLE_SIS.employee, keyUser);
          console.log('res_u', res_u);

          if (this._fun.isEmpty(res_u.result)) {
            await this._fun.alertError('Error con permisos de acceso al sistema');
            this.router.navigate(['login']);
          }
          let user = res_u.result[0][env.TABLE_SIS.employee][0];
          this.userData = user;
          console.log('user00000001', user);
          const res_r: any = await this._apiMongo.get(env.COLLECTION.general, env.TABLE_SIS.role, user.data.role.key);
          if (this._fun.isEmpty(res_r.result)) {
            await this._fun.alertError('Error con permisos de acceso al sistema');
            this.router.navigate(['login']);
          }

          let role = res_r.result[0][env.TABLE_SIS.role][0];
          resolve(role);
          if (role.data.acc_web) {
            this.currentUser.next(user);
            this._storage.set(env.TOKEN_KEY, user.key);
           
          }
          else await this._fun.alertError('El usuario no tiene permisos de acceso al sistema WEB');
        }
        else this.currentUser.next(false);
      } catch (error) {
        await this._fun.alertError(error);
      }
    });
  }

  async signIn(form) {
    try {
      const res_u: any = await this._apiMongo.filter(env.COLLECTION.party, env.TABLE_SIS.employee,
        { 'data.email': form.username.trim(), 'data.password': form.pass });
      console.log('RES', res_u);

      if (this._fun.isEmpty(res_u.result)) {
        await this._fun.alertError('No se encontro registro con usuario y contraseña ingresados');
        return;
      }

      let user: any = res_u.result[0].employee[0];

      const res_r: any = await this._apiMongo.get(env.COLLECTION.general, env.TABLE_SIS.role, user.data.role.key);
      if (this._fun.isEmpty(res_r.result)) {
        return;
      }
      console.log('res', res_r);
      let role = res_r.result[0][env.TABLE_SIS.role][0];
      console.log(role);

      console.log('USUARIO', user);
      if (role.data.acc_web) {
        this.currentUser.next(user);
        await this._storage.set(env.TOKEN_KEY, user.key);
        this.router.navigate(['users']);
      }
      else await this._fun.alertError('El usuario no tiene permisos de acceso al sistema WEB');
    } catch (error) {
      await this._fun.alertError(error);
    }
  }

  // Access the current user
  getUser() {
    return this.currentUser.asObservable();
  }

  getData(){
    return this.dataSend.asObservable();
  }

  async validarAuth(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.getUser().subscribe(res => {
        console.log('RESPUSTAAAZAAAA', res);
        if (res) resolve(true);
        resolve(false);
      });
    });
  }

  // Remove all information of the previous user
  async logout() {/*  */
    await this._storage.remove(env.TOKEN_KEY);
    this.currentUser.next(false);
    this.router.navigate(['/login']);
  }

  // Check if a user has a certain permission
  hasPermission(permissions: string[]): boolean {
    for (const permission of permissions) {
      if (!this.currentUser.value || !this.currentUser.value.permissions.includes(permission)) {
        return false;
      }
    }
    return true;
  }
}