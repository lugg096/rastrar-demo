"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FiltroCountryPipe = void 0;
var core_1 = require("@angular/core");
var FiltroCountryPipe = /** @class */ (function () {
    function FiltroCountryPipe() {
    }
    FiltroCountryPipe.prototype.transform = function (countries, text) {
        if (text.length == 0)
            return countries;
        text = text.toLocaleLowerCase();
        return countries.filter(function (country) {
            return country.name.toLocaleLowerCase().includes(text);
        });
    };
    FiltroCountryPipe = __decorate([
        core_1.Pipe({
            name: 'filtroCountry'
        })
    ], FiltroCountryPipe);
    return FiltroCountryPipe;
}());
exports.FiltroCountryPipe = FiltroCountryPipe;
