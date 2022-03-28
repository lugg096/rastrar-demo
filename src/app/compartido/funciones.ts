import { Injectable } from '@angular/core';
/* import { ContractsService } from '../services/contracts.service'; */
import { IonicComponentsService } from '../services/ionic-components.service';
import { environment as env } from 'src/environments/environment';
import { AlertComponent } from '../components/alert/alert.component';
import { ModalController } from '@ionic/angular';
import { Validators } from '@angular/forms';
import { sha256 } from 'js-sha256';
import { ApiMongoService } from '../services/apiMongo.service';

@Injectable({
  providedIn: 'root'
})
export class Funciones {

  constructor(
    private _apiMongo: ApiMongoService,
    private _modal: ModalController,
    /*    private _contractsService: ContractsService, */
    public _comp: IonicComponentsService) { }

  months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];


  /* ALERT */
  async alert(type, buttonConfim, textTitle, subtitle, desablet?) {

    if (!this.isUndefined(desablet)) return true;
    let options = {
      path: '/assets/json/' + type + '.json',
      loop: true,
      autoplay: true
    }
    return new Promise(async resolve => {
      const modal = await this._modal.create({
        component: AlertComponent,
        cssClass: 'style-alert',
        componentProps: {
          type,
          textTitle,
          subtitle,
          buttonConfim,
          options
        }
      });

      modal.onDidDismiss().then(async (res: any) => {
        resolve(res.data);
      });
      return await modal.present();
    });
  }

  async alertWarning(textInfo, textBut) {
    return await this.alert(env.MSG.TYPE_ALERT, textBut, env.MSG.ALERT_TITLE, textInfo);
  }



  getTime(tms) {

    let milliseconds = Math.floor((tms % 1000) / 100);
    let seconds: any = Math.floor((tms / 1000) % 60);
    let minutes: any = Math.floor((tms / (1000 * 60)) % 60);
    let hours: any = Math.floor((tms / (1000 * 60 * 60)) % 24);

    /*  hours = (hours < 10) ? "0" + hours : hours;
     minutes = (minutes < 10) ? "0" + minutes : minutes;
     seconds = (seconds < 10) ? "0" + seconds : seconds; */

    hours = (hours > 1) ? hours + " horas" : (hours == 1 ? hours + " hora" : '');
    minutes = (minutes > 1) ? minutes + " minutos" : (minutes == 1 ? minutes + " minuto" : '');
    seconds = (seconds > 1) ? seconds + " segundos" : (seconds == 1 ? seconds + " segundo" : '');
    /*     seconds = (seconds < 10) ? "0" + seconds : seconds; */

    return { hours, minutes, seconds, milliseconds };
  }


  noRefObj(data){
    //Cuando se entrega un valor a una variable de otro varible, lo que pasa en realizada es que la segunda varaible guarda una referencia
    //de la variable inicial mas no se crea una nueva variable como copia, es decir que si la variable inicial cambia la segunda tambien

    //Generar una copia de objeto
   return JSON.parse(JSON.stringify(data));
  }

  async alertError(error: any) {
    console.log('ERROR',error);
    

    let mensj = error;
    if (!this.isVarInvalid(error.message)) mensj = error.message;
    await this.alert(env.MSG.TYPE_ERROR, 'ok', env.MSG.ERROR_TITLE, mensj);
  }

  async alertGen(bconf, tdesc) {
    return await this.alert(env.MSG.TYPE_ALERT, bconf, env.MSG.ALERT_TITLE, tdesc);
  }

  async alertChangStatus(status) {

    let bconf = 'Si, deshabilitar';
    let tdesc = env.MSG.ALERT_DISABLED;

    if (status) {
      bconf = 'Si, habilitar',
        tdesc = env.MSG.ALERT_ENABLED
    }
    return await this.alert(env.MSG.TYPE_ALERT, bconf, env.MSG.ALERT_TITLE, tdesc);
  }

  timeStamp() {
    return new Date().getTime();
  }
  
  isString(obj) {
    if (typeof obj === 'string' || obj instanceof String) return true;
    else false;
  }

  async alertChangMaster(status, sm) {

    let bconf = 'Si, quitar';
    let tdesc = env.MSG.ALERT_REMOVE_MASTER;

    if (!status) {
      bconf = 'Si, habilitar',
        tdesc = env.MSG.ALERT_ENABLED_MASTER
    }
    return await this.alert(env.MSG.TYPE_ALERT, bconf, env.MSG.ALERT_TITLE, tdesc + sm);
  }

  async alertDelete() {
    return await this.alert(env.MSG.TYPE_ALERT, 'Si, eliminar', env.MSG.ALERT_TITLE, env.MSG.ALERT_DELETE);
  }

  async alertSave(isEdit) {
    let bconf = 'Si, crear';
    let tdesc = env.MSG.ALERT_CREATE;

    if (isEdit) {
      bconf = 'Si, actualizar';
      tdesc = env.MSG.ALERT_UPDATE;
    }
    return await this.alert(env.MSG.TYPE_ALERT, bconf, env.MSG.ALERT_TITLE, tdesc);
  }



  async alertSucc(message) {
    return await this.alert(env.MSG.TYPE_SUC, ' Ok ', env.MSG.ALERT_TITLE, message);
  }


  isUndefined(data: any) {
    if (data == undefined) return true;
    return false;
  }

  isVarInvalid(data: any) {
    if (typeof data === 'string' || data instanceof String) data = data.trim();
    if (data == undefined || data == null || data == 'undefined' || data == 'null' || data == '') return true;
    return false;
  }

  isInvalidResApi(code: any) {
    if (code != 200 && code != '200') return true;
    return false;
  }

  isEmpty(...obj) {
    let isEmpty = true;
    for (let i = 0; i < obj.length; i++) {
      if (Array.isArray(obj[i])) {
        if (obj[i].length != 0) isEmpty = false;
        break;
      }
      if (this.isVarInvalid((obj[i]))) {
        isEmpty = false;
        break;
      }
    }
    return isEmpty;
  }

  strToJson(str: string) {
    try {
      if (this.isVarInvalid(str)) return {};
      else {
        return JSON.parse(str)
      }
    } catch (error) {
      this.alertError(error);
      return null;
    }
  }

  validJson(str: string) {
    try {
      if (this.isVarInvalid(str)) return '';
      else {
        let valueJson = JSON.parse(str);
        return valueJson;
      }
    } catch (error) {
      this.alertError(error);
      return null;
    }
  }

  enum(item) {
    return env.enum[item];
  }

  codeToenum(code) {
    let number: number = parseInt(code.replaceAll("C", ""));
    return number;
  }

  async closeMenu() {
    return new Promise(async resolve => {
    });
  }


  sortJSON(arr, key, way) {
    return arr.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      if (typeof x === 'string' || x instanceof String) x = x.toLowerCase();
      if (typeof y === 'string' || y instanceof String) y = y.toLowerCase();

      if (way) { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
      if (!way) { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
    });
  }

  async getParmas(key_table) {
    const res: any = await this._apiMongo.get(env.COLLECTION.general, key_table, 'items');
    return res.result[0][key_table];
  }


  patchValueJson(jsonEstruc, jsonData) {
    Object.keys(jsonEstruc).forEach(key => {
      jsonEstruc[key] = this.valueKeyJSON(jsonData, key);
    })
    return jsonEstruc;
  }

  valueKeyJSON(json, keyJson) {
    var value = null;
    Object.keys(json).forEach(key => {
      if (key == keyJson) value = json[key];
    });
    return value;
  }

  tmspToStr(timestamp) {

    var a = new Date(timestamp);
    var year = a.getFullYear();
    var month = this.months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;

    return time;
  }

  dateStrtoTms(date: string, minutesLocal: boolean) {
    let newDate = new Date();
    let d_str = newDate.toDateString();
    let timehms = newDate.getTime() - new Date(d_str).getTime();

    var parts: any = date.split('-');
    let mydate = new Date(parts[0], parts[1] - 1, parts[2]);
    let time = mydate.getTime();
    if (minutesLocal) time += timehms;

    return Math.floor(time / 1000);
  }

  datelocal() {
    let newDate = new Date();
    let time = newDate.getTime();
    return Math.floor(time / 1000);
  }

  dateTmsToStr(tmp) {
    let newDate = new Date(tmp);
    let year = newDate.getFullYear();
    let month = (newDate.getMonth() + 1) < 10 ? ('0' + (newDate.getMonth() + 1)) : (newDate.getMonth() + 1);
    let day = newDate.getDate() < 10 ? ('0' + newDate.getDate()) : newDate.getDate();

    return year + '-' + month + '-' + day;
  }

  makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  makeDigit(length) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  genCodeId() {
    let newDate = new Date();
    let d_str = Math.floor((newDate.getTime()) / 1000) + '';
    d_str = d_str.substr(d_str.length - 7, d_str.length - 1);
    return (d_str + '-' + this.makeid2(2))
  }

  makeid2(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


  makeCode() {
    let date = new Date().getTime();
    let alt = this.makeid(20);
    return sha256(sha256(alt + date.toString()));
  }

  configInput = {
    name: {
      long: 32
    }
  }

  public validatorkey = Validators.compose(
    /*  [Validators.pattern("^[^0-9][a-zA-Z0-9_]+$"), */
    [Validators.pattern("^[a-zA-Z_][a-zA-Z0-9_]+$"),
    Validators.maxLength(this.configInput.name.long),
    Validators.required]);




}
