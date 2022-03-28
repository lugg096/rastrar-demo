import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class noLoginGuard implements CanActivate {

  constructor(
    private _navCtrl: NavController,
    public _storage: StorageService,
    public router: Router) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this._storage.validarAuth().then(res => {
      if (res) {
        this._navCtrl.navigateRoot('gestion');
        return false;
      }
      return true;
    })
  }

}
