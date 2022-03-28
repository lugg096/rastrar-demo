"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ValidationService = void 0;
var core_1 = require("@angular/core");
var ValidationService = /** @class */ (function () {
    function ValidationService() {
    }
    ValidationService.prototype.getValidatorErrorMessage = function (validatorName, validatorValue) {
        console.log('validatorValue', validatorValue);
        var config = {
            required: 'Campo es requerido',
            invalidCreditCard: 'El número de la tarjeta de credito es invalido',
            invalidEmailAddress: 'Dirección email invalida',
            invalidPassword: 'Contraseña invalida. La contraseña debe tener al menos 6 caracteres y contener un número',
            minlength: "Minimo n\u00FAmero de caracteres: " + validatorValue.requiredLength,
            maxlength: "M\u00E1ximo n\u00FAmero de caracteres: " + validatorValue.requiredLength,
            min: "Cantidad minima: " + validatorValue.min,
            max: "Cantidad m\u00E1xima: " + validatorValue.max
        };
        return config[validatorName];
    };
    ValidationService.prototype.creditCardValidator = function (control) {
        // Visa, MasterCard, American Express, Diners Club, Discover, JCB
        if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
            return null;
        }
        else {
            return { invalidCreditCard: true };
        }
    };
    ValidationService.prototype.emailValidator = function (control) {
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        }
        else {
            return { invalidEmailAddress: true };
        }
    };
    ValidationService.prototype.passwordValidator = function (control) {
        // {6,100}           - Assert password is between 6 and 100 characters
        // (?=.*[0-9])       - Assert a string has at least one number
        if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
            return null;
        }
        else {
            return { invalidPassword: true };
        }
    };
    ValidationService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ValidationService);
    return ValidationService;
}());
exports.ValidationService = ValidationService;
