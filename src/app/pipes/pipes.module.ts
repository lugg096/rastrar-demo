import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { FiltroCountryPipe } from './filtro-country.pipe';
import { AdrxPipe } from './adrx.pipe';
import { MaxLengthPipe } from './max-length.pipe';

@NgModule({
  declarations: [FiltroCountryPipe, AdrxPipe, MaxLengthPipe],
  exports: [FiltroCountryPipe,AdrxPipe,MaxLengthPipe],
  imports: [
    IonicModule
  ]
})
export class PipesModule { }
