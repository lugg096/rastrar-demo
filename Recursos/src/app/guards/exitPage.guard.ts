import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { GestionPage } from '../pages/gestion/gestion.page';
import { RegistroPage } from '../pages/registro/registro.page';
import { environment as env } from 'src/environments/environment';
import { Funciones } from '../compartido/funciones';

@Injectable({
    providedIn: 'root'
})
export class ExitPageGuard implements CanDeactivate<RegistroPage> {

    constructor(
        private fun: Funciones,
        private _navCtrl: NavController,
        public _storage: StorageService,
        public router: Router) { }


    async canDeactivate(component: RegistroPage): Promise<any> {
        console.log('MOSTRAR PRUEBA');

        if (!component.saved) {
            let a = await this.fun.alert(env.MSG.TYPE_ALERT, 'Si, salir', env.MSG.ALERT_TITLE, env.MSG.ALERT_EXIT_FORM);
            if (this.fun.isVarInvalid(a)) return false;
            component.registroForm.reset();
            return true;
        }
        component.registroForm.reset();
        return true;
    }
}

