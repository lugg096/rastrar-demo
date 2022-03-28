"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PipesModule = void 0;
var core_1 = require("@angular/core");
var angular_1 = require("@ionic/angular");
var filtro_country_pipe_1 = require("./filtro-country.pipe");
var PipesModule = /** @class */ (function () {
    function PipesModule() {
    }
    PipesModule = __decorate([
        core_1.NgModule({
            declarations: [filtro_country_pipe_1.FiltroCountryPipe],
            exports: [filtro_country_pipe_1.FiltroCountryPipe],
            imports: [
                angular_1.IonicModule
            ]
        })
    ], PipesModule);
    return PipesModule;
}());
exports.PipesModule = PipesModule;
