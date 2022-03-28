"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProfilePage = void 0;
var core_1 = require("@angular/core");
var generar_code_qr_component_1 = require("src/app/components/generar-code-qr/generar-code-qr.component");
var ProfilePage = /** @class */ (function () {
    function ProfilePage(router, _modal) {
        this.router = router;
        this._modal = _modal;
    }
    ProfilePage.prototype.ngOnInit = function () {
    };
    ProfilePage.prototype.goGestion = function () {
        this.router.navigate(['/gestion']);
    };
    ProfilePage.prototype.generarQR = function (data) {
        this._modal.create({
            component: generar_code_qr_component_1.GenerarCodeQRComponent,
            componentProps: {
                codeQR: data.value,
                texto: data.text
            }
        }).then(function (modal) { return modal.present(); });
    };
    ProfilePage = __decorate([
        core_1.Component({
            selector: 'app-profile',
            templateUrl: './profile.page.html',
            styleUrls: ['./profile.page.scss']
        })
    ], ProfilePage);
    return ProfilePage;
}());
exports.ProfilePage = ProfilePage;
