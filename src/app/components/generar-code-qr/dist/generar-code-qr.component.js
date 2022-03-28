"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GenerarCodeQRComponent = void 0;
var core_1 = require("@angular/core");
var GenerarCodeQRComponent = /** @class */ (function () {
    function GenerarCodeQRComponent(_modal, _comp) {
        this._modal = _modal;
        this._comp = _comp;
        this.codeQR = '';
        this.texto = '';
        this.title = '';
    }
    GenerarCodeQRComponent.prototype.ngOnInit = function () {
    };
    GenerarCodeQRComponent.prototype.ngAfterViewInit = function () { };
    GenerarCodeQRComponent.prototype.closeModal = function () {
        this._modal.dismiss({ dataPersonal: null });
    };
    GenerarCodeQRComponent.prototype.continuar = function () {
        this._modal.dismiss({
            dataPersonal: {}
        });
    };
    GenerarCodeQRComponent.prototype.copyText = function () {
        var selBox = document.createElement('textarea');
        selBox.value = this.codeQR;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this._comp.presentToast('Texto copiado', 'primary', 1000);
    };
    __decorate([
        core_1.ViewChild("container", { read: core_1.ElementRef, static: true })
    ], GenerarCodeQRComponent.prototype, "container");
    GenerarCodeQRComponent = __decorate([
        core_1.Component({
            selector: 'app-generar-code-qr',
            templateUrl: './generar-code-qr.component.html',
            styleUrls: ['./generar-code-qr.component.scss']
        })
    ], GenerarCodeQRComponent);
    return GenerarCodeQRComponent;
}());
exports.GenerarCodeQRComponent = GenerarCodeQRComponent;
