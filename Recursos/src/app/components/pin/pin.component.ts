import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss'],
})
export class PinComponent {

  constructor() { }
  public digitos = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  @Input() data: any;
  @Input() icon?: any = null;
  
  @Output() backPage = new EventEmitter<string>();
  @Output() getClave = new EventEmitter<string>();

  pin: string = "";


  ngOnInit() {
    this.digitos = this.shuffle(this.digitos);
    this.pin='';
  }
  async ionViewDidEnter() {
    console.log('HOLAAAAAAAAAAAAA');
    this.pin='';
  }
  emitClave() {
    this.getClave.emit(this.pin);
    this.pin = "";
    this.shuffle(this.digitos);
  }

  back() {
    this.backPage.emit();
    this.pin = "";
    this.shuffle(this.digitos);
  }

  shuffle(digitos) {
    var i, j, temp;
    for (i = digitos.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = digitos[i];
      digitos[i] = digitos[j];
      digitos[j] = temp;
    }
    return digitos;
  };

  handleInput(pin: string) {
    if (pin === "clear") {
      this.pin = "";
      return;
    }

    if (pin === "delete") {
      this.pin = this.pin.substring(0, this.pin.length - 1)
      return;
    }

    if (this.pin.length === 6) {
      return;
    }
    this.pin += pin;
  }

}
