import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ViewMultimediaComponent } from '../view-multimedia/view-multimedia.component';

@Component({
  selector: 'app-multimedia',
  templateUrl: './multimedia.component.html',
  styleUrls: ['./multimedia.component.scss'],
})
export class MultimediaComponent implements OnInit {

  constructor( public _modal: ModalController,) { }

  ngOnInit() {}


  async view() {

    const modal = await this._modal.create({
      component: ViewMultimediaComponent,
      componentProps: {
        /*   titleReg: 'objective_cert',
          listSelect: this.registroForm.controls[field.code].value */
      }
    });
    modal.onDidDismiss().then(async (res: any) => {
      console.log('res', res);
/*       if (this._fun.isVarInvalid(res.data)) return;
      this.imgPortada = res.data.img; */

    });
    await modal.present();

  }

}
