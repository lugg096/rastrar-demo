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
exports.HomePage = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var HomePage = /** @class */ (function () {
    function HomePage(router, formBuilder, _apiService, _comp, _storage) {
        this.router = router;
        this.formBuilder = formBuilder;
        this._apiService = _apiService;
        this._comp = _comp;
        this._storage = _storage;
        this.load = true;
        this.indexSlide = 0;
        this.initEnd = false;
        this.viewPass = false;
        this.tipo = "password";
        this.submitAttempt = false;
        this.slideOpts = {
            initialSlide: 0,
            slidesPerView: 1,
            speed: 700,
            autoplay: {
                delay: 2500
            }
        };
        this.slideOptsOnboarding = {
            allowSlideNext: false,
            allowSlidePrev: false,
            slidesPerView: 1,
            initialSlide: 0,
            speed: 400
        };
        this.options = {
            path: '/assets/json/27-loading.json',
            loop: true,
            autoplay: true
        };
        this.loginForm = formBuilder.group({
            username: ['', forms_1.Validators.compose([forms_1.Validators.pattern('^[0-9]+[A|B|D|E]+$'), forms_1.Validators.required])],
            pass: ['', forms_1.Validators.required]
        });
    }
    HomePage.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.submitAttempt = true;
                if (this.loginForm.valid) {
                    console.log(this.loginForm.value);
                    this.load = true;
                    this.nextSlidePadre();
                    this._apiService.login(this.loginForm.value).subscribe(function (res) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log('res', res);
                                    if (!(res.code == '200')) return [3 /*break*/, 2];
                                    console.log('Entro');
                                    return [4 /*yield*/, this._storage.setLocalStorage('user', { username: this.loginForm.value.username })];
                                case 1:
                                    _a.sent();
                                    this.load = false;
                                    this.router.navigate(['/inicio']);
                                    return [3 /*break*/, 3];
                                case 2:
                                    this._comp.presentToast('Identidad o contraseña no es correcta', 'danger', 3000);
                                    this.backSlidePadre();
                                    this.load = false;
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); }, function (_err) {
                        _this._comp.presentToast('Error con el servidor', 'danger', 3000);
                        _this.backSlidePadre();
                        _this.load = false;
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    HomePage.prototype.verSlide = function () {
        var _this = this;
        this.slidesDatos.getActiveIndex().then(function (res) {
            if (!_this.initEnd)
                _this.indexSlide = res;
            _this.initEnd = false;
        });
    };
    HomePage.prototype.animationCreated = function (animationItem) {
        this.animationItem = animationItem;
    };
    HomePage.prototype.mostrar = function () {
        if (this.viewPass) {
            this.tipo = "password";
            this.viewPass = false;
        }
        else {
            this.tipo = "text";
            this.viewPass = true;
        }
    };
    HomePage.prototype.endSlide = function () {
        this.initEnd = true;
        this.indexSlide = 2;
    };
    HomePage.prototype.nextSlideDatos = function () {
        this.slidesDatos.slideNext();
    };
    HomePage.prototype.nextSlidePadre = function () {
        this.slidesPadre.lockSwipeToNext(false);
        this.slidesPadre.slideNext();
        this.slidesPadre.lockSwipeToNext(true);
    };
    HomePage.prototype.backSlidePadre = function () {
        this.slidesPadre.lockSwipeToPrev(false);
        this.slidesPadre.slidePrev();
        this.slidesPadre.lockSwipeToPrev(true);
    };
    __decorate([
        core_1.ViewChild('slidesPadre', { static: false })
    ], HomePage.prototype, "slidesPadre");
    __decorate([
        core_1.ViewChild('slidesDatos', { static: false })
    ], HomePage.prototype, "slidesDatos");
    HomePage = __decorate([
        core_1.Component({
            selector: 'app-home',
            templateUrl: 'home.page.html',
            styleUrls: ['home.page.scss']
        })
    ], HomePage);
    return HomePage;
}());
exports.HomePage = HomePage;
