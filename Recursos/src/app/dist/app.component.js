"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppComponent = void 0;
var core_1 = require("@angular/core");
/* import { StatusBar } from '@ionic-native/status-bar/ngx'; */
var core_2 = require("@capacitor/core");
var StatusBar = core_2.Plugins.StatusBar;
var AppComponent = /** @class */ (function () {
    function AppComponent(plt) {
        this.plt = plt;
        this.isStatusBarLight = true;
        if (this.plt.is('capacitor')) {
            StatusBar.setStyle({ style: core_2.StatusBarStyle.Dark });
            StatusBar.setBackgroundColor({ color: "#04143c" });
        }
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: 'app.component.html',
            styleUrls: ['app.component.scss']
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
