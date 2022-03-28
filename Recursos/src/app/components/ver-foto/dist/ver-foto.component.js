"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.VerFotoComponent = void 0;
var core_1 = require("@angular/core");
var VerFotoComponent = /** @class */ (function () {
    function VerFotoComponent(_modal) {
        this._modal = _modal;
        this.sliderOpts = {
            preventInteractionOnTransition: true,
            zoom: {
                maxRatio: 5
            },
            allowSlideNext: false,
            allowSlidePrev: false
        };
    }
    VerFotoComponent.prototype.ngOnInit = function () { };
    VerFotoComponent.prototype.closeModal = function (action) {
        this._modal.dismiss({
            "delete": action
        });
    };
    VerFotoComponent.prototype.zoom = function (zoomIn) {
        var zoom = this.slider.nativeElement.swiper.zoom;
        if (zoomIn)
            zoom["in"]();
        else
            zoom.out();
    };
    __decorate([
        core_1.ViewChild('slider', { read: core_1.ElementRef })
    ], VerFotoComponent.prototype, "slider");
    VerFotoComponent = __decorate([
        core_1.Component({
            selector: 'app-ver-foto',
            templateUrl: './ver-foto.component.html',
            styleUrls: ['./ver-foto.component.scss']
        })
    ], VerFotoComponent);
    return VerFotoComponent;
}());
exports.VerFotoComponent = VerFotoComponent;
