import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

import { PagesPageRoutingModule } from './pages-routing.module';
import { QRCodeModule } from 'angularx-qrcode';
import { PagesPage } from './pages.page';
import { ComponentsModule } from '../components/components.module';
import { ProfileComponent } from './profile/profile.component';
import { LayoutModule } from '../layout/layout.module';
import { JwPaginationModule } from 'jw-angular-pagination';
import { RouterModule } from '@angular/router';
import { ListQrComponent } from './list-qr/list-qr.component';
import { PipesModule } from '../pipes/pipes.module';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { RolesComponent } from './roles/roles.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { TablaRegistrosComponent } from './tabla-registros/tabla-registros.component';
import { PantallasComponent } from './pantallas/pantallas.component';
import { CreatePantallaComponent } from './create-pantalla/create-pantalla.component';
import { AccionesComponent } from './acciones/acciones.component';
import { AccionBotonesComponent } from './accion-botones/accion-botones.component';


@NgModule({
  declarations: [
    PagesPage,
    ProfileComponent,
    ListQrComponent,
    UsuariosComponent,
    RolesComponent,
    ParametrosComponent,
    TablaRegistrosComponent,
    PantallasComponent,
    CreatePantallaComponent,
    AccionesComponent,
    AccionBotonesComponent
  ],
  imports: [
    JwPaginationModule,
    CommonModule,
    FormsModule,
    IonicModule,
    PagesPageRoutingModule,
    LayoutModule,
    ComponentsModule,
    QRCodeModule,
    ReactiveFormsModule,
    NgxQRCodeModule,
    RouterModule,
    PipesModule
  ]

})
export class PagesPageModule { }
