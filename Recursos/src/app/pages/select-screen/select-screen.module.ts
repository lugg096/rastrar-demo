import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectScreenPageRoutingModule } from './select-screen-routing.module';

import { SelectScreenPage } from './select-screen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectScreenPageRoutingModule
  ],
  declarations: [SelectScreenPage]
})
export class SelectScreenPageModule {}
