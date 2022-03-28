"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ComponentsModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var angular_1 = require("@ionic/angular");
var pin_component_1 = require("./pin/pin.component");
var control_messages_component_1 = require("./control-messages/control-messages.component");
var capture_images_component_1 = require("./capture-images/capture-images.component");
var ComponentsModule = /** @class */ (function () {
    function ComponentsModule() {
    }
    ComponentsModule = __decorate([
        core_1.NgModule({
            declarations: [
                pin_component_1.PinComponent,
                control_messages_component_1.ControlMessagesComponent,
                capture_images_component_1.CaptureImagesComponent
            ],
            exports: [
                pin_component_1.PinComponent,
                control_messages_component_1.ControlMessagesComponent,
                capture_images_component_1.CaptureImagesComponent
            ],
            imports: [
                common_1.CommonModule,
                angular_1.IonicModule
            ]
        })
    ], ComponentsModule);
    return ComponentsModule;
}());
exports.ComponentsModule = ComponentsModule;
