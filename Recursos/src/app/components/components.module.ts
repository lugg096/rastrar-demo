import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PinComponent } from './pin/pin.component';
import { ControlMessagesComponent } from './control-messages/control-messages.component';
import { CaptureImagesComponent } from './capture-images/capture-images.component';
import { AlertComponent } from './alert/alert.component';

/* LOTTIE */
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { UploadComponent } from './upload/upload.component';
import { PinAccessComponent } from './pin-access/pin-access.component';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { CodeAlmacenComponent } from './code-almacen/code-almacen.component';
export function playerFactory() {
  return player;
}
import { QRCodeModule } from 'angularx-qrcode';
import { ListSelectComponent } from './list-select/list-select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfolotComponent } from './comp-demo/infolot/infolot.component';
import { AddProducerComponent } from './add-producer/add-producer.component';
import { SelectImagenComponent } from './select-imagen/select-imagen.component';
import { PipesModule } from '../pipes/pipes.module';
import { MultimediaComponent } from './comp-demo/multimedia/multimedia.component';
import { DemoInicioComponent } from './comp-demo/demo-inicio/demo-inicio.component';
import { ViewMultimediaComponent } from './comp-demo/view-multimedia/view-multimedia.component';
import { CreateProducerComponent } from './create-producer/create-producer.component';


@NgModule({
  declarations: [
    PinComponent,
    ControlMessagesComponent,
    CaptureImagesComponent,
    AlertComponent,
    UploadComponent,
    PinAccessComponent,
    ChangePassComponent,
    CodeAlmacenComponent,
    ListSelectComponent,
    InfolotComponent,
    AddProducerComponent,
    SelectImagenComponent,
    MultimediaComponent,
    DemoInicioComponent,
    ViewMultimediaComponent,
    CreateProducerComponent
  ],
  exports:[
    PinComponent,
    ControlMessagesComponent,
    CaptureImagesComponent,
    AlertComponent,
    UploadComponent,
    PinAccessComponent,
    ChangePassComponent,
    CodeAlmacenComponent,
    InfolotComponent,
    MultimediaComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    QRCodeModule,
    ReactiveFormsModule,
    FormsModule,
    PipesModule,
    LottieModule.forRoot({ player: playerFactory })/* LOTTIE */
  ]
})
export class ComponentsModule { }
