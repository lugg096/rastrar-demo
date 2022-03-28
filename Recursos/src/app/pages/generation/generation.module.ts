import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { GenerationPageRoutingModule } from './generation-routing.module';

import { GenerationPage } from './generation.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    GenerationPageRoutingModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [GenerationPage]
})
export class GenerationPageModule {}
