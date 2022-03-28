import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalController } from '@ionic/angular';
import { Funciones } from 'src/app/compartido/funciones';
import { ApiService } from 'src/app/services/api.service';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { IonicComponentsService } from 'src/app/services/ionic-components.service';
import { environment as env } from 'src/environments/environment';
import { CreateProducerComponent } from '../create-producer/create-producer.component';

@Component({
  selector: 'app-add-producer',
  templateUrl: './add-producer.component.html',
  styleUrls: ['./add-producer.component.scss'],
})
export class AddProducerComponent implements OnInit {

  producerForm: FormGroup;
  data: any;

  constructor(
    public _comp: IonicComponentsService,
    private _apiMongo: ApiMongoService,
    private _api: ApiService,
    private barcodeScanner: BarcodeScanner,
    private _fun: Funciones,
    public formBuilder: FormBuilder,
    private _modal: ModalController) {
    this.producerForm = formBuilder.group({
      adrx: ['', Validators.required],
      dni: [''],
      q_unid: ['kg'],
      name: [''],
      count: [0, Validators.required]
    });
  }

  ngOnInit() { }


  async scan(field) {
    console.log('field', field);

    this.barcodeScanner.scan({ prompt: "Lee código QR de " + field.caption }).then(async code => {
      if (code) {


        let codeType: any = code.text.split("#")[0].split(":");
        let codeFin = '';

        if (codeType[1] == 'cid') {
          let ipfs_code = codeType[3];
          let ipfs_value: any = await this._api.getIpfs(ipfs_code).toPromise();
          console.log('ipfs_value', ipfs_value);
          /*   this.contract_card = ipfs_value.credentialSubject.contract; */
          console.log('ipfs_value', ipfs_value.credentialSubject.id.split(":")[3]);
          codeFin = ipfs_value.credentialSubject.id.split(":")[3];
        } else if (codeType[1] == 'ethr') {
          codeFin = codeType[3];
        }
        //did:cid:ipfs:<CID>
        //did:ethr:lacchain:
        this.producerForm.controls[field].setValue(codeFin);


        let name = code.text.split("#")[1];
        this.producerForm.controls['name'].setValue(name);

        let DNI = code.text.split("#")[2];
        console.log('DNI', DNI);
        this.producerForm.controls['dni'].setValue(DNI);
      }
    }).catch(err => {
      console.log('Error', err);
    })
  }

  async searchUser(event, rt?) {
    console.log('event', event.detail.value);
    if (rt) return;


    if (this.producerForm.controls['adrx'].value.trim().length != 8 && event.detail.value.trim().length != 42 ){
      this.producerForm.patchValue({
        dni: '',
        name: ''
      });
    }

  

    let value = event.detail.value.trim();
    if (Number.isInteger(Number(value))) {
      if (value.length == 8) {

        this.producerForm.controls['adrx'].setValue('');
        this.producerForm.controls['name'].setValue('');

        let loading: any = await this._comp.presentLoading('Buscando usuario...');
        try {

          const res_user: any = await this._apiMongo.filter(env.COLLECTION.party, env.TABLE_SIS.producer,
            { 'data.idens': { "$all": [{ "number": value, "type": "DNI", "type_name": "DNI" }] } });

          if (this._fun.isEmpty(res_user.result)) {
            loading.dismiss();
            this._fun.alertError('No se encontro ningun productor con el DNI '+value);
            return;
          }

          console.log('respuesta USER', res_user);
          let user = res_user.result[0]['producer'][0];

          this.producerForm.controls['adrx'].setValue(user.data.dids[0].address);
          this.producerForm.controls['name'].setValue(user.name);
          this.producerForm.controls['dni'].setValue(value);
          loading.dismiss();

        } catch (error) {
          loading.dismiss();
        }

      }
    }

  }


  async registerProd(){
    console.log('mostrar');
    
    const modal = await this._modal.create({
      cssClass: 'style-list-select-2',
      backdropDismiss: false,
      component: CreateProducerComponent,
      componentProps: {}
    });
    modal.onDidDismiss().then(async (res: any) => {
      if (this._fun.isVarInvalid(res.data)) return;
      if (this._fun.isVarInvalid(res.data.form)) return;

      this.producerForm.controls['adrx'].setValue(res.data.form.dids[0].address);
      this.producerForm.controls['dni'].setValue(res.data.form.idens[0].number);
      this.producerForm.controls['name'].setValue(res.data.form.name);
    })

    await modal.present();
  }


  closeModal() {
    this._modal.dismiss();
  }

  confirm() {
    this._modal.dismiss({ confirm: true, form: this.producerForm.value });
  }
}
