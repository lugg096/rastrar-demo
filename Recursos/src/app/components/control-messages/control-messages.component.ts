import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-control-messages',
  templateUrl: './control-messages.component.html',
  styleUrls: ['./control-messages.component.scss'],
})
export class ControlMessagesComponent implements OnInit {
/* 
  errorMessageText: string='';
  @Input() control: any;
  constructor(private _validation: ValidationService) { }

  ngOnInit() {}
  
  errorMessage() {
    for (let propertyName in this.control.errors) {
      
      if (
        this.control.errors.hasOwnProperty(propertyName) &&
        this.control.touched
      ) {
        return this._validation.getValidatorErrorMessage(
          propertyName,
          this.control.errors[propertyName]
        );
      }
    }

    return null;
  }
}
 */


errorMessageText: string = '';
errorStandar = [];
@Input() control: any;
@Input() field?: string;
constructor(private _validation: ValidationService) { }

ngOnInit() { }

errorMessage() {
  this.errorStandar = [];

  if (this.control instanceof FormControl) return this.getMess(this.control);
  if (this.control instanceof FormGroup) {
    let val: any = null;
    Object.keys(this.control.controls).forEach(field_g => {

      if (this.field == field_g) {
        
        let _control_g = this.control.get(field_g);
        val = this.getMess(_control_g);
      }
    });
    return val;
  }

}


getMess(_control) {
/* console.log('_control',_control);
console.log('_control.errors',_control.errors); */
  for (let propertyName in _control.errors) {

    if (
      _control.errors.hasOwnProperty(propertyName) &&
      _control.touched) {
      
      let retorno = this._validation.getValidatorErrorMessage(
        propertyName,
        _control.errors[propertyName]
      );
      if (Array.isArray(retorno)) {
        /* console.log('this.retorno',retorno); */
        this.errorStandar = retorno;
        return '';
      } else this.errorStandar = [];
      return retorno;
    }
  }
  return null;
}
}
