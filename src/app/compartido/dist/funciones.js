"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Funciones = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("src/environments/environment");
var alert_component_1 = require("../components/alert/alert.component");
var Funciones = /** @class */ (function () {
    function Funciones(_modal, _contractsService, _comp) {
        this._modal = _modal;
        this._contractsService = _contractsService;
        this._comp = _comp;
    }
    Funciones.prototype.generateData = function (data, isMasive) {
        var _this = this;
        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var confirm, loading;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alert('alert', 'Si, crear', environment_1.environment.MSG.ALERT_TITLE, environment_1.environment.MSG.ALERT_CREATE, isMasive)];
                    case 1:
                        confirm = _a.sent();
                        if (!confirm)
                            return [2 /*return*/];
                        return [4 /*yield*/, this._comp.presentLoading()];
                    case 2:
                        loading = _a.sent();
                        if (!this.isUndefined(isMasive)) return [3 /*break*/, 4];
                        return [4 /*yield*/, loading.present()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        this._contractsService.getAccount().subscribe(function (res) { return __awaiter(_this, void 0, void 0, function () {
                            var pin;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!!res) return [3 /*break*/, 2];
                                        loading.dismiss();
                                        resolve(null);
                                        return [4 /*yield*/, this.alert('danger', 'OK', environment_1.environment.MSG.ERROR_TITLE, environment_1.environment.MSG.ERROR_SERV)];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2:
                                        pin = this.makePin(6);
                                        data.did = res.publicKey;
                                        data.pin = pin;
                                        data.privateKey = this.secureKey(res, pin);
                                        /** SE PUEDE JUNTAR **/
                                        this.createDid(resolve, data, loading, isMasive);
                                        return [2 /*return*/];
                                }
                            });
                        }); }, function (err) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        loading.dismiss();
                                        resolve(null);
                                        return [4 /*yield*/, this.alert('danger', 'OK', environment_1.environment.MSG.ERROR_TITLE, environment_1.environment.MSG.ERROR_SERV)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Funciones.prototype.makePin = function (length) {
        var result = '';
        var characters = '0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };
    Funciones.prototype.secureKey = function (res, pin) {
        var position = Number(pin.substr(0, 2));
        if (position > 62)
            position = position - 62;
        if (position == 0)
            position = 2;
        var n1 = Number(pin.substr(2, 2));
        var n2 = Number(pin.substr(4, 2));
        var str = res.privateKey.substr(position, 4);
        var hex1 = str.substr(0, 2);
        var number1 = parseInt(hex1, 16) + n1;
        var hex2 = str.substr(2, 2);
        var number2 = parseInt(hex2, 16) + n2;
        return res.privateKey.substr(0, position) +
            res.privateKey.substr(position + 4, res.privateKey.length) +
            number1 + 'G' + number2;
    };
    Funciones.prototype.createDid = function (resolve, data, loading, isMasive) {
        var _this = this;
        console.log(data);
        // Datos para crear DID
        var dataUser = {
            addressTo: data.did,
            entity: encodeURIComponent(data.name),
            typeEntity: data.typeEntity
        };
        this._contractsService.createDid(dataUser).subscribe(function (res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('DID A SIDO CREADO CON EXITO para ', res);
                        console.log('dataUser ', dataUser);
                        if (!!res) return [3 /*break*/, 2];
                        loading.dismiss();
                        resolve(null);
                        return [4 /*yield*/, this.alert('success', 'OK', environment_1.environment.MSG.SEC_TITLE, environment_1.environment.MSG.SUC_CREATE, isMasive)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        data.tx = res.transactionHash;
                        data.status = environment_1.environment.STATUS_DID_ENABLED;
                        /* UPDATE DATA BASE */
                        /*  Guardar secureData
                        *
                        *
                        *
                        * */
                        /* if(indexPending < listPending.length - 1) this.generateData(listPending[indexPending + 1], indexPending + 1); */
                        resolve(data);
                        loading.dismiss();
                        return [4 /*yield*/, this.alert('success', 'OK', environment_1.environment.MSG.SEC_TITLE, environment_1.environment.MSG.SUC_CREATE, isMasive)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, function (err) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loading.dismiss();
                        resolve(null);
                        return [4 /*yield*/, this.alert('danger', 'OK', environment_1.environment.MSG.ERROR_TITLE, environment_1.environment.MSG.ERROR_SERV, isMasive)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Funciones.prototype.desactivarDid = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var confirm;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alert('alert', 'Si, deshabilitar', environment_1.environment.MSG.ALERT_TITLE, environment_1.environment.MSG.ALERT_DISABLED)];
                    case 1:
                        confirm = _a.sent();
                        if (!confirm)
                            return [2 /*return*/];
                        return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                                var loading, dataUser;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this._comp.presentLoading()];
                                        case 1:
                                            loading = _a.sent();
                                            return [4 /*yield*/, loading.present()];
                                        case 2:
                                            _a.sent();
                                            dataUser = {
                                                addressTo: data.did
                                            };
                                            this._contractsService.revokeDid(dataUser).subscribe(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            if (!!res) return [3 /*break*/, 2];
                                                            console.log('Respuesta invalida', res);
                                                            loading.dismiss();
                                                            resolve(null);
                                                            return [4 /*yield*/, this.alert('danger', 'OK', environment_1.environment.MSG.ERROR_TITLE, environment_1.environment.MSG.ERROR_SERV)];
                                                        case 1:
                                                            _a.sent();
                                                            _a.label = 2;
                                                        case 2:
                                                            /* UPDATE DATA BASE */
                                                            /*
                                                            *
                                                            *
                                                            *
                                                            * */
                                                            /*  let index = this.list.findIndex(d => d.id == data.id); */
                                                            data.status = environment_1.environment.STATUS_DID_DISABLED;
                                                            resolve(data);
                                                            console.log('Mostrar Respuesta', res);
                                                            loading.dismiss();
                                                            return [4 /*yield*/, this.alert('success', 'OK', environment_1.environment.MSG.SEC_TITLE, environment_1.environment.MSG.SUC_DISABLED)];
                                                        case 3:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); }, function (err) { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            loading.dismiss();
                                                            resolve(null);
                                                            console.log('Mostrar Error', err);
                                                            return [4 /*yield*/, this.alert('danger', 'OK', environment_1.environment.MSG.ERROR_TITLE, environment_1.environment.MSG.ERROR_SERV)];
                                                        case 1:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); });
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                }
            });
        });
    };
    Funciones.prototype.activarDid = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var confirm;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alert('alert', 'Si, habilitar', environment_1.environment.MSG.ALERT_TITLE, environment_1.environment.MSG.ALERT_ENABLED)];
                    case 1:
                        confirm = _a.sent();
                        if (!confirm)
                            return [2 /*return*/];
                        return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                                var loading, dataUser;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this._comp.presentLoading()];
                                        case 1:
                                            loading = _a.sent();
                                            return [4 /*yield*/, loading.present()];
                                        case 2:
                                            _a.sent();
                                            dataUser = {
                                                addressTo: data.did,
                                                entity: data.name,
                                                typeEntity: data.typeEntity
                                            };
                                            this._contractsService.enableDID(dataUser).subscribe(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            if (!!res) return [3 /*break*/, 2];
                                                            loading.dismiss();
                                                            resolve(null);
                                                            return [4 /*yield*/, this.alert('danger', 'OK', environment_1.environment.MSG.ERROR_TITLE, environment_1.environment.MSG.ERROR_SERV)];
                                                        case 1:
                                                            _a.sent();
                                                            _a.label = 2;
                                                        case 2:
                                                            /* UPDATE DATA BASE */
                                                            /*
                                                            *
                                                            *
                                                            *
                                                            * */
                                                            data.status = environment_1.environment.STATUS_DID_ENABLED;
                                                            loading.dismiss();
                                                            resolve(data);
                                                            return [4 /*yield*/, this.alert('success', 'OK', environment_1.environment.MSG.SEC_TITLE, environment_1.environment.MSG.SUC_ENABLED)];
                                                        case 3:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); }, function (err) { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            loading.dismiss();
                                                            resolve(null);
                                                            return [4 /*yield*/, this.alert('danger', 'OK', environment_1.environment.MSG.ERROR_TITLE, environment_1.environment.MSG.ERROR_SERV)];
                                                        case 1:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); });
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                }
            });
        });
    };
    Funciones.prototype["delete"] = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var confirm;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alert('alert', 'Si, revocar', environment_1.environment.MSG.ALERT_TITLE, environment_1.environment.MSG.ALERT_DELETE)];
                    case 1:
                        confirm = _a.sent();
                        if (!confirm)
                            return [2 /*return*/];
                        return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                                var loading;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this._comp.presentLoading()];
                                        case 1:
                                            loading = _a.sent();
                                            return [4 /*yield*/, loading.present()];
                                        case 2:
                                            _a.sent();
                                            data.status = environment_1.environment.STATUS_DID_PENDING;
                                            data.did = null;
                                            loading.dismiss();
                                            resolve(data);
                                            return [4 /*yield*/, this.alert('success', 'OK', environment_1.environment.MSG.SEC_TITLE, environment_1.environment.MSG.SUC_DELETE)];
                                        case 3:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                }
            });
        });
    };
    Funciones.prototype.getDid = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var loading, dataUser;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this._comp.presentLoading()];
                                case 1:
                                    loading = _a.sent();
                                    return [4 /*yield*/, loading.present()];
                                case 2:
                                    _a.sent();
                                    dataUser = {
                                        addressTo: data.did //llave publica de usuario
                                    };
                                    this._contractsService.getCredential(dataUser).subscribe(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!!res) return [3 /*break*/, 2];
                                                    loading.dismiss();
                                                    resolve(null);
                                                    return [4 /*yield*/, this.alert('danger', 'OK', environment_1.environment.MSG.ERROR_TITLE, environment_1.environment.MSG.ERROR_SERV)];
                                                case 1:
                                                    _a.sent();
                                                    _a.label = 2;
                                                case 2:
                                                    console.log('RESPUESTA DE GET', res);
                                                    data.data = res.data;
                                                    loading.dismiss();
                                                    resolve(data);
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }, function (err) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    loading.dismiss();
                                                    resolve(null);
                                                    return [4 /*yield*/, this.alert('danger', 'OK', environment_1.environment.MSG.ERROR_TITLE, environment_1.environment.MSG.ERROR_SERV)];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /* ALERT */
    Funciones.prototype.alert = function (type, buttonConfim, textTitle, subtitle, desablet) {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.isUndefined(desablet))
                    return [2 /*return*/, true];
                options = {
                    path: '/assets/json/' + type + '.json',
                    loop: true,
                    autoplay: true
                };
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var modal;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this._modal.create({
                                        component: alert_component_1.AlertComponent,
                                        cssClass: 'style-alert',
                                        componentProps: {
                                            type: type,
                                            textTitle: textTitle,
                                            subtitle: subtitle,
                                            buttonConfim: buttonConfim,
                                            options: options
                                        }
                                    })];
                                case 1:
                                    modal = _a.sent();
                                    modal.onDidDismiss().then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            resolve(res.data);
                                            return [2 /*return*/];
                                        });
                                    }); });
                                    return [4 /*yield*/, modal.present()];
                                case 2: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); })];
            });
        });
    };
    Funciones.prototype.isUndefined = function (data) {
        if (data == undefined)
            return true;
        return false;
    };
    Funciones.prototype.closeMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    Funciones = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], Funciones);
    return Funciones;
}());
exports.Funciones = Funciones;
