import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Funciones } from 'src/app/compartido/funciones';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { ListSelectComponent } from '../list-select/list-select.component';

import { environment as env } from 'src/environments/environment';
import { sha256 } from 'js-sha256';
import { ContractsService } from 'src/app/services/contracts.service';


@Component({
  selector: 'app-add-field',
  templateUrl: './add-field.component.html',
  styleUrls: ['./add-field.component.scss'],
})
export class AddFieldComponent implements OnInit {

  @ViewChild('bar', { read: ElementRef }) bar: ElementRef;

  fieldForm: FormGroup;
  data: any;
  index: any;
  isEdit = false;

  vwSelectTable = false;
  vwInputCert = false;
  _env = env;


  /* VAR SELECCT MULTIPLE */
  processSelect = [];

  /* LIST PARAMAS */
  listVisType: any;
  listFieldType: any;
  listInputType: any;
  listFieldCert: any;

  isSystem = false;

  constructor(
    private renderer: Renderer2,
    private _fun: Funciones,
    private _apiMongo: ApiMongoService,
    private _modal: ModalController,
    public formBuilder: FormBuilder) {

    this.fieldForm = formBuilder.group({

      key: [this._fun.genCodeId()],
      name: ['', Validators.required],
      value: [''],
      placeholder: [''],
      type: this.formBuilder.group({
        collection: [''],
        table: [''],
        key: ['', Validators.required],
        value: [''],
        properties: [{}]
      }),
      inputtype: this.formBuilder.group({
        collection: [''],
        table: [''],
        key: ['', Validators.required],
        value: [''],
        properties: [{}]
      }),
      width: this.formBuilder.group({
        boost: ['col-6'],
        porc: 50,
      }),

      visibility_type: ['', Validators.required],
      required: [false, Validators.required]/* ,
      properties: [''] */

    });
  }

  /* CAMPO SELECT SIMPLE*/
  selectChang(event, array, groupForm, table) {
    let key = event.detail.value;
    let val: any = array.filter(r => r.key == key)[0];
    if (groupForm == 'type') this.viewSelectTable(val);


    this.fieldForm.controls[groupForm].patchValue({
      collection: "general",
      table,
      key,
      value: val.name/* ,
      properties: val.data.properties */
    });
    console.log('fieldForm', this.fieldForm.value);
  }

  listSelect = {
    type_text: 'tablas',
    key_table: env.TABLE_SIS.tables
  }

  widthField(prog) {
    this.renderer.setStyle(this.bar.nativeElement, 'width', `${prog}%`);
    this.fieldForm.controls['width'].patchValue({ porc: prog, boost: this.porcToSizeBoost(prog) });
  }

  porcToSizeBoost(porc) {
    switch (porc) {
      case 25: return 'col-3'; break;
      case 50: return 'col-6'; break;
      case 75: return 'col-9'; break;
      case 100: return 'col-12'; break;
    }
  }

  ngAfterViewInit() {
   
    if (this.isEdit) this.widthField( this.data.field.data.width.porc)
  }

  viewSelectTable(value) {
    console.log('value', value);

    if (value == 'select' || value == 'searchUser' || value == 'checkbox') {
      this.vwSelectTable = true;
      this.fieldForm.addControl('tableSelect', this.formBuilder.group({
        collection: [''],
        table: [''],
        key: [''],
        value: ['', Validators.required],
      }));

      if (value == 'searchUser') {
        this.listSelect = {
          type_text: 'usuarios',
          key_table: env.TABLE_SIS.type_user
        }
      } else {
        this.listSelect = {
          type_text: 'tablas',
          key_table: env.TABLE_SIS.tables
        }
      }

    } else {
      this.vwSelectTable = false;
      this.fieldForm.removeControl('tableSelect');
    }
  }


  async listTables() {
    const modal = await this._modal.create({
      cssClass: 'style-list-select',
      component: ListSelectComponent,
      componentProps: {
        type_text: this.listSelect.type_text,
        key_table: this.listSelect.key_table,
        item: this.fieldForm.controls['tableSelect'].value,
        collection: env.COLLECTION.general
      }
    });
    modal.onDidDismiss().then(async (res: any) => {
      console.log('RESPUESTA MODAL', res);

      if (this._fun.isVarInvalid(res.data)) return;
      if (!this._fun.isVarInvalid(res.data.confirm)) {

        let data = {
          collection: env.COLLECTION.general,
          table: res.data.confirm.table,
          key: res.data.confirm.key,
          value: res.data.confirm.name
        }

        this.fieldForm.controls['tableSelect'].setValue(data);
        /*         this.dataBD.document.subject = res.data.confirm; */
        console.log('this.fieldForm.value', this.fieldForm.value);

      }
    });
    await modal.present();

  }

  ngOnInit() {
    if (!this._fun.isVarInvalid(this.data)) this.editData();
  }

  async editData() {
    console.log('this.data', this.data);
    console.log('datos',this.data.field.data);
    

    this.isEdit = true;
    //console.log('this.data', this.data);
    if (this.data.system){
      this.isSystem = true;
      console.log('CAmpos de sistema');
      
    } 
    //console.log('this.isSystem',this.isSystem);
/*     this.data.properties = JSON.stringify(this.data.properties); */

    this.data.field.data.name = this.data.field.name;
    this.data.field.data.key = this.data.field.key;
    this.data.field.data.required = this.data.required;
    this.data.field.data.visibility_type = this.data.visibility_type;

    this.fieldForm.patchValue(this.data.field.data);


  }

  tiggerFields() {
    Object.keys(this.fieldForm.controls).forEach(field => {
      let _control = this.fieldForm.get(field);
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
    console.log(this.fieldForm.value);
    
    if (this.fieldForm.valid) {
      this.create();
    }
  }


  async create() {
    try {
/*       let validJson = this._fun.validJson(this.fieldForm.controls['properties'].value);
      if (validJson == null) return; */

      let fied_data = {
        field: {
          data: this.fieldForm.value,
          key: this.fieldForm.controls['key'].value,
          name: this.fieldForm.controls['name'].value
        },
       /*  properties: validJson, */
        required: this.fieldForm.controls['required'].value,
        system: false,
        visibility_type: this.fieldForm.controls['visibility_type'].value
      }

      console.log('fied_data',fied_data);
      
      await this.confirm(fied_data);

    } catch (error) {
      await this._fun.alertError(error);
    }

  }


  async closeModal() {
    await this._modal.dismiss({ confirm: false });
  }

  async confirm(data) {
    await this._modal.dismiss({ confirm: data });
  }


  async listField() {
    const modal = await this._modal.create({
      cssClass: 'style-list-select',
      component: ListSelectComponent,
      componentProps: {
        type_text: 'campos',
        key_table: env.TABLE_SIS.field,
        item: this.fieldForm.controls['field'].value,
        collection: env.COLLECTION.object
      }
    });
    modal.onDidDismiss().then(async (res: any) => {
      if (this._fun.isVarInvalid(res.data)) return;
      if (!this._fun.isVarInvalid(res.data.confirm)) {
        this.fieldForm.controls['field'].setValue(res.data.confirm);
        /*  this.fieldForm.controls['tableSelect'].setValue(data); */
        /*  this.dataBD.document.subject = res.data.confirm; */
        /*  console.log('this.fieldForm.value', this.fieldForm.value); */
      }
    });
    await modal.present();

  }

}
