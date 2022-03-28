"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var auth_guard_1 = require("./guards/auth.guard");
var routes = [
    {
        path: 'home',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./home/home.module'); }).then(function (m) { return m.HomePageModule; }); }
    },
    {
        path: 'inicio',
        canActivate: [auth_guard_1.AuthGuard],
        loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/inicio/inicio.module'); }).then(function (m) { return m.InicioPageModule; }); }
    },
    {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
    },
    {
        path: 'transferir',
        canActivate: [auth_guard_1.AuthGuard],
        loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/transferir/transferir.module'); }).then(function (m) { return m.TransferirPageModule; }); }
    },
    {
        path: 'transactions/:moneda',
        canActivate: [auth_guard_1.AuthGuard],
        loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/transactions/transactions.module'); }).then(function (m) { return m.TransactionsPageModule; }); }
    },
    {
        path: 'import-wallet',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/import-wallet/import-wallet.module'); }).then(function (m) { return m.ImportWalletPageModule; }); }
    },
    {
        path: 'options',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/options/options.module'); }).then(function (m) { return m.OptionsPageModule; }); }
    },
    {
        path: 'wallets',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/wallets/wallets.module'); }).then(function (m) { return m.WalletsPageModule; }); }
    },
    {
        path: 'data-wallet',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/data-wallet/data-wallet.module'); }).then(function (m) { return m.DataWalletPageModule; }); }
    },
    {
        path: 'registro',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/registro/registro.module'); }).then(function (m) { return m.RegistroPageModule; }); }
    },
    {
        path: 'gestion',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/gestion/gestion.module'); }).then(function (m) { return m.GestionPageModule; }); }
    },
    {
        path: 'certificado',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/certificado/certificado.module'); }).then(function (m) { return m.CertificadoPageModule; }); }
    },
    {
        path: 'profile',
        loadChildren: function () { return Promise.resolve().then(function () { return require('./pages/profile/profile.module'); }).then(function (m) { return m.ProfilePageModule; }); }
    }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [
                router_1.RouterModule.forRoot(routes, { preloadingStrategy: router_1.PreloadAllModules })
            ],
            exports: [router_1.RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
