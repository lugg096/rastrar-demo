import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Funciones } from 'src/app/compartido/funciones';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-create-table',
  templateUrl: './create-table.component.html',
  styleUrls: ['./create-table.component.scss'],
})
export class CreateTableComponent implements OnInit {

  tableForm: FormGroup;
  data: any;
  isEdit = false;

  constructor(
    private _fun: Funciones,
    private _apiMongo: ApiMongoService,
    private _modal: ModalController,
    public formBuilder: FormBuilder) {

    this.tableForm = formBuilder.group({
      key: ['', this._fun.validatorkey],
      name: ['', Validators.required],
      properties: [''],
      properties_obj: [{}],
    });
  }

  ngOnInit() {
    if (!this._fun.isVarInvalid(this.data)) this.editData();
  }

  async editData() {
    this.isEdit = true;
    this.data.properties = JSON.stringify(this.data.data.properties);
    this.data.properties_obj = JSON.parse(this.data.properties);
    this.tableForm.patchValue(this.data);
  }

  tiggerFields() {
    Object.keys(this.tableForm.controls).forEach(field => {
      let _control = this.tableForm.get(field);
      if (_control instanceof FormControl)
        _control.markAsTouched({ onlySelf: true });
    });
  }

  async validateForm() {
    this.tiggerFields();
    if (this.tableForm.valid) {
      let alert = await this._fun.alertSave(this.isEdit);
      if (this._fun.isVarInvalid(alert)) return;
      this.create();
    }
  }


  async create() {


    let validJson = this._fun.validJson(this.tableForm.controls['properties'].value);
    if (validJson == null) return;
    this.tableForm.controls['properties'].setValue(validJson);

    console.log('validJson', validJson);
   
    let txt = JSON.stringify(validJson);
    console.log('JSON.parse(txt)', JSON.parse(txt));
    this.tableForm.controls['properties_obj'].setValue(JSON.parse(txt));

    /*    let properties = this.isEdit?this.data.data.properties:{ count: 0,eliminabled: true}; */
    var body: any = {
      name: this.tableForm.value.name,
      /*       properties, */
      properties: this.tableForm.controls['properties'].value == '' ?{count:0} :this.tableForm.controls['properties'].value,
      properties_obj: this.tableForm.controls['properties_obj'].value == ''?{count:0} :this.tableForm.controls['properties_obj'].value,
    };

    try {
      const res: any = await this._apiMongo.create(env.COLLECTION.general, env.TABLE_SIS.tables, this.tableForm.value.key, body, this.isEdit);
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
