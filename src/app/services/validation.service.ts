import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

   getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
/*      console.log('validatorValue',validatorValue);
     console.log('validatorName',validatorName); */


    let reglaStandar = [];
    if(validatorValue.requiredPattern=='^[a-zA-Z_][a-zA-Z0-9_]+$'){
      reglaStandar.push('No acepta espacios en blanco');
      reglaStandar.push('No acepta números al inicio del nombre');
      reglaStandar.push('No acepta caracteres especiales, exepto el guión bajo "_" ');
    }
    if(validatorValue.requiredPattern=='^[^@]+@[^@]+.[^@]+$'){
      reglaStandar.push('Correo inválido');
    }
    
    let config = {
      required: 'Campo es requerido',
      invalidCreditCard: 'El número de la tarjeta de credito es invalido',
      invalidEmailAddress: 'Dirección email invalida',
      invalidPassword: 'Contraseña invalida. La contraseña debe tener al menos 6 caracteres y contener un número',
      minlength: `Minimo número de caracteres: ${validatorValue.requiredLength}`,
      maxlength: `Máximo número de caracteres: ${validatorValue.requiredLength}`,
      min:`Cantidad minima: ${validatorValue.min}`,
      max:`Cantidad máxima: ${validatorValue.max}`,

      pattern: reglaStandar
    };

    return config[validatorName];
  }

   creditCardValidator(control) {
    if (
      control.value.match(
        /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
      )
    ) {
      return null;
    } else {
      return { invalidCreditCard: true };
    }
  }

   emailValidator(control) {
    if (
      control.value.match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      )
    ) {
      return null;
    } else {
      return { invalidEmailAddress: true };
    }
  }

   passwordValidator(control) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return { invalidPassword: true };
    }
  }
}
