import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private _navCtrl: NavController,
    public _storage: StorageService,
    public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot){
    return this._storage.validarAuth().then(res => {
      if (!res) {
        this._navCtrl.navigateRoot('login');
        return !false;
      }
      return true;
    })
  }

}
