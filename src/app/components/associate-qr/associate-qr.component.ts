import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { sha256 } from 'Recursos/node_modules/js-sha256';
import { Funciones } from 'src/app/compartido/funciones';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { IonicComponentsService } from 'src/app/services/ionic-components.service';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-associate-qr',
  templateUrl: './associate-qr.component.html',
  styleUrls: ['./associate-qr.component.scss'],
})
export class AssociateQrComponent implements OnInit {

  associateForm: FormGroup;

  constructor(
    public _comp: IonicComponentsService,
    private _apiMongo: ApiMongoService,
    private _fun: Funciones,
    private _modal: ModalController,
    public formBuilder: FormBuilder) {
    this.associateForm = formBuilder.group({
      key: ['', Validators.required],
      correlative1: [1, Validators.required],
      correlative2: [null, Validators.required],
    });
  }

  dataAssociateQR: any;

  ngOnInit() {
    console.log('dataAssociateQR', this.dataAssociateQR);
    if (this.dataAssociateQR) {
      this.associateForm.patchValue(this.dataAssociateQR);
    }

  }

  listQR = [];
  count = 0;
  valid_btn = false;

  clear() {
    this.associateForm.controls['correlative1'].setValue(1);
    this.associateForm.controls['correlative2'].setValue(null);
    this.associateForm.controls['key'].setValue('');
    this.valid_btn = false;
    this.listQR = [];
  }

  async associate() {
    console.log('this.associateForm.value', this.associateForm.value);

    let data_DB = {
      key: this.associateForm.controls['key'].value,
      correlative1: this.associateForm.controls['correlative1'].value,
      correlative2: this.associateForm.controls['correlative2'].value,
      trxid: '',
      view: 0
    };

    this.confirm(data_DB);

    /*    try {
         const res: any = await this._apiMongo.create(env.COLLECTION.associateQr, this.associateForm.controls['key'].value, this.rolForm.value.key, body, false);
         if (this._fun.isVarInvalid(res.result)) {
           await this._fun.alertError(res.message);
           return;
         }
         this.confirm();
       } catch (error) {
         await this._fun.alertError(error);
       } */
  }


  async valid() {
    if (this.valid_btn) {
      this.associate();
      return;
    }

    //VALIDAR
    let loading :any = await this._comp.presentLoading();

    let corr_1 = this.associateForm.controls['correlative1'].value;
    let corr_2 = this.associateForm.controls['correlative2'].value;
    let numSerie = this.associateForm.controls['key'].value;
    this.listQR = [];


    if (this.associateForm.controls['correlative1'].value >= this.associateForm.controls['correlative2'].value) {
      console.log('ERROR correlative2');
      loading.dismiss();
      await this._fun.alertError('El valor del correlativo final debe ser mayor al inicial');
      return;
    }


    try {
      let filter: any;
      if (this.dataAssociateQR) {
        filter = {
          "$and": [
            {
              "$or": [
                {
                  "$and": [
                    { "data.correlative1": { "$lte": corr_1 } },
                    { "data.correlative2": { "$gte": corr_1 } }
                  ]
                },
                {
                  "$and": [
                    { "data.correlative1": { "$lte": corr_2 } },
                    { "data.correlative2": { "$gte": corr_2 } }
                  ]
                }
              ]
            },
            { key: { "$ne": this.dataAssociateQR.trxid } }
          ]


        };
      } else {
        filter = {
          "$or": [
            {
              "$and": [
                { "data.correlative1": { "$lte": corr_1 } },
                { "data.correlative2": { "$gte": corr_1 } }
              ]
            },
            {
              "$and": [
                { "data.correlative1": { "$lte": corr_2 } },
                { "data.correlative2": { "$gte": corr_2 } }
              ]
            }
          ]
        };
      }


      const res: any = await this._apiMongo.filter(env.COLLECTION.associateQr, this.associateForm.controls['key'].value, filter);
      console.log('res.result', res.result);
      if (!this._fun.isEmpty(res.result)) {
        loading.dismiss();
        await this._fun.alertError('En este Lote se estan usando algunos de los números correlativos en el rango ingresado');
        return;
      }

      this.valid_btn = true;
      loading.dismiss();
    } catch (error) {
      await this._fun.alertError(error);
    }





    let count = corr_2 - corr_1 + 1;
    this.count = count;

    let secret = sha256('RASTRAR');

    if (count <= 0) console.log('ERROR');

/*     if (count > 3) {
      for (let index = corr_1; index < corr_1 + 2; index++) {
        let code = 'https://rastrar.com/?id=' + sha256(numSerie + secret) + '&s=' + numSerie + '&i=' + index;
        this.listQR.push(code);
        if (index == (corr_1 + 1)) {
          this.listQR.push(false);
          let code2 = 'https://rastrar.com/?id=' + sha256(numSerie + secret) + '&s=' + numSerie + '&i=' + corr_2;
          this.listQR.push(code2);
        }
      }
    } else {
      for (let index = corr_1; index <= corr_2; index++) {
        let code = 'https://rastrar.com/?id=' + sha256(numSerie + secret) + '&s=' + numSerie + '&i=' + index;
        this.listQR.push(code);
      }
    } */

    if (count > 3) {
      for (let index = corr_1; index < corr_1 + 2; index++) {
        let code = 'http://rastrar.com/appComprador/#/code?id=' + sha256(numSerie + secret)+ '&i=' + index;
        this.listQR.push(code);
        if (index == (corr_1 + 1)) {
          this.listQR.push(false);
          let code2 = 'http://rastrar.com/appComprador/#/code?id=' + sha256(numSerie + secret) + '&i=' + corr_2;
          this.listQR.push(code2);
        }
      }
    } else {
      for (let index = corr_1; index <= corr_2; index++) {
        let code = 'http://rastrar.com/appComprador/#/code?id=' + sha256(numSerie + secret)  + '&i=' + index;
        this.listQR.push(code);
      }
    }
  }

  closeModal() {
    this._modal.dismiss({ confirm: false });
  }

  confirm(form) {
    this._modal.dismiss({ confirm: true, form });
  }

}
