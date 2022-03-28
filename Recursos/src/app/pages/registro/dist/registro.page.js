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
exports.RegistroPage = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var capture_images_component_1 = require("src/app/components/capture-images/capture-images.component");
var RegistroPage = /** @class */ (function () {
    function RegistroPage(router, formBuilder, barcodeScanner, _modal) {
        this.router = router;
        this.formBuilder = formBuilder;
        this.barcodeScanner = barcodeScanner;
        this._modal = _modal;
        this.submitAttempt = false;
        this.data = {
            code: '001',
            title: 'Registro Sanitario',
            icon: '',
            buttons: [
                {
                    color: '#fff',
                    background: '#15966B',
                    width: '50',
                    text: 'Grabar',
                    type: 'confirm' // confirm |  cancel  
                }
            ],
            fields: [
                {
                    code: 'photo',
                    caption: 'Imagenes de registro sanitario',
                    value: '',
                    placeholder: 'Agregar imagenes de referencia',
                    type: 'photos',
                    inputtype: 'text',
                    rows: null,
                    width: '100',
                    long: 20,
                    max: 10,
                    min: null,
                    options: [],
                    required: true //true | false	
                },
                {
                    code: 'productor',
                    caption: 'Productor',
                    value: '',
                    placeholder: 'DNI o llave publica',
                    type: 'address',
                    inputtype: 'text',
                    rows: null,
                    width: '100',
                    long: null,
                    max: null,
                    min: null,
                    options: [],
                    required: true //true | false	
                },
                {
                    code: 'campania',
                    caption: 'Campaña',
                    value: '',
                    placeholder: 'Tipo de campaña',
                    type: 'select',
                    inputtype: 'text',
                    rows: null,
                    width: '100',
                    long: null,
                    max: null,
                    min: null,
                    options: [{
                            code: 'c1',
                            option: 'Campaña 1'
                        }, {
                            code: 'c2',
                            option: 'Campaña 2'
                        }],
                    required: true //true | false	
                },
                {
                    code: 'numAlpacas',
                    caption: 'Cant. Alpacas',
                    value: '',
                    placeholder: 'Cantidad de alpacas',
                    type: 'input',
                    inputtype: 'number',
                    rows: null,
                    width: '100',
                    long: null,
                    max: 100,
                    min: 0,
                    options: [],
                    required: true //true | false	
                },
                {
                    code: 'emision',
                    caption: 'Emisión',
                    value: '',
                    placeholder: 'Fecha de emisión',
                    type: 'input',
                    inputtype: 'date',
                    rows: null,
                    width: '100',
                    long: null,
                    max: null,
                    min: null,
                    options: [],
                    required: true //true | false	
                },
                {
                    code: 'vencimiento',
                    caption: 'Vencimiento',
                    value: '',
                    placeholder: 'Fecha de vencimiento',
                    type: 'input',
                    inputtype: 'date',
                    rows: null,
                    width: '100',
                    long: null,
                    max: null,
                    min: null,
                    options: [],
                    required: true //true | false	
                },
                {
                    code: 'productos',
                    caption: 'Productos utilizados',
                    value: '',
                    placeholder: 'Listado de productos utilizados,técnica, etc.',
                    type: 'textbox',
                    inputtype: 'text',
                    rows: 3,
                    width: '100',
                    long: null,
                    max: null,
                    min: null,
                    options: [],
                    required: false //true | false	
                }
            ]
        };
        this.fields = [];
        this.buttons = [];
        this.photoPreview = [];
    }
    RegistroPage.prototype.ngOnInit = function () {
        var _this = this;
        this.registroForm = this.formBuilder.group({});
        this.data.fields.forEach(function (field) {
            var validators = [];
            if (field.required)
                validators.push(forms_1.Validators.required);
            if (field.long)
                validators.push(forms_1.Validators.maxLength(field.long));
            if (field.max && field.inputtype == 'number')
                validators.push(forms_1.Validators.max(field.max));
            if (field.min && field.inputtype == 'number')
                validators.push(forms_1.Validators.min(field.min));
            _this.registroForm.addControl(field.code, new forms_1.FormControl(field.value, validators));
            _this.fields.push(field);
        });
        this.data.buttons.forEach(function (field) {
            _this.buttons.push(field);
        });
    };
    RegistroPage.prototype.imagesCapture = function (field) {
        return __awaiter(this, void 0, void 0, function () {
            var modal;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._modal.create({
                            component: capture_images_component_1.CaptureImagesComponent,
                            componentProps: {
                                field: field,
                                photoPreview: this.photoPreview
                            }
                        })];
                    case 1:
                        modal = _a.sent();
                        modal.onDidDismiss().then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                this.photoPreview = res.data.photoPreview;
                                this.registroForm.controls[field.code].setValue(this.photoPreview);
                                return [2 /*return*/];
                            });
                        }); });
                        return [4 /*yield*/, modal.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RegistroPage.prototype.tiggerFields = function () {
        var _this = this;
        Object.keys(this.registroForm.controls).forEach(function (field) {
            var _control = _this.registroForm.get(field);
            if (_control instanceof forms_1.FormControl)
                _control.markAsTouched({ onlySelf: true });
        });
    };
    RegistroPage.prototype.actionButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.tiggerFields();
                if (this.registroForm.valid) {
                    console.log('VALID', this.registroForm.valid);
                }
                return [2 /*return*/];
            });
        });
    };
    RegistroPage.prototype.goGestion = function () {
        this.router.navigate(['/gestion']);
    };
    RegistroPage.prototype.scan = function (field) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.barcodeScanner.scan({ prompt: "Lee código QR de " + field.caption }).then(function (code) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (code)
                            this.registroForm.controls[field.code].setValue(code.text);
                        return [2 /*return*/];
                    });
                }); })["catch"](function (err) {
                    console.log('Error', err);
                });
                return [2 /*return*/];
            });
        });
    };
    RegistroPage = __decorate([
        core_1.Component({
            selector: 'app-registro',
            templateUrl: './registro.page.html',
            styleUrls: ['./registro.page.scss']
        })
    ], RegistroPage);
    return RegistroPage;
}());
exports.RegistroPage = RegistroPage;
