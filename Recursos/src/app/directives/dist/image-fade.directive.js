"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ImageFadeDirective = void 0;
var core_1 = require("@angular/core");
var ImageFadeDirective = /** @class */ (function () {
    function ImageFadeDirective(renderer, domCtrl) {
        this.renderer = renderer;
        this.domCtrl = domCtrl;
    }
    ImageFadeDirective.prototype.onContentScroll = function ($event) {
        var _this = this;
        var scrollTop = $event.detail.scrollTop;
        var newOpacity = Math.max(100 - (scrollTop / 1.8), 0);
        var newPadding = 10 + (scrollTop / 10);
        if (newPadding > 100) {
            newPadding = 100;
        }
        this.domCtrl.write(function () {
            _this.renderer.setStyle(_this.cover, 'opacity', newOpacity + "%");
            _this.renderer.setStyle(_this.cover, 'padding-left', newPadding + "%");
            _this.renderer.setStyle(_this.cover, 'padding-right', newPadding + "%");
        });
    };
    __decorate([
        core_1.Input('appImageFade')
    ], ImageFadeDirective.prototype, "cover");
    __decorate([
        core_1.HostListener('ionScroll', ['$event'])
    ], ImageFadeDirective.prototype, "onContentScroll");
    ImageFadeDirective = __decorate([
        core_1.Directive({
            selector: '[appImageFade]'
        })
    ], ImageFadeDirective);
    return ImageFadeDirective;
}());
exports.ImageFadeDirective = ImageFadeDirective;
