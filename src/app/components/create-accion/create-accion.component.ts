import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Funciones } from 'src/app/compartido/funciones';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-create-accion',
  templateUrl: './create-accion.component.html',
  styleUrls: ['./create-accion.component.scss'],
})
export class CreateAccionComponent implements OnInit {

  acctionForm: FormGroup;
  data: any;
  isEdit = false;

  constructor(
    private _fun: Funciones,
    private _apiMongo: ApiMongoService,
    private _modal: ModalController,
    public formBuilder: FormBuilder) {

    this.acctionForm = formBuilder.group({
      key: ['', this._fun.validatorkey],
      name: ['', Validators.required],
      buttons: [[]]
    });
  }

  ngOnInit() {
    if (!this._fun.isVarInvalid(this.data)) this.editData();
  }

  async editData() {
    this.isEdit = true;
    this.acctionForm.patchValue(this.data);
    this.acctionForm.controls['buttons'].setValue(this.data.data.buttons);    
    console.log('VER BOTONES',this.acctionForm.value);
    
  }

  tiggerFields() {
    Object.keys(this.acctionForm.controls).forEach(field => {
      let _control = this.acctionForm.get(field);
      if (_control instanceof FormControl)
        _control.markAsTouched({ onlySelf: true });
    });
  }

  async validateForm() {
    this.tiggerFields();
    if (this.acctionForm.valid) {
      let alert = await this._fun.alertSave(this.isEdit);
      if (this._fun.isVarInvalid(alert)) return;
      this.create();
    }
  }

  async create() {

    let properties = this.isEdit ? this.data.data.properties : { count: 0, eliminabled: true };
    var body: any = {
      name: this.acctionForm.value.name,
      properties,
      buttons: this.acctionForm.value.buttons
    };

    try {
      const res: any = await this._apiMongo.create(env.COLLECTION.object, env.TABLE_SIS.action, this.acctionForm.value.key, body, this.isEdit);
      console.log('RESPUESTA', res);

      if (this._fun.isVarInvalid(res.result)) {
        await this._fun.alertError(res.message);
        return;
      }
      this.confirm();
      await this._fun.alertSucc(this.isEdit ? env.MSG.SUC_UPDATE : env.MSG.SUC_CREATE);
    } catch (error) {
      await this._fun.alertError(error);
    }

  }

  closeModal() {
    this._modal.dismiss({ confirm: false });
  }

  confirm() {
    this._modal.dismiss({ confirm: true });
  }
}
