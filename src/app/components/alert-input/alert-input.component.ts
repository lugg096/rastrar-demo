import { Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonicComponentsService } from 'src/app/services/ionic-components.service';
import { environment as env } from 'src/environments/environment';

/* Lottie  */
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Funciones } from 'src/app/compartido/funciones';
import { ContractsService } from 'src/app/services/contracts.service';

@Component({
  selector: 'app-alert-input',
  templateUrl: './alert-input.component.html',
  styleUrls: ['./alert-input.component.scss'],
})

export class AlertInputComponent implements OnInit {

  private animationItem: AnimationItem;

  buttonConfim: string = '';
  textTitle: string = '';
  subtitle: string = '';
  type: string = 'alert';// success | danger | alert

  field: any = {
    value:'',
    caption:'',
    placeholder:'',
    type:''
  };

  options: AnimationOptions = {
    path: '/assets/json/alert.json',
    loop: true,
    autoplay: true
  };

  form: FormGroup;

  ct: any;
  name_ct: any;
  address: any;

  constructor(
    private _contractsService: ContractsService,
    private _fun: Funciones,
    private ngZone: NgZone,
    private _modal: ModalController,
    public _comp: IonicComponentsService,
    public formBuilder: FormBuilder) {

    this.form = formBuilder.group({
      valor: ['', Validators.required],
    });

  }

  ngOnInit() {
    this.form.controls['valor'].setValue(this.field.value)
  }

  tiggerFields() {
    Object.keys(this.form.controls).forEach(field => {
      let _control = this.form.get(field);
      if (_control instanceof FormControl) _control.markAsTouched({ onlySelf: true });
      if (_control instanceof FormGroup) {
        Object.keys(_control.controls).forEach(field_g => {
          let _control_g = _control.get(field_g);
          if (_control_g instanceof FormControl) _control_g.markAsTouched({ onlySelf: true });
        });
      }
    });
  }

  async validateForm() {
    this.tiggerFields();
    if (this.form.valid) {
      /*this.create();*/
      console.log(this.form.value);
      this.confirm();
    }
  }

  async trasferOwner() {
    //Validar conexión en MetaMask
    await this._contractsService.connectMT();

    let sing: any = await this._contractsService.tranfertowner(this.ct);

    let signData: any = sing.data;

    let cred = { address: this.address, pk: null };
    await this._contractsService.
      signData(signData, 'Add Master', cred, this.ct);

    await this._fun.alertSucc('Se actualizó privilegios de usuario correctamente');
    this.confirm();
  }

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
    setTimeout(() => {
      this.pause();
    }, 1500);
  }

  stop(): void {
    this.ngZone.runOutsideAngular(() => this.animationItem.stop());
  }

  play(): void {
    this.ngZone.runOutsideAngular(() => this.animationItem.play());
  }

  pause(): void {
    this.ngZone.runOutsideAngular(() => this.animationItem.pause());
  }


  closeModal() {
    this._modal.dismiss();
  }

  confirm() {
    this._modal.dismiss({ confirm: true, value: this.form.value.valor });
  }

}
