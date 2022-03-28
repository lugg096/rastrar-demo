"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var router_1 = require("@angular/router");
var angular_1 = require("@ionic/angular");
var app_component_1 = require("./app.component");
var app_routing_module_1 = require("./app-routing.module");
var http_1 = require("@angular/common/http");
var recibir_component_1 = require("./components/recibir/recibir.component");
var angularx_qrcode_1 = require("angularx-qrcode");
var forms_1 = require("@angular/forms");
var ngx_1 = require("@ionic-native/barcode-scanner/ngx");
var ngx_2 = require("@ionic-native/social-sharing/ngx");
var ngx_3 = require("@ionic-native/clipboard/ngx");
var data_service_service_1 = require("./services/data-service.service");
var transactions_component_1 = require("./components/transactions/transactions.component");
var generar_code_qr_component_1 = require("./components/generar-code-qr/generar-code-qr.component");
;
var ngx_4 = require("@ionic-native/file-opener/ngx");
var ngx_5 = require("@ionic-native/image-picker/ngx");
var ver_foto_component_1 = require("./components/ver-foto/ver-foto.component");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                recibir_component_1.RecibirComponent,
                transactions_component_1.TransactionsComponent,
                generar_code_qr_component_1.GenerarCodeQRComponent,
                ver_foto_component_1.VerFotoComponent
            ],
            entryComponents: [
                recibir_component_1.RecibirComponent,
                transactions_component_1.TransactionsComponent,
                generar_code_qr_component_1.GenerarCodeQRComponent,
                ver_foto_component_1.VerFotoComponent
            ],
            imports: [
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                platform_browser_1.BrowserModule,
                angular_1.IonicModule.forRoot(),
                app_routing_module_1.AppRoutingModule,
                http_1.HttpClientModule,
                angularx_qrcode_1.QRCodeModule
            ],
            providers: [
                { provide: router_1.RouteReuseStrategy, useClass: angular_1.IonicRouteStrategy },
                ngx_1.BarcodeScanner,
                ngx_2.SocialSharing,
                ngx_3.Clipboard,
                data_service_service_1.DataService,
                ngx_4.FileOpener,
                ngx_5.ImagePicker
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
