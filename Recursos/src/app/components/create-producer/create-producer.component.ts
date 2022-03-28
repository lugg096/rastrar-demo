import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController } from '@ionic/angular';
import { Funciones } from 'src/app/compartido/funciones';
import { ApiService } from 'src/app/services/api.service';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { ContractsService } from 'src/app/services/contracts.service';
import { IonicComponentsService } from 'src/app/services/ionic-components.service';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-create-producer',
  templateUrl: './create-producer.component.html',
  styleUrls: ['./create-producer.component.scss'],
})
export class CreateProducerComponent implements OnInit {

  producerForm: FormGroup;
  data: any;

  constructor(
    private _contractsService: ContractsService,
    public _comp: IonicComponentsService,
    private _apiMongo: ApiMongoService,
    private _api: ApiService,
    private barcodeScanner: BarcodeScanner,
    private _fun: Funciones,
    public formBuilder: FormBuilder,
    private _modal: ModalController) {
    this.producerForm = formBuilder.group({
      name: ['', Validators.required],
      dni: ['', Validators.required]
    });
  }

  ngOnInit() { }

  tiggerFields() {
    Object.keys(this.producerForm.controls).forEach(field => {
      let _control = this.producerForm.get(field);
      if (_control instanceof FormControl) _control.markAsTouched({ onlySelf: true });
      if (_control instanceof FormGroup) {
        Object.keys(_control.controls).forEach(field_g => {
          let _control_g = _control.get(field_g);
          if (_control_g instanceof FormControl) _control_g.markAsTouched({ onlySelf: true });
        });
      }
    });
  }


  validForm() {
    this.tiggerFields();
console.log('this.producerForm.',this.producerForm.value);
console.log('this.producerForm.valid',this.producerForm.valid);

    if (this.producerForm.valid) this.create();
  }

  async create() {
    let loading: any = await this._comp.presentLoading();
    try {
      console.log('JSON', { 'data.idens': { "$all": [{ "number": this.producerForm.controls['dni'].value, "type": 'DNI', "type_name": 'DNI' }] } });

      const res: any = await this._apiMongo.filter(env.COLLECTION.party, env.TABLE_SIS.producer,
        {
          'data.idens': {
            "$all": [{
              "number": this.producerForm.controls['dni'].value.trim(),
              "type": 'DNI',
              "type_name": 'DNI'
            }]
          }
        });

      console.log('respuesta USER', res);
      if (!this._fun.isEmpty(res.result)) {
        loading.dismiss();
        await this._fun.alertError('Documento ingresado esta siendo usado por el usuario ' + this.producerForm.controls['dni'].value);
        return;
      }

      //GENERAR LLAVES
      let cred: any = await this._contractsService.getAccount();
      console.log('CRED...1', cred);

      let key = this._fun.makeCode();
      let data_user = {
        dids: [{
          txType: 1,
          hashTransaction: '',
          address: cred.address
        }],
        idens: [{
          number: this.producerForm.controls['dni'].value,
          type: 'DNI',
          type_name: 'DNI'
        }],
        name: this.producerForm.controls['name'].value,
        group: {
          "collection": "",
          "table": "",
          "key": "",
          "value": ""
        },
        type: {
          collection: "general",
          key: "PRODUCTOR",
          table: "g_prod",
          value: "Productor"
        }
      };

      let saved_us: any = await this._apiMongo.create(env.COLLECTION.party, env.TABLE_SIS.producer, key, data_user, false);

      if (this._fun.isVarInvalid(saved_us.result)) {
        loading.dismiss();
        await this._fun.alertError(saved_us.message);
        return;
      }
      loading.dismiss();
      console.log('data_user',data_user);
      this.confirm(data_user);


    } catch (error) {
      loading.dismiss();
      await this._fun.alertError(error);
      return;
    }
  }


  closeModal() {
    this._modal.dismiss();
  }

  confirm(data) {
    this._modal.dismiss({ confirm: true, form: data });
  }

}
