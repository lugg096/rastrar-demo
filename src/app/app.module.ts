import { LOCALE_ID,NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http'

import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
/* import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'; */
/* LOTTIE */
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
export function playerFactory() {
  return player;
}
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import { LayoutModule } from './layout/layout.module';


import localeEs from "@angular/common/locales/es";
import { registerLocaleData } from "@angular/common";
registerLocaleData(localeEs, "es");

@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [],
  imports: [
    LayoutModule,
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    NgxQRCodeModule,
    LottieModule.forRoot({ player: playerFactory })/* LOTTIE */
  ],
  providers: [
    {provide : LocationStrategy , useClass: HashLocationStrategy},
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: "es" }],
  bootstrap: [AppComponent],
})
export class AppModule {}
