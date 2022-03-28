import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccionBotonesComponent } from './accion-botones/accion-botones.component';
import { AccionesComponent } from './acciones/acciones.component';
import { CreatePantallaComponent } from './create-pantalla/create-pantalla.component';
import { ListQrComponent } from './list-qr/list-qr.component';

import { PagesPage } from './pages.page';
import { PantallasComponent } from './pantallas/pantallas.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { ProfileComponent } from './profile/profile.component';
import { RolesComponent } from './roles/roles.component';
import { TablaRegistrosComponent } from './tabla-registros/tabla-registros.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

const routes: Routes = [

  {
    path: '',
    component: PagesPage,
    /*  canActivate: [noLoginGuard], */
    children: [
      { path: 'users', component: UsuariosComponent},
      { path: 'roles', component: RolesComponent},
      { path: 'profile', component: ProfileComponent },
      { path: 'list-qr', component: ListQrComponent },

      { path: 'acciones', component: AccionesComponent},
      { path: 'act-but/:key', component: AccionBotonesComponent},
      { path: 'param', component: ParametrosComponent},
      { path: 'table-reg/:key', component: TablaRegistrosComponent},
      { path: 'pantalla', component: PantallasComponent},
      { path: 'create-screen/:key', component: CreatePantallaComponent},

      { path: '', redirectTo: 'list-qr', pathMatch: 'full' }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesPageRoutingModule { }
