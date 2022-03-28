"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ControlMessagesComponent = void 0;
var core_1 = require("@angular/core");
var ControlMessagesComponent = /** @class */ (function () {
    function ControlMessagesComponent(_validation) {
        this._validation = _validation;
        this.errorMessageText = '';
    }
    ControlMessagesComponent.prototype.ngOnInit = function () { };
    ControlMessagesComponent.prototype.errorMessage = function () {
        for (var propertyName in this.control.errors) {
            if (this.control.errors.hasOwnProperty(propertyName) &&
                this.control.touched) {
                return this._validation.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
            }
        }
        return null;
    };
    __decorate([
        core_1.Input()
    ], ControlMessagesComponent.prototype, "control");
    ControlMessagesComponent = __decorate([
        core_1.Component({
            selector: 'app-control-messages',
            templateUrl: './control-messages.component.html',
            styleUrls: ['./control-messages.component.scss']
        })
    ], ControlMessagesComponent);
    return ControlMessagesComponent;
}());
exports.ControlMessagesComponent = ControlMessagesComponent;
