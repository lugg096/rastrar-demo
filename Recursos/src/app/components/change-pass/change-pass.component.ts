import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSlides } from '@ionic/angular';
import { IonicComponentsService } from 'src/app/services/ionic-components.service';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss'],
})
export class ChangePassComponent implements OnInit {


  @ViewChild('slidesPadre', { static: false }) private slidesPadre: IonSlides;
  @ViewChild('slidesDatos', { static: false }) private slidesDatos: IonSlides;

  public passForm: FormGroup;
  public load = true;
  public indexSlide = 0;
  public initEnd = false;
  public viewPass = false;
  public tipo = "password"
  public submitAttempt: boolean = false;


  constructor(
    public formBuilder: FormBuilder,
    public _comp: IonicComponentsService) {

    this.passForm = formBuilder.group({
      passOld: ['', Validators.required],
      passNew: ['', Validators.required]
    });

  }

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    speed: 700,
    autoplay: {
      delay: 2500,
    },
  };

  slideOptsOnboarding = {
    allowSlideNext: false,
    allowSlidePrev: false,
    slidesPerView: 1,
    initialSlide: 0,
    speed: 400
  };



  ngOnInit() {
    /*  this.api.auth().subscribe(res=>{
       console.log('RESPUESTA',res);
       
     }) */
  }

  async continuar() {
    this.submitAttempt = true;
    if (this.passForm.valid) {
      console.log(this.passForm.value);
  
    }

  }

  verSlide() {
    this.slidesDatos.getActiveIndex().then(res => {
      if (!this.initEnd) this.indexSlide = res;
      this.initEnd = false;
    });
  }

  mostrar() {
    if (this.viewPass) {
      this.tipo = "password";
      this.viewPass = false;
    } else {
      this.tipo = "text";
      this.viewPass = true;
    }
  }

  endSlide() {
    this.initEnd = true;
    this.indexSlide = 2;
  }

  nextSlideDatos() {
    this.slidesDatos.slideNext();
  }

  nextSlidePadre() {
    this.slidesPadre.lockSwipeToNext(false);
    this.slidesPadre.slideNext();
    this.slidesPadre.lockSwipeToNext(true);
  }

  backSlidePadre() {
    this.slidesPadre.lockSwipeToPrev(false);
    this.slidesPadre.slidePrev();
    this.slidesPadre.lockSwipeToPrev(true);
  }


}
