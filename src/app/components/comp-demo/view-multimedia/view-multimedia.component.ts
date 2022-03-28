import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-view-multimedia',
  templateUrl: './view-multimedia.component.html',
  styleUrls: ['./view-multimedia.component.scss'],
})
export class ViewMultimediaComponent implements OnInit {

  constructor(private _modal: ModalController) { }

  @ViewChild('slidesDatos', { static: false }) private slidesDatos: IonSlides;
  data: any;
  initEnd = false;
  indexSlide = 0;
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    speed: 700,
    autoplay: {
      delay: 4000,
    },
  };

  ngOnInit() {
    console.log('DATAAAA1',this.data);
    
   }


  verSlide() {
    this.slidesDatos.getActiveIndex().then(res => {
      if (!this.initEnd) this.indexSlide = res;
      this.initEnd = false;
    });
  }

  endSlide() {
    this.initEnd = true;
    this.indexSlide = 2;
  }

  closeModal() {
    this._modal.dismiss({ confirm: false });
  }

  confirm() {
    this._modal.dismiss({ confirm: true });
  }


}
