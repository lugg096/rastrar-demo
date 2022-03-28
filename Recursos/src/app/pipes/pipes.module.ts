import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { FiltroCountryPipe } from './filtro-country.pipe';
import { AdrxPipe } from './adrx.pipe';

@NgModule({
  declarations: [FiltroCountryPipe, AdrxPipe],
  exports: [FiltroCountryPipe,AdrxPipe],
  imports: [
    IonicModule
  ]
})
export class PipesModule { }
