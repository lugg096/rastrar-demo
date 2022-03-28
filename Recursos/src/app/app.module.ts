import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http'

import { QRCodeModule } from 'angularx-qrcode';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { GenerarCodeQRComponent } from './components/generar-code-qr/generar-code-qr.component';;
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { VerFotoComponent } from './components/ver-foto/ver-foto.component';

import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';

/* LOTTIE */
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { DataService } from './services/data-service.service';
export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppComponent, 
    GenerarCodeQRComponent,
    VerFotoComponent
  ],
  entryComponents: [
    GenerarCodeQRComponent,
    VerFotoComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    QRCodeModule,
    LottieModule.forRoot({ player: playerFactory })/* LOTTIE */
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    BarcodeScanner,
    SocialSharing,
    Clipboard,
    FileOpener,
    ImagePicker,
    SQLitePorter,
    SQLite,
    DataService

  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
