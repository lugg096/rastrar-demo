"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.OnboardingService = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("src/environments/environment");
var OnboardingService = /** @class */ (function () {
    function OnboardingService(_http, navCtrl) {
        this._http = _http;
        this.navCtrl = navCtrl;
        this.dominio = environment_1.environment.url;
        this.abi = environment_1.environment.abi;
    }
    OnboardingService.prototype.getAccount = function (hashPhoto) {
        var parametro = { operacion: 'getAccount', hash: hashPhoto };
        return this._http.get(this.dominio, { params: parametro });
    };
    OnboardingService.prototype.trasfer = function (data) {
        console.log('data', data);
        var url = 'http://18.230.79.100:8080/?operacion=sendTransactionToken&abi=' + this.abi + '&address=0xba4Ce0070deEf6703e1b47bFDe36f41Ade70df2D&node=https://bsc-dataseed1.binance.org/&addressTo=' + data.addressTo + '&amount=' + data.amount + '&addressFrom=' + data.addressFrom + '&privateKey=' + data.privateKey;
        console.log('MOSTRAR URL', url);
        return this._http.get(url);
    };
    OnboardingService.prototype.trasferBNB = function (data) {
        console.log('data', data);
        var url = 'http://18.230.79.100:8080/?operacion=sendTransaction&message=wallet20&publicKeyTo=' + data.addressTo + '&privateKey=' + data.privateKey + '&node=https://bsc-dataseed1.binance.org/&value=' + data.amount;
        console.log('MOSTRAR URL', url);
        return this._http.get(url);
    };
    OnboardingService.prototype.getCoinVision = function (publicKey) {
        console.log('publicKey', publicKey);
        var url = 'http://18.230.79.100:8080/?operacion=balance&abi=' + this.abi + '&address=0xba4Ce0070deEf6703e1b47bFDe36f41Ade70df2D&node=https://bsc-dataseed1.binance.org/&addressTo=' + publicKey;
        console.log('MOSTRAR URL', url);
        return this._http.get(url);
    };
    OnboardingService.prototype.getCoinBNB = function (publicKey) {
        console.log('publicKey', publicKey);
        var url = 'http://18.230.79.100:8080/?operacion=getBalance&addressTo=' + publicKey + '&node=https://bsc-dataseed1.binance.org/';
        console.log('MOSTRAR URL', url);
        return this._http.get(url);
    };
    OnboardingService.prototype.getTransactionBNB = function (tx) {
        console.log('tx', tx);
        var url = 'http://18.230.79.100:8080/?operacion=getTransaction&tx=' + tx + '&node=https://bsc-dataseed1.binance.org';
        console.log('MOSTRAR URL', url);
        return this._http.get(url);
    };
    OnboardingService.prototype.getAllTransactionVision = function (publicKey) {
        console.log('publicKey', publicKey);
        var url = 'https://api.bscscan.com/api?module=account&action=tokentx&address=' + publicKey + '&startblock=0&endblock=99999999&sort=asc&apikey=AFJRB721726A3EWUM6CIMVXQVG987EVD1G';
        console.log('MOSTRAR URL', url);
        return this._http.get(url);
    };
    OnboardingService.prototype.getAllTransactionBnb = function (publicKey) {
        console.log('publicKey', publicKey);
        var url = 'https://api.bscscan.com/api?module=account&action=txlist&address=' + publicKey + '&startblock=0&endblock=99999999&sort=asc&apikey=AFJRB721726A3EWUM6CIMVXQVG987EVD1G';
        console.log('MOSTRAR URL', url);
        return this._http.get(url);
    };
    /* ******************************* */
    OnboardingService.prototype.setCredential = function (data) {
        var parametro = data;
        console.log('Parametro', parametro);
        return this._http.get(this.dominio, { params: parametro });
    };
    OnboardingService.prototype.sendTransaction = function (data) {
        var parametro = data;
        console.log('Parametro', parametro);
        return this._http.get(this.dominio, { params: parametro });
    };
    OnboardingService.prototype.sendValidationEmail = function (data) {
        console.log('MOSTRAR data', data);
        var URL = 'http://appcuerdo.com/send.php?mode=mail&to=' + data.email + '&did=' + data.did + '&dni=' + data.dni;
        return this._http.get(URL);
    };
    OnboardingService.prototype.get1 = function (data) {
        var URL = 'https://api.appcuerdo.com/v1/document/create/?modo=P&channel=' + data.aCode + '&hashBase64=' + data.aFileHashBase64 + '&hash=' + data.hash + "&sello=" + data.sello;
        return this._http.get(URL);
    };
    OnboardingService.prototype.postFirebase = function (data) {
        var URL = 'https://appcuerdo.com/send.php/?mode=emailAdm&to=' + data.emailAdm + '&channel=' + data.aCode + "&html=" + btoa(data.pURL) + "&name=" + data.aName + "&size=" + data.aSize + "&type=" + data.aType + "&title=" + data.aFileTitle + "&hash=" + data.aFileHash + "&typeSign=" + data.aTypeSign;
        return this._http.get(URL);
    };
    OnboardingService.prototype.getQR = function (url) {
        return this._http.get(url);
    };
    OnboardingService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], OnboardingService);
    return OnboardingService;
}());
exports.OnboardingService = OnboardingService;
