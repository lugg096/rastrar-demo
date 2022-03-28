import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Funciones } from 'src/app/compartido/funciones';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-create-registro',
  templateUrl: './create-registro.component.html',
  styleUrls: ['./create-registro.component.scss'],
})
export class CreateRegistroComponent implements OnInit {


  registroForm: FormGroup;
  data: any;
  key_table: any;
  isEdit = false;

  constructor(
    private _fun: Funciones,
    private _apiMongo: ApiMongoService,
    private _modal: ModalController,
    public formBuilder: FormBuilder) {

    this.registroForm = formBuilder.group({
      key: ['', this._fun.validatorkey],
      name: ['', Validators.required],
      properties: ['']
    });
  }

  ngOnInit() {
    if (!this._fun.isVarInvalid(this.data)) this.editData();
    /*   this.updateTableCount(); */
    console.log(this.isEdit);

  }

  async editData() {
    this.isEdit = true;
    this.data.properties = JSON.stringify(this.data.data.properties);
    this.registroForm.patchValue(this.data);
  }

  tiggerFields() {
    Object.keys(this.registroForm.controls).forEach(field => {
      let _control = this.registroForm.get(field);
      if (_control instanceof FormControl)
        _control.markAsTouched({ onlySelf: true });
    });
  }

  async validateForm() {
    this.tiggerFields();
    if (this.registroForm.valid) {
      let alert = await this._fun.alertSave(this.isEdit);
      if (this._fun.isVarInvalid(alert)) return;
      this.create();
    }
  }




  async create() {

    try {

      let key = this.registroForm.value.key;
      let validJson = this._fun.validJson(this.registroForm.controls['properties'].value);
      if (validJson == null) return;
      this.registroForm.controls['properties'].setValue(validJson);

      var body: any = {
        name: this.registroForm.value.name,
        properties: this.registroForm.controls['properties'].value
      }

      const res: any = await this._apiMongo.create(env.COLLECTION.general, this.key_table, key, body, this.isEdit);
      console.log('res', res);

      if (this._fun.isVarInvalid(res.result)) {
        await this._fun.alertError(res.message);
        return;
      }
      if (!this.isEdit) this.updateTableCount();

      this.confirm();
      await this._fun.alertSucc(this.isEdit ? env.MSG.SUC_UPDATE : env.MSG.SUC_CREATE);
    } catch (error) {
      await this._fun.alertError(error);
    }

  }

  async updateTableCount() {

    try {
      let resTable: any = await this._apiMongo.getkey(env.COLLECTION.general, env.TABLE_SIS.tables, this.key_table);
        console.log('resTable',resTable);
        
      let table = resTable.result[0].tables[0];
      let count = table.data.properties.count + 1;
      let properties: any = table.data.properties;
      properties.count = count;
      properties.eliminabled = false;

      var body: any = {
        name: table.name,
        properties
      }

      console.log('body',body);
      

      const res: any = await this._apiMongo.create(env.COLLECTION.general, env.TABLE_SIS.tables, this.key_table, body, true);

      if (this._fun.isVarInvalid(res.result)) {
        await this._fun.alertError(res.message);
        return;
      }
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
