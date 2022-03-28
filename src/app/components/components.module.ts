import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { GenerarCodeQRComponent } from './generar-code-qr/generar-code-qr.component';
import { GetDidComponent } from './get-did/get-did.component';
import { QRCodeModule } from 'angularx-qrcode';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';

import { ImportExcelComponent } from './import-excel/import-excel.component';
import { ControlMessagesComponent } from './control-messages/control-messages.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

/* LOTTIE */
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { ListSelectComponent } from './list-select/list-select.component';
import { GetCredComponent } from './get-cred/get-cred.component';
import { GetCertComponent } from './get-cert/get-cert.component';
import { AlertInputComponent } from './alert-input/alert-input.component';
import { GenScreenComponent } from './gen-screen/gen-screen.component';
import { PorcentComponent } from './porcent/porcent.component';
import { GenCardsComponent } from './gen-cards/gen-cards.component';
import { ListScreenComponent } from './list-screen/list-screen.component';
import { ListMultiSelectComponent } from './list-multi-select/list-multi-select.component';
import { GenerationFormComponent } from './generation-form/generation-form.component';
import { AddProducerComponent } from './add-producer/add-producer.component';
import { CreateProducerComponent } from './create-producer/create-producer.component';
import { PipesModule } from '../pipes/pipes.module';
import { ViewMultimediaComponent } from './comp-demo/view-multimedia/view-multimedia.component';
import { MultimediaComponent } from './comp-demo/multimedia/multimedia.component';
import { InfolotComponent } from './comp-demo/infolot/infolot.component';
import { DemoInicioComponent } from './comp-demo/demo-inicio/demo-inicio.component';
import { CaptureImagesComponent } from './capture-images/capture-images.component';
import { AssociateQrComponent } from './associate-qr/associate-qr.component';
import { ViewCertComponent } from './view-cert/view-cert.component';
import { ConctactComponent } from './comp-demo/conctact/conctact.component';
import { AddFieldComponent } from './add-field/add-field.component';
import { CreateTableComponent } from './create-table/create-table.component';
import { CreateRegistroComponent } from './create-registro/create-registro.component';
import { CreateAccionComponent } from './create-accion/create-accion.component';
import { CreateButtonComponent } from './create-button/create-button.component';
import { AddSectionComponent } from './add-section/add-section.component';
import { AddRolComponent } from './add-rol/add-rol.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { QrMultipleComponent } from './qr-multiple/qr-multiple.component';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    GetDidComponent,
    GenerarCodeQRComponent,
    AlertComponent,
    ImportExcelComponent,
    ControlMessagesComponent,
    ListSelectComponent,
    GetCredComponent,
    GetCertComponent,
    AlertInputComponent,
    GenScreenComponent,
    PorcentComponent,
    GenCardsComponent,
    ListScreenComponent,
    ListMultiSelectComponent,
    GenerationFormComponent,
    AddProducerComponent,
    CreateProducerComponent,
    ViewMultimediaComponent,
    MultimediaComponent,
    InfolotComponent,
    DemoInicioComponent,
    CaptureImagesComponent,
    AssociateQrComponent,
    ViewCertComponent,
    ConctactComponent,
    AddFieldComponent,
    AddRolComponent,
    CreateAccionComponent,
    CreateButtonComponent,
    CreateRegistroComponent,
    CreateTableComponent,
    AddSectionComponent,
    CreateUserComponent,
    QrMultipleComponent
  ],
  exports: [
    AlertComponent,
    ControlMessagesComponent,
    PorcentComponent
  ],
  imports: [
    NgxQRCodeModule,
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    QRCodeModule,
    PipesModule,
    LottieModule.forRoot({ player: playerFactory })/* LOTTIE */
  ]
})
export class ComponentsModule { }
