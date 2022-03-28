import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CertificadoPageRoutingModule } from './certificado-routing.module';

import { CertificadoPage } from './certificado.page';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CertificadoPageRoutingModule,
    SharedDirectivesModule,
    QRCodeModule
  ],
  declarations: [CertificadoPage]
})
export class CertificadoPageModule {}
