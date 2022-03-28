import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-view-multimedia',
  templateUrl: './view-multimedia.component.html',
  styleUrls: ['./view-multimedia.component.scss'],
})
export class ViewMultimediaComponent implements OnInit {

  constructor(private _modal: ModalController) { }

  ngOnInit() {}


  closeModal() {
    this._modal.dismiss({ confirm: false});
  }

  confirm() {
    this._modal.dismiss({ confirm: true});
  }


}
