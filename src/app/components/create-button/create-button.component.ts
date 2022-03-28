import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Funciones } from 'src/app/compartido/funciones';
import { ApiMongoService } from 'src/app/services/apiMongo.service';

import { environment as env } from 'src/environments/environment';
@Component({
  selector: 'app-create-button',
  templateUrl: './create-button.component.html',
  styleUrls: ['./create-button.component.scss'],
})
export class CreateButtonComponent implements OnInit {

  action: any;
  botonForm: FormGroup;
  data: any;
  isEdit = false;

  key_table: any;
  _env = env;
  index:any;
  /* LIST PARAMAS */
  listTypeBut: any;
  listCallAct: any;

  constructor(
    private _apiMongo: ApiMongoService,
    private _fun: Funciones,
    private _modal: ModalController,
    public formBuilder: FormBuilder) {

    this.botonForm = formBuilder.group({
      name: ['', Validators.required],//
      note: [''],//
      color: ['', Validators.required],//
      background: ['', Validators.required],//
      text: ['', Validators.required],//texto de botón
      width: ['', Validators.required],//
      properties: [''],//
      type: ['', Validators.required],// Tipo de llamada
      mode: ['', Validators.required],// Si es icono o texto
      icon: ['', Validators.required],//
    });
  }

  /* CAMPO SELECT SIMPLE*/
  selectChang(event, array, groupForm, table) {
    let key = event.detail.value;
    let value: any = array.filter(r => r.key == key)[0].name;

    this.botonForm.controls[groupForm].setValue({
      collection: "general",
      table,
      key,
      value
    });
    console.log('botonForm', this.botonForm.value);
  }

  ngOnInit() {
    if (!this._fun.isVarInvalid(this.data)) this.editData();
  }

  async editData() {
    this.isEdit = true;
    console.log('this.data',this.data);
    this.data.properties = JSON.stringify(this.data.properties);
    this.botonForm.patchValue(this.data);
  }


  tiggerFields() {
    Object.keys(this.botonForm.controls).forEach(field => {
      let _control = this.botonForm.get(field);
      if (_control instanceof FormControl) _control.markAsTouched({ onlySelf: true });
      if (_control instanceof FormGroup) {
        Object.keys(_control.controls).forEach(field_g => {
          let _control_g = _control.get(field_g);
          if (_control_g instanceof FormControl) _control_g.markAsTouched({ onlySelf: true });
        });
      }
    });
  }

  async validateForm() {
    this.tiggerFields();
    if (this.botonForm.valid) {
      let alert = await this._fun.alertSave(this.isEdit);
      if (this._fun.isVarInvalid(alert)) return;
      this.create();
    }
  }


  async create() {

    try {

      let properties = this._fun.strToJson(this.botonForm.value.properties);
      
      this.botonForm.controls['properties'].setValue(properties);

      if (this._fun.isVarInvalid(properties)) return;


      if(this.isEdit) this.action.data.buttons[this.index]=this.botonForm.value;
      else this.action.data.buttons.push(this.botonForm.value);
      
      console.log( this.action);
      this.action.data.name= this.action.name;
/*       return; */
      const res: any = await this._apiMongo.create(env.COLLECTION.object, env.TABLE_SIS.action, this.action.key, this.action.data, true);
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
