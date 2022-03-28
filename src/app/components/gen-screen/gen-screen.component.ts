import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { sha256 } from 'js-sha256';
import { Funciones } from 'src/app/compartido/funciones';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment as env } from 'src/environments/environment';
import { ListSelectComponent } from '../list-select/list-select.component';

@Component({
  selector: 'app-gen-screen',
  templateUrl: './gen-screen.component.html',
  styleUrls: ['./gen-screen.component.scss'],
})
export class GenScreenComponent implements OnInit {

  constructor(
    private _auth: AuthService,
    private _modal: ModalController,
    public formBuilder: FormBuilder,
    private _fun: Funciones,
    private _apiMongo: ApiMongoService,
    /* public _comp: IonicComponentsService, */
    public router: Router) {
  }

  task: any; // DATA TAREA
  data: any; // DATA MONITOR
  update_detail = false;

  detail_main: any = null;
  details_monitor: any;

  preview: any;

  ngOnInit() {
    console.log('TASK', this.task);
    console.log('MONITOR', this.data);
    this.initData();

    if (this.detail_main) {
      this.update_detail = true;
      console.log('ACTUALIZACION DE DETAIL TASK', this.detail_main);

    }
  }

  closeModal() {
    this._modal.dismiss({ confirm: false });
  }

  confirm() {
    this._modal.dismiss({ confirm: true });
  }

  public submitAttempt: boolean = false;

  metadata: any = { title: '' };
  user: any;
  fields = [];
  buttons = [];
  photoPreview = [];
  idPhotoRemove = [];
  registroForm: FormGroup;
  id_param = '';
  idCert = '';
  isEdit = false;
  loading: any;
  saved = false;

  async initData() {
    this.registroForm = this.formBuilder.group({});
    /*   this.user = await this.storage.getLocalStorage('DATA'); */
    this.createForm();

    console.log('this.detail_main', this.detail_main);

    /*     if (this.fun.isVarInvalid(this.id_param)) {
          this.isEdit = false;
          this.idCert = sha256(new Date().getTime() + this.metadata.code + this.user.publicKey);
        } else this.editData(); */
  }

  async editData() {
    /* this.isEdit = true;
    this.loading = await this._comp.presentLoading();
    await this.db.getData({ id: this.id_param }, env.TABLE.CERT).then(res => {
      if (!res) this.loading.dismiss();
      console.log('certificado', res);
      this.idCert = res[0].id;
      let dataForm = JSON.parse(res[0].data);
      this.registroForm.patchValue(dataForm);
    });
    await this.db.getData({ id_cert: this.id_param, status: env.STATUS_REG.SAVED }, env.TABLE.IMG).then(res => {
      if (!res) this.loading.dismiss();
      console.log('IMAGES', res);
      this.photoPreview = res;
    });
    this.loading.dismiss(); */
  }

  getParamas() {
  }

  buttApiRest = [];

  async createForm() {

    console.log('this.metadata', this.metadata.fields);
    console.log();

    this.metadata.fields.forEach(field => {

      let validators = [];

      if (field.required) validators.push(Validators.required);
      if (field.long) validators.push(Validators.maxLength(field.long));
      if (field.max && field.inputtype == 'number') validators.push(Validators.max(field.max));
      if (field.min && field.inputtype == 'number') validators.push(Validators.min(field.min));

      if (field.type == 'button') {
        this.buttApiRest.push(field);
        validators = [];
      };

      if (field.type == 'uploadFile') {

        this.registroForm.addControl(field.code, this.formBuilder.group({
          name: ['', validators],
          bytes: [0],
          ext: [''],
          url: [''],
          hash: [''],
          b64: ['']
        }));

        this.registroForm.controls[field.code].patchValue(field.value);

      } else if (field.type == 'searchUser') {
        this.registroForm.addControl(field.code, this.formBuilder.group({
          key: ['', validators],
          name: ['', validators],
          status: [''],
          table: [''],
          _id: [''],
          data: [{}]
        }));

        this.registroForm.controls[field.code].patchValue(field.value);

      } else this.registroForm.addControl(field.code, new FormControl(field.value, validators));
      this.fields.push(field);
    });

    this.metadata.buttons.forEach(field => {
      this.buttons.push(field);
    });
  }


  onFileSelected(field) {
    let valueFile: any = {};

    const inputNode: any = document.querySelector('#' + field);
    valueFile.name = inputNode.files[0].name;
    const file = inputNode.files[0];
    valueFile.bytes = file.size;
    valueFile.ext = file.type.split("/")[1];
    console.log('file', file);
    const reader: any = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      valueFile.b64 = reader.result.split(";base64,")[1];
      console.log('this.contentFile', valueFile.b64);
      valueFile.hash = sha256(valueFile.b64);
      console.log('valueFile', valueFile);

      console.log('this.registroForm.value', this.registroForm.controls[field].value);
      this.registroForm.controls[field].patchValue(valueFile);
      console.log('this.registroForm.value', this.registroForm.controls[field].value);

    };

  }

  async getAPI_REST(field) {
    console.log('API_REST');
    console.log('field', field);
    /*  console.log(this.data['trace_detail']['process']); */
    /*  let body = JSON.parse( field.properties.body); */
    let body = {
      key_partida: this.data['trace_detail']['process']
    };
    field.properties.endPoint = field.properties.endPoint.replace('/', '');
    field.properties.params = field.properties.params.replace('/', '');

    console.log('URL',field.properties.endPoint + '/' + field.properties.params);
    console.log('body',body);
    
    
    let res = await this._apiMongo.postGenerate(field.properties.endPoint + '/' + field.properties.params, body);
    console.log('RESPUESTA TRAZA..1', res);
    /*   await this._fun.alertSucc('Certificados generados correctamente'); */

  }

  async imagesCapture(field) {
    /* const modal = await this._modal.create({
      component: CaptureImagesComponent,
      componentProps: {
        idCert: this.idCert,
        field: field,
        photoPreview: this.photoPreview,
        idPhotoRemove: this.idPhotoRemove
      }
    });

    modal.onDidDismiss().then(async (res: any) => {
      this.photoPreview = res.data.photoPreview;
      this.idPhotoRemove = res.data.idPhotoRemove;
      let textValue = '';
      if (this.photoPreview.length != 0) textValue = this.photoPreview.length + ' fotos';
      this.registroForm.controls[field.code].setValue(textValue);
    });
    return await modal.present(); */
  }

  tiggerFields() {
    Object.keys(this.registroForm.controls).forEach(field => {
      let _control = this.registroForm.get(field);
      if (_control instanceof FormControl) _control.markAsTouched({ onlySelf: true });
      if (_control instanceof FormGroup) {
        Object.keys(_control.controls).forEach(field_g => {
          let _control_g = _control.get(field_g);
          if (_control_g instanceof FormControl) _control_g.markAsTouched({ onlySelf: true });
        });
      }
    });
  }

  async actionButton(type: string) {
    /*     console.log(this.registroForm.value);
        return; */
    console.log('type', type);

    if (type == 'confirm') {
      this.tiggerFields();
      console.log(this.registroForm.value);

      if (this.registroForm.valid) {
        if (this.preview) {
          await this._fun.alertSucc('Prueba satisfactoria, datos fueron correctamente ingresados');
          return;
        }
        console.log('this.update_detail', this.update_detail);

        if (this.update_detail) this.updateDetail();
        else this.iniciar(this.task, this.data);

      }
    } else {
      console.log('SE CANCELARA');
    }
  }



  merma_total = 0;

  dataForm() {

    let data: any = this.registroForm.value;
    let db_f: any = [];
    /* ** */
    let merma_t = 0;

    let objs = Object.keys(data);
    let fields = this.detail_main.data.screen.data.fields;

    for (let index = 0; index < objs.length; index++) {
      let key = objs[index];
      let values = [];
      let f_index = fields.findIndex(f => f.field.key == key);

      if (f_index != -1) {
        values.push(data[key]);
        let f = {
          field: fields[f_index].field,
          visibility_type: fields[f_index].visibility_type,
          values
        }
        db_f.push(f);
        /* console.log('AAAAA',fields[f_index]); */
        if (fields[f_index].field.data.properties.configType == 'merma') {
          merma_t += Number(data[key]);
        }

      }
    }
    console.log('MOSTRAR CAMPOS', db_f);
    console.log('total MERMAS', merma_t);
    return { db_f, merma_t };
  }

  async updateDetail() {

    let alert = await this._fun.alert(env.MSG.TYPE_ALERT, 'Si, actualizar', env.MSG.ALERT_TITLE, `Esta seguro de actualizar información de tarea?`);
    if (this._fun.isVarInvalid(alert)) return;

    console.log('ENTROOOOOO........2');
    let d_struct = this.dataForm();

    /* ACTUALIZAR DETAIL */
    let dataTask = this.detail_main.data;
    dataTask.name = this.detail_main.name;
    dataTask.executed = env.exec.finished;//TERMINADO
    dataTask.tmp_end = this._fun.timeStamp();
    /* *********************** */
    dataTask.merma_t = d_struct.merma_t;
    dataTask.fields = d_struct.db_f;

    /* ELIMINAR MERMAS DE TAREA DE TRACE */

    try {
      console.log('TASK...1', dataTask);
      const res: any = await this._apiMongo.create(env.COLLECTION.traceDetail, this.detail_main.table, this.detail_main.key, dataTask, true);
      console.log('TASK...2', res);
      if (this._fun.isVarInvalid(res.result)) {
        await this._fun.alertError(res.message);
        return;
      }
      this.closeModal();
      await this._fun.alertSucc('Información de tarea se actualizo correctamente');
      /*    this.getList(); */
    } catch (error) {
      await this._fun.alertError(error);
    }
  }

  async finishProcess() {
    let res_trace: any = await this._apiMongo.get(env.COLLECTION.trace, env.TABLE_SIS.report, this.data.trace_detail.process);
    /* ACTUALIZAR DATA TRACE*/
    let trace = res_trace.result[0][env.TABLE_SIS.report][0];
    console.log('TRACE', trace);
    /* return;
         */
    let dataTrace: any = trace.data;
    dataTrace.key = trace.key;
    dataTrace.name = trace.name;
    dataTrace.status = trace.status;
    dataTrace.product_output = env.exec.delivery;

    try {
      console.log('ACTUALIZACIÓN dataTrace', dataTrace);
      const res_trace: any = await this._apiMongo.create(env.COLLECTION.trace, env.TABLE_SIS.report, dataTrace.key, dataTrace, true);
      console.log('ACTUALIZACIÓN res_trace', res_trace);

      if (this._fun.isVarInvalid(res_trace.result)) {
        await this._fun.alertError(res_trace.message);
        return;
      }
      /*       this.closeModal();
            console.log('TERMINOOOO');
      
            await this._fun.alertSucc('EL proceso de la partida culmino correctamente'); */
    } catch (error) {
      await this._fun.alertError(error);
    }


  }

  async uploadFile() {
    return new Promise(async (resolve, reject) => {
      let f = this.metadata.fields.filter(f => f.type == 'uploadFile') || [];
      if (this._fun.isEmpty(f)) resolve(false);
      console.log('FIELD', f);

      console.log('f[0].field.code', f[0].code);
      let fildFile = this.registroForm.controls[f[0].code].value;
      console.log('FIELD', fildFile);
      let res_upload_datafile: any = await this._apiMongo.uploadFile(fildFile.b64, fildFile.ext).toPromise();
      console.log('res_upload_datafile', res_upload_datafile.data.url);
      this.registroForm.controls[f[0].code].patchValue({ url: res_upload_datafile.data.url, b64: '' });
      console.log('ARCHIVO UPLOAD');

      resolve(true);

    });

  }


  async iniciar(task, data) {
    let alert = await this._fun.alert(env.MSG.TYPE_ALERT, 'Si, terminar', env.MSG.ALERT_TITLE, `Esta seguro de terminar tarea ${task.name}?`);
    if (this._fun.isVarInvalid(alert)) return;
    await this.uploadFile();

    const d_detail: any = await this._apiMongo.get(env.COLLECTION.traceDetail, data.trace_detail.process, data.trace_detail.key);
    console.log('d_detail', d_detail);

    this.detail_main = d_detail.result[0][data.trace_detail.process][0];
    console.log('detail_main', this.detail_main);

    const d_monitor: any = await this._apiMongo.get(env.COLLECTION.monitor, env.TABLE_SIS.report, task.key);
    console.log('d_monitor', d_monitor);

    this.details_monitor = d_monitor.result[0][env.TABLE_SIS.report][0];
    console.log('monitor_main', this.details_monitor);

    let d_struct = this.dataForm();

    /* ACTUALIZAR DETAIL */
    let dataTask = this.detail_main.data;
    dataTask.name = this.detail_main.name;
    dataTask.executed = env.exec.finished;//TERMINADO
    dataTask.tmp_end = this._fun.timeStamp();
    /* *********************** */

    dataTask.merma_t = d_struct.merma_t;
    dataTask.fields = d_struct.db_f;

    this.merma_total = d_struct.merma_t;
    /*    this.addMerma();//AGREGAR DATA ME MERMA AL DB */

    dataTask.q_input = this.data.q_input - this.merma_total;

    let save_monitor = await this.setMonitor(dataTask, this.detail_main.key);
    if (!save_monitor) return;

    try {
      console.log('TASK...1', dataTask);
      const res: any = await this._apiMongo.create(env.COLLECTION.traceDetail, data.trace_detail.process, this.detail_main.key, dataTask, true);
      console.log('TASK...2', res);
      if (this._fun.isVarInvalid(res.result)) {
        await this._fun.alertError(res.message);
        return;
      }


      console.log('this.buttApiRest', this.buttApiRest);
      if (dataTask.isLast) this.finishProcess();

      if (!this._fun.isEmpty(this.buttApiRest)) {
        for (let index = 0; index < this.buttApiRest.length; index++) {
          const field = this.buttApiRest[index];
          this.getAPI_REST(field);
          if (index == (this.buttApiRest.length - 1)) {
            console.log('OPCION1');
            this.closeModal();
            await this._fun.alertSucc('Tarea fue culminada correctamente y el certificado de trazabilidad fue generado');
          }
        }
      } else {
        console.log('OPCION2');
        this.closeModal();
        await this._fun.alertSucc('Tarea fue culminada correctamente');
      }


      /*     */
    } catch (error) {
      await this._fun.alertError(error);
    }
  }

  async addMerma() {
    try {
      /*   console.log('data_merma...1', this.mermas);
        const res: any = await this._apiMongo.create(env.COLLECTION.merma, this.data.trace_detail.process, this.task.key, this.mermas, false);
        console.log('save_merma...2', res);
        if (this._fun.isVarInvalid(res.result)) {
          await this._fun.alertError(res.message);
          return;
        } */
    } catch (error) {
      await this._fun.alertError(error);
    }
  }

  /* ELIMIINAR MONITOR DE TASK */
  setMonitor(dataTask, keyDetail): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      console.log('dataTask', dataTask);
      console.log('keyDetail', keyDetail);
      try {
        let trace_details = this.details_monitor.data.trace_details;
        console.log('trace_details......1', trace_details);
        let index = trace_details.findIndex(t => t.trace_detail.key == this.detail_main.key);
        console.log('index', index);
        if (index == -1) return; //MARCAR ERROR

        /* Eliminar minitoreo en tarea terminada */

        trace_details.splice(index, 1);
        console.log('trace_details .....2', trace_details);
        //Data monitor task update
        let data_save = {
          name: this.details_monitor.name,
          trace_details: trace_details //Valor actualizado
        }

        if (!dataTask.isLast) {
          let res_nextTask = await this.nextTask();
          if (this._fun.isVarInvalid(res_nextTask)) resolve(false);
        }

        console.log('data_save', data_save);
        const res_monitor: any = await this._apiMongo.create(env.COLLECTION.monitor, env.TABLE_SIS.report, this.details_monitor.key, data_save, true);
        console.log('res_monitor', res_monitor);
        if (this._fun.isVarInvalid(res_monitor.result)) {
          await this._fun.alertError(res_monitor.message);
          resolve(false);
        }
        resolve(true);
      } catch (error) {
        await this._fun.alertError(error);
        resolve(false);
      }
    });
  }

  userInit: any; //Usuario

  getUser() {
    this._auth.getUser().subscribe(res => {
      if (this._fun.isVarInvalid(res)) return;
      let resumData = {
        dids: res.data.dids
      }
      res.data = resumData;
      this.userInit = res;
      console.log('Usuario local', this.userInit);
    })
  }

  /* ACTIVAR TAREA SIGUIENTE */
  async nextTask(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {

      try {
        const res_detail: any = await this._apiMongo.filter(env.COLLECTION.traceDetail, this.data.trace_detail.process, { 'data.preTask_dt': this.detail_main.key });
        console.log('res', res_detail);
        if (this._fun.isEmpty(res_detail.result)) {
          //this.load = false; 
          resolve(false);
          return;
        }

        /*       let q_update = this.data.q_input;
              for (let index = 0; index < this.mermas.length; index++) {
                const m = this.mermas[index];
                q_update -= m.value;
              } */

        console.log('res_detail', res_detail);

        let detail_main_next = res_detail.result[0][this.data.trace_detail.process][0];//ASUMIENDO QUE SOLO HABRA UN OPCION SIGUIENTE DE TAREA
        console.log('detail_main_next', detail_main_next);

        /* DATOS DE DETAIL DE NUEVA TAREA */
        let dataTask = detail_main_next.data;
        dataTask.name = detail_main_next.name;
        dataTask.executed = env.exec.pending;//ACTUALIZAR ESTADO

        dataTask.q_input = this.data.q_input - this.merma_total;
        dataTask.unid_input = this.data.unid_input;/* 
      dataTask.tmp_start = this._fun.timeStamp() */;

        /* console.log('TASK_NEXT...1', dataTask);
        return; */
        const res: any = await this._apiMongo.create(env.COLLECTION.traceDetail, this.data.trace_detail.process, detail_main_next.key, dataTask, true);
        console.log('TASK_NEXT...2', res);
        if (this._fun.isVarInvalid(res.result)) {
          await this._fun.alertError(res.message);
          resolve(false);
          return;
        }

        /* CREAR MONITOR EN SIGUIENTE TAREA */

        let res_m: any = await this._apiMongo.get(env.COLLECTION.monitor, env.TABLE_SIS.report, dataTask.task_key);
        console.log('PRUEBA01...1', res_m);

        let task = res_m.result[0][env.TABLE_SIS.report][0];
        console.log('RESPUESTA DE RES_M', task);

        let trace_detail: any = {
          trace_detail: {
            process: detail_main_next.table,
            key: detail_main_next.key,
            name: detail_main_next.name,
            certificateType: dataTask.certificateType,
            isLast: dataTask.isLast,
            isFirst: dataTask.isFirst,
            visibility_type: dataTask.visibility_type,
            screen: dataTask.screen
          },
          /* ESTO NO ES DINAMICO */ /* CAMBIARRRRRR!!! */
          /* A LOS CAMPOS QUE SON DE TIPO MERMA SE LES PONDRA UN PROPIEDAD PARA SABER QUE ES DE ESE TIPO */
          q_input: this.data.q_input - this.merma_total /* RESTAR TODAS LAS MERMAS */,//matener la misma unidad de medida
          unid_input: this.data.unid_input,
          sku: this.data.sku,
          executed: env.exec.pending,
          issuer: this.userInit,//Usuario Local
          timestamp: this._fun.timeStamp(),
        }
        console.log('trace_detail........1', trace_detail);

        let array = task.data.trace_details;
        console.log('array........1', array);
        array.push(trace_detail);
        /* array = [];     */   //<---------------
        let dataSaved = {
          name: task.name,
          trace_details: array
        }

        console.log('dataSaved', dataSaved);
        const res_monitor: any = await this._apiMongo.create(env.COLLECTION.monitor, env.TABLE_SIS.report, task.key, dataSaved, true);
        console.log('res_monitor', res_monitor);
        if (this._fun.isVarInvalid(res_monitor.result)) {
          await this._fun.alertError(res_monitor.message);
          resolve(false);
          return;
        }
        resolve(true);

      } catch (error) {
        /*    this.load = false; */
        resolve(false);
        await this._fun.alertError(error);
      }

    });
  }

  async grabarCert() {
  }

  async goGestion() {
    this.router.navigate(['/gestion']);
  }

  async scan(field) {
    /*  this.barcodeScanner.scan({ prompt: "Lee código QR de " + field.caption }).then(async code => {
       if (code) this.registroForm.controls[field.code].setValue(code.text);
     }).catch(err => {
       console.log('Error', err);
     }) */
  }




  listSelect = {
    type_text: 'tablas',
    key_table: env.TABLE_SIS.tables
  }

  async listTables(type_text, key_table, field) {

    console.log('registroForm', this.registroForm.value);
    console.log('field', field);



    const modal = await this._modal.create({
      cssClass: 'style-list-select',
      component: ListSelectComponent,
      componentProps: {
        type_text,
        key_table,
        item: this.registroForm.controls[field].value,
        collection: env.COLLECTION.party
      }
    });
    modal.onDidDismiss().then(async (res: any) => {
      console.log('RESPUESTA MODAL', res);

      if (this._fun.isVarInvalid(res.data)) return;
      if (!this._fun.isVarInvalid(res.data.confirm)) {

        this.registroForm.controls[field].patchValue(res.data.confirm);
        /*         this.dataBD.document.subject = res.data.confirm; */
        console.log('this.registroForm.value', this.registroForm.value);

      }
    });
    await modal.present();

  }


}
