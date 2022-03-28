import { Injectable } from '@angular/core';
import { IonicComponentsService } from '../services/ionic-components.service';
import { AlertComponent } from '../components/alert/alert.component';
import { ModalController } from '@ionic/angular';
import { UploadComponent } from '../components/upload/upload.component';
import { PinAccessComponent } from '../components/pin-access/pin-access.component';
import { environment as env } from 'src/environments/environment';
import { CodeAlmacenComponent } from '../components/code-almacen/code-almacen.component';
import { sha256 } from 'js-sha256';

@Injectable({
  providedIn: 'root'
})
export class Funciones {

  constructor(
    private _modal: ModalController,
    public _comp: IonicComponentsService) { }

  async alertSucc(message) {
    return await this.alert(env.MSG.TYPE_SUC, ' Ok ', env.MSG.ALERT_TITLE, message);
  }

  async alert(type, buttonConfim, textTitle, subtitle, bCancel?, desablet?) {

    if (!this.isVarInvalid(desablet)) return true;
    if (!this.isVarInvalid(bCancel)) bCancel = true;
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
          options,
          bCancel
        }
      });

      modal.onDidDismiss().then(async (res: any) => {
        resolve(res.data);
      });
      return await modal.present();
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

  async code(type, buttonConfim, textTitle, subtitle, desablet?) {

    if (!this.isVarInvalid(desablet)) return true;
    let options = {
      path: '/assets/json/' + type + '.json',
      loop: true,
      autoplay: true
    }
    return new Promise(async resolve => {
      const modal = await this._modal.create({
        component: CodeAlmacenComponent,
        cssClass: 'style-alert',
        backdropDismiss: false,
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


  async progress(data) {
    let type = env.MSG.TYPE_UPLOAD;
    let buttonConfim = ' ok ';
    let textTitle = 'Subiendo';
    /*  let subtitle = 'Puede pausar y continuar en otro momento'; */
    let subtitle = 'Por favor espere que termine el proceso';

    if (data.cert.status == env.STATUS_REG.SAVED) {
      type = env.MSG.TYPE_SIGN;
      textTitle = 'Firmando';
      subtitle = 'Se está firmando certificado con su identidad digital';
    }

    let options = {
      path: '/assets/json/' + type + '.json',
      loop: true,
      autoplay: true
    }

    return new Promise(async resolve => {
      const modal = await this._modal.create({
        component: UploadComponent,
        cssClass: 'style-upload',
        backdropDismiss: false,
        componentProps: {
          type,
          textTitle,
          subtitle,
          buttonConfim,
          options,
          data
        }
      });

      modal.onDidDismiss().then(async (res: any) => {
        resolve(res.data);
      });
      return await modal.present();
    });
  }

  async accessPin(type?, dataSlideValid?) {

    if (this.isVarInvalid(dataSlideValid)) {
      dataSlideValid = {
        titulo: "Seguridad",
        subTitulo: "Ingresar ePIN",
        texto: "Ingrese ePIN de 6 dígitos"
      }
    }


    return new Promise(async resolve => {
      const modal = await this._modal.create({
        component: PinAccessComponent,
        componentProps: {
          type,
          dataSlideValid
        }
      });
      modal.onDidDismiss().then(async (res: any) => {
        resolve(res.data);
      });
      return await modal.present();
    });
  }


  async alertGen(bCancel, bconf, tdesc) {
    return await this.alert(env.MSG.TYPE_ALERT, bconf, env.MSG.ALERT_TITLE, tdesc, false, bCancel);
  }

  isVarInvalid(data: any) {
    if (data == undefined || data == null || data == 'undefined' || data == 'null' || data == '' || data == false) return true;
    return false;
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

  isInvalidResApi(code: any) {
    if (code != 200 && code != '200') return true;
    return false;
  }

  dateStrtoTms(date) {
    if (Number.isInteger(date)) return date;
    let newDate = new Date();
    let d_str = newDate.toDateString();
    let timehms = newDate.getTime() - new Date(d_str).getTime();

    var parts: any = date.split('-');
    var mydate = new Date(parts[0], parts[1] - 1, parts[2]);

    return Math.floor((mydate.getTime() /* + timehms */) / 1000);
  }


  makeCode() {
    let date = new Date().getTime();
    let alt = this.makeid(20);
    return sha256(sha256(alt + date.toString()));
  }

  currentDate() {
    let newDate = new Date();
    return Math.floor((newDate.getTime()) / 1000);
  }

  dateTmsToStr(tmp) {
    let newDate = new Date(tmp * 1000);
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

  makeid2(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


  genCodeId() {
    let newDate = new Date();
    let d_str = Math.floor((newDate.getTime()) / 1000) + '';
    d_str = d_str.substr(d_str.length - 5, d_str.length - 1);
    return (d_str + this.makeid2(1))
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


  async alertError(error: any) {
    console.log('error', error);

    let mensj = error;
    if (!this.isVarInvalid(error.message)) mensj = error.message;
    await this.alert(env.MSG.TYPE_ERROR, 'ok', env.MSG.ERROR_TITLE, mensj);
  }

  async alertWarning(textInfo, textBut) {
    return await this.alert(env.MSG.TYPE_ALERT, textBut, env.MSG.ALERT_TITLE, textInfo);
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


  /* PATCH VALUE ertornando todos los valores en string */
  patchValueJsonStr(jsonEstruc, jsonData) {
    console.log('jsonEstruc', jsonEstruc);
    console.log('jsonData', jsonData);
    Object.keys(jsonEstruc).forEach(key => {
      jsonEstruc[key] = this.valueKeyJSONStr(jsonData, key);
    })
    return jsonEstruc;
  }

  patchValueJsonStrArry(jsonEstruc, jsonDataArray) {
    for (let index = 0; index < jsonDataArray.length; index++) {
      let item = jsonDataArray[index];
      let estruc = JSON.parse(JSON.stringify(jsonEstruc));
      Object.keys(estruc).forEach(key => {
        estruc[key] = this.valueKeyJSONStr(item, key);
      })
      jsonDataArray[index] = estruc;
      if (index == (jsonDataArray.length - 1)) return jsonDataArray;
    }
  }

  valueKeyJSONStr(json, keyJson) {
    var value = '';
    Object.keys(json).forEach(key => {
      if (key == keyJson) {
        if (this.isString(json[key])) value = json[key];
        else value = JSON.stringify(json[key]);
      }
    });
    return value;
  }


  parseJsonFields(jsonEstruc) {
    Object.keys(jsonEstruc).forEach(key => {
      jsonEstruc[key] = JSON.parse(jsonEstruc[key]);
      console.log('jsonEstruc[key]', jsonEstruc[key]);
    })
    return jsonEstruc;
  }

  isString(obj) {
    if (typeof obj === 'string' || obj instanceof String) return true;
    else false;
  }

  toJson(string) {
    let data = JSON.parse(string);
    return JSON.parse(JSON.stringify(data));
  }



  configRegDB(regDB) {

    let data = JSON.parse(JSON.stringify(regDB.data));;
    data.key = regDB.key;
    data.name = regDB.name;
    data.status = regDB.status;
    data.table = regDB.table;

    Object.keys(data).forEach(key => {
      if (key == 'group') {
        data['grupo'] = data[key];
      }
    });
    return data;
  }

}
