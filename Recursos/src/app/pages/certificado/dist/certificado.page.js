"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CertificadoPage = void 0;
var core_1 = require("@angular/core");
var CertificadoPage = /** @class */ (function () {
    function CertificadoPage(socialSharing, router) {
        this.socialSharing = socialSharing;
        this.router = router;
    }
    CertificadoPage.prototype.ngOnInit = function () {
    };
    CertificadoPage.prototype.dasherize = function (string) {
        return string.replace(/[A-Z]/g, function (char, index) {
            return (index !== 0 ? '-' : '') + char.toLowerCase();
        });
    };
    ;
    CertificadoPage.prototype.goGestion = function () {
        this.router.navigate(['/gestion']);
    };
    CertificadoPage.prototype.verCertificado = function () {
        console.log('VER CERTIFICADO');
    };
    CertificadoPage.prototype.compartir = function () {
        this.socialSharing.share('', '', 'WEB', 'COMPARTIR ' + ': ' + '202020202020');
    };
    CertificadoPage = __decorate([
        core_1.Component({
            selector: 'app-certificado',
            templateUrl: './certificado.page.html',
            styleUrls: ['./certificado.page.scss']
        })
    ], CertificadoPage);
    return CertificadoPage;
}());
exports.CertificadoPage = CertificadoPage;
