import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent
  ],
  exports:[
    HeaderComponent,
    SidebarComponent
    ],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class LayoutModule { }
