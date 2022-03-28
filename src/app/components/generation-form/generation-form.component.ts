import { Component, ElementRef, Input, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides, ModalController } from '@ionic/angular';
import { sha256 } from 'js-sha256';
import { Funciones } from 'src/app/compartido/funciones';
import { AddProducerComponent } from 'src/app/components/add-producer/add-producer.component';
/* import { DemoInicioComponent } from 'src/app/components/comp-demo/demo-inicio/demo-inicio.component'; */
import { GenerarCodeQRComponent } from 'src/app/components/generar-code-qr/generar-code-qr.component';
import { SelectImagenComponent } from 'src/app/components/select-imagen/select-imagen.component';
import { ApiService } from 'src/app/services/api.service';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data-service.service';
import { IonicComponentsService } from 'src/app/services/ionic-components.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment as env } from 'src/environments/environment';
import { AssociateQrComponent } from '../associate-qr/associate-qr.component';
import { CaptureImagesComponent } from '../capture-images/capture-images.component';
import { DemoInicioComponent } from '../comp-demo/demo-inicio/demo-inicio.component';

@Component({
  selector: 'app-generation-form',
  templateUrl: './generation-form.component.html',
  styleUrls: ['./generation-form.component.scss'],
})
export class GenerationFormComponent implements OnInit {

  @ViewChild('bar', { read: ElementRef }) bar: ElementRef;
  @ViewChild('slidesDatos', { static: false }) private slidesDatos: IonSlides;
  contactForm: FormGroup;

  constructor(
    private _auth: AuthService,
    public _comp: IonicComponentsService,
    private _apiMongo: ApiMongoService,
    private _fun: Funciones,
    public router: Router,
    public _modal: ModalController,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _storage: StorageService,
    private _data: DataService,
    private api: ApiService,
    private renderer: Renderer2) { }

  _env = env;
  numSlides = 6;
  activeSlide = 1;
  titleSlide = 'Información comercial';
  registroForm: FormGroup;
  id_param = '';
  user: any;
  metadata: any;
  idCert = '';

  initForm = false;
  isEdit = false;

  screenData: any;
  screenSectionsConfig: any;

  ngOnInit() {
    this.registroForm = this.formBuilder.group({});

    if (this.screenData.updateData) {
      console.log('ES EDICION', this.screenData.updateData);
      this.isEdit = true;
      this.listProducers = this.screenData.updateData.producers;
      this.imgPortada = this.screenData.updateData.portada;
    }
    this.initData();
    this.moduleContact();
  }

  moduleContact() {
    this.contactForm = this.formBuilder.group({
      businessName: '',
      celular: '',
      address: '',
      tel: '',

      web: '',
      facebook: '',
      instagram: '',
      email: '',
      linkedin: '',
      youtube: '',
      tiktok: ''
    });
  }

  ngAfterViewInit() {
    let a = 100 / this.numSlides;
    this.renderer.setStyle(this.bar.nativeElement, 'width', `${a}%`);
  }

  scan(data) {

  }

  selectChang(event, array, groupForm, index) {
    let key = event.detail.value;
    let val: any = array.filter(r => r.key == key)[0];
    this.sections[index].form.controls[groupForm].patchValue({
      key,
      value: val.name
    });
  }

  selectMulti(data, f, a) {

  }

  async imagesCapture(field, index) {

    const modal = await this._modal.create({
      cssClass: 'style-galery',
      backdropDismiss: false,
      component: CaptureImagesComponent,
      componentProps: {
        field: field,
        value: this.sections[index].form.controls[field.code].value,
        description: this.sections[index].form.controls[field.code].description
      }
    });

    modal.onDidDismiss().then(async (res: any) => {
      console.log('res', res);
      this.sections[index].form.controls[field.code].setValue(res.data.value)
    });
    return await modal.present();
  }

  sections = [];
  listProducers = [];
  dataSreen: any = {
    imagenUrl: ''
  };

  listCerts = [];

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 2,
    speed: 700,
    autoplay: {
      delay: 4000,
    },
  };

  initEnd = false;
  indexSlide = 0;

  verSlide() {
    this.slidesDatos.getActiveIndex().then(res => {
      if (!this.initEnd) this.indexSlide = res;
      this.initEnd = false;
    });
  }

  endSlide() {
    this.initEnd = true;
    this.indexSlide = 2;
  }

  joinCerts() {
    this.listCerts = [];

    for (let index = 0; index < this.listProducers.length; index++) {
      let prod = this.listProducers[index];
      if (prod.certs.length != 0) {
        for (let x = 0; x < prod.certs.length; x++) {
          let cert = prod.certs[x];
          this.listCerts.push(cert);
          console.log('CERTS', this.listCerts);
        }
      }
    }
  }

  async initData() {
    this._auth.getUser().subscribe(user => this.user = user);
    console.log(' this.user', this.user);

    let screenData = this.screenData;
    console.log('screenData', screenData);


    let screen = screenData.sectionConfig;
    console.log(' screenData.sectionConfig', screenData.sectionConfig);

    this.screenSectionsConfig = this._fun.noRefObj(screenData.sectionConfig);
    console.log(' this.screenSectionsConfig', this.screenSectionsConfig);

    this.dataSreen = screenData.dataSreen;
    console.log('this.dataSreen', this.dataSreen);


    this.numSlides = screen.length + 1;
    for (let index = 0; index < screen.length; index++) {
      let sec: any = screen[index];
      let form = await this.createForm(sec.fields);
      sec.form = form;
      console.log('SEC PUSH', sec);



      if (this.isEdit && form) {
        let jsonValueForm = this.arrayToJson(this.screenData.updateData.sections[index].fields);
        console.log('jsonValueForm', jsonValueForm);
        sec.form.patchValue(jsonValueForm)
      }

      this.sections.push(sec);

      if (index == (screen.length - 1)) {
        console.log('this.sections', this.sections);
      }
    }


  }

  arrayToJson(array) {
    let jsonData: any = {};
    for (let index = 0; index < array.length; index++) {
      const elm = array[index];
      console.log('elm', elm);

      if (elm.code == 'f_emision' || elm.code == 'f_vencimineto') {
        jsonData[elm.code] = this._fun.dateTmsToStr(elm.value * 1000);
        console.log('jsonData', jsonData);

      }
      else jsonData[elm.code] = elm.value;
      if (index == (array.length - 1)) return jsonData;
    }


  }

  customPopoverOptions: any = {
    header: 'Hair Color',
    subHeader: 'Select your hair color',
    message: 'Only select your dominant hair color'
  };


  async createForm(fields) {
    let regForm: FormGroup = this.formBuilder.group({});
    for (let index = 0; index < fields.length; index++) {
      let field = fields[index];

      let validators = [];
      if (field.required) validators.push(Validators.required);
      if (field.long) validators.push(Validators.maxLength(field.long));
      if (field.max && field.inputtype == 'number') validators.push(Validators.max(field.max));
      if (field.min && field.inputtype == 'number') validators.push(Validators.min(field.min));

      let valueDefauld = field.value;
      if (field.propertiesConfig) {
        if (field.propertiesConfig) {
          valueDefauld = this.functionField(field.propertiesConfig);
          console.log('valueDefauld', valueDefauld);
        }
      }

      if (field.type == 'listByApi') {
        if (this._fun.isVarInvalid(valueDefauld)) valueDefauld = [];
        regForm.addControl(field.code, new FormControl(valueDefauld, validators));
      }
      else if (field.type == 'checkbox' || field.type == 'select') {
        regForm.addControl(field.code, this.formBuilder.group({
          key: ['', validators],
          value: ['']
        }));
      }
      else if (field.type == 'imageselect') {
        regForm.addControl(field.code, this.formBuilder.group({
          value: ['', validators],
          description: [''],
          files: [[]]
        }));
      }
      else regForm.addControl(field.code, new FormControl(valueDefauld, validators));

      console.log(regForm.value);
      if (index == (fields.length - 1)) return regForm;

    }

  }

  dataAssociateQR: any = null;

  async associateQR() {

    const modal = await this._modal.create({
      cssClass: 'style-form-2',
      backdropDismiss: false,
      component: AssociateQrComponent,
      componentProps: {
        dataAssociateQR: this.isEdit ? this.screenData.dataAssociateQR : null
      }
    });
    modal.onDidDismiss().then(async (res: any) => {
      console.log('res', res);
      if (this._fun.isVarInvalid(res.data)) return;
      if (this._fun.isVarInvalid(res.data.form)) return;
      this.dataAssociateQR = res.data.form;
      this.createQR();

    });
    await modal.present();
  }

  async addProducers() {

    const modal = await this._modal.create({
      cssClass: 'style-add-productor',
      backdropDismiss: false,
      component: AddProducerComponent,
      componentProps: {
        /*   titleReg: 'objective_cert',
          listSelect: this.registroForm.controls[field.code].value */
      }
    });
    modal.onDidDismiss().then(async (res: any) => {
      console.log('res', res);
      if (this._fun.isVarInvalid(res.data)) return;
      if (this._fun.isVarInvalid(res.data.form)) return;
      console.log('Productor', res.data.form);

      let loading: any = await this._comp.presentLoading();
      let dateNow = Math.floor(new Date().getTime() / 1000);
      let res_certs: any = await this._apiMongo.filter(env.COLLECTION.document,
        env.TABLE_SIS.external,
        {
          "data.document.subject.data.dids.address": res.data.form.adrx /* '0xCbaC00890b981bC49d8B11c294ab673Db01faA4D' */,
          "data.document.stamp_db": { "$lte": dateNow },
          "data.document.iat": { "$lte": dateNow },
          "data.document.exp": { "$gt": dateNow },
          "data.data_cert.certificateType": "C1"
        });

      let certs = []
      if (res_certs.result.length > 0) {
        certs = res_certs.result[0]['external'];
      }

      console.log('certs', certs);

      let certsMin = [];
      for (let index = 0; index < certs.length; index++) {
        let cert = {
          key: certs[index].key,
          title: certs[index].data.data_cert.title,

          lacchainId: certs[index].data.data_cert.tx.lacchainId,
          trxid: certs[index].data.data_cert.tx.trxid,

          imgfile: env.url2 + certs[index].data.document.imgfile.url,
          imgfile_anonymous: env.url2 + certs[index].data.document.imgfile_anonymous.url
        }
        certsMin.push(cert);

        if (index == (certs.length - 1)) {

          let formProd = res.data.form;
          formProd.certs = certsMin;
          this.listProducers.push(formProd);
          console.log(' this.listProducers', this.listProducers);
          this.joinCerts();
          loading.dismiss();
        }
      }

      if (certs.length == 0) {

        this.listProducers.push({
          adrx: res.data.form.adrx,
          dni: res.data.form.dni,
          name: res.data.form.name,
          count: res.data.form.count,
          q_unid: res.data.form.q_unid,
          certs: certsMin
        });
        console.log(' this.listProducers', this.listProducers);

        loading.dismiss();
      }

      console.log('res_certs', certs);
      // did:ethr:lacchain:0xCbaC00890b981bC49d8B11c294ab673Db01faA4D#Juan Carlos Cabanillas
      /*  if (this._fun.isEmpty(res_certs.result)) {
         this._fun.alertWarning('No se encontro certificados validos', 'Entendido');
         return;
       } */
      /* 
            this.listProducers.push(res.data.form) */

    });
    await modal.present();

  }

  functionField(jsonExe) {
    let newDate = new Date();
    let strJson = JSON.stringify(jsonExe);
    let var_strJson = JSON.stringify(jsonExe);
    console.log('strJson', strJson);

    /* strJson = strJson.replace('getTitleScreen()', this.metadata.title); */
    strJson = strJson.replace('getDate()', Math.floor((newDate.getTime()) / 1000).toString());
    console.log('strJson...1', strJson);

    let validJson = this._fun.validJson(strJson);
    if (this._fun.isString(validJson)) validJson = JSON.parse(validJson);
    console.log('validJson..1', validJson);

    if (validJson == null) return '';

    if (var_strJson.includes('getDate()')) {
      let varSum = validJson.valueDefault.split('+');
      let sum = 0;
      for (let index = 0; index < varSum.length; index++) {
        sum += Number(varSum[index]);
      }
      validJson.valueDefault = this._fun.dateTmsToStr(sum);
    }
    console.log('validJson.valueDefault', validJson.valueDefault);

    return validJson.valueDefault;
  }


  tiggerFields(index) {
    Object.keys(this.sections[index].form.controls).forEach(field => {
      let _control = this.sections[index].form.get(field);
      if (_control instanceof FormControl) _control.markAsTouched({ onlySelf: true });
      if (_control instanceof FormGroup) {
        Object.keys(_control.controls).forEach(field_g => {
          let _control_g = _control.get(field_g);
          if (_control_g instanceof FormControl) _control_g.markAsTouched({ onlySelf: true });
        });
      }
    });
  }

  changeSlide(action) {
    if (action == 'next') {
      let form = this.sections[this.activeSlide - 1].form;
      if (form) {
        this.tiggerFields(this.activeSlide - 1);
        if (!form.valid) {
          this._fun.alertWarning('Esta sección tiene campos obligatorios, debe llenarlos para continuar', 'Entendido')
          return;
        }
      }

      if (this.activeSlide == this.numSlides) return;

      let sld_i = document.getElementById("sld" + this.activeSlide);
      let sld_d = document.getElementById("sld" + (this.activeSlide + 1));
      sld_i.classList.toggle('backSlide');
      sld_d.classList.toggle('activeSlide');
      this.activeSlide = this.activeSlide + 1;
    } else {
      if (this.activeSlide == 1) return;
      let sld_i = document.getElementById("sld" + this.activeSlide);
      let sld_d = document.getElementById("sld" + (this.activeSlide - 1));
      sld_i.classList.remove('activeSlide', 'backSlide');

      sld_d.classList.remove('backSlide');
      sld_d.classList.add('activeSlide');
      this.activeSlide = this.activeSlide - 1;
    }
    this.configChangeSlide();

  }

  selectForm() {
    this.router.navigate(['/select-screen']);
  }

  configChangeSlide() {

    if (this.activeSlide == this.screenSectionsConfig.length + 1) this.titleSlide = 'Asociar QR';
    else this.titleSlide = this.screenSectionsConfig[this.activeSlide - 1].section.name
    let a = this.activeSlide * 100 / this.numSlides;
    this.renderer.setStyle(this.bar.nativeElement, 'width', `${a}%`);
  }

  dataFormsOnlyValue() {
    let section: any = {};
    for (let index = 0; index < this.sections.length; index++) {

      if (this.sections[index].form) {
        let form = this.sections[index].form.value;
        section = Object.assign(section, form);
      } else {
        if (index == (this.sections.length - 1)) {
          return section;
        } else continue;
      }

      if (index == (this.sections.length - 1)) return section;
    }
  }

  dataView = {//usado para las listar en tablas
    objective_cert: '',
    buyer: '',
    origin: '',
    destination: '',
    f_emision: '',
    f_vencimineto: ''
  };


  async dataAllFormsValue(sections) {
    return new Promise(async (resolve, reject) => {
      let sec: any = [];
      for (let index = 0; index < sections.length; index++) {

        let fields = [];
        for (let x = 0; x < sections[index].fields.length; x++) {
          let fld = sections[index].fields[x];

          for (var key in sections[index].form.value) {
            if (key == fld.code) {
              if (fld.type == "imageselect") {
                let fieldForm = sections[index].form.value[key];
                sections[index].form.value[key].files = await this.uploadImgs(fieldForm.files);
              }

              let valueR: any;
              if (fld.code == 'f_emision' || fld.code == 'f_vencimineto') valueR = this._fun.dateStrtoTms(sections[index].form.value[key], null);
              else valueR = sections[index].form.value[key];
              this.dataView[fld.code] = valueR;


              if (this.dataView[fld.code] != undefined) this.dataView[fld.code] = valueR;

              let data_field = {
                width_bootstrap: fld.width.boost,
                name: fld.caption,
                type: fld.type,
                code: fld.code,
                value: valueR
              }


              fields.push(data_field);
              break;
            }
          }

          if (x == (sections[index].fields.length - 1)) {
            let data: any = {
              section: {
                name: sections[index].section.name,
                code: sections[index].section.code
              },
              fields
            };

            sec.push(data);
          }

        }

        if (sections[index].fields.length == 0) {
          let data: any = {
            section: {
              name: sections[index].section.name,
              code: sections[index].section.code
            },
            fields: []
          };
          sec.push(data);
        }

        if (index == (sections.length - 1)) resolve(sec);

      }
    });
  }

  async uploadImgs(files: any) {
    return new Promise(async (resolve, reject) => {
      let arrayUrlImg = [];
      let count = 0;
      if (files.length == 0) resolve([]);

      files.forEach(file => {
        if (file.url) {
          arrayUrlImg.push(file);
          count++;
          if (count == files.length) resolve(arrayUrlImg);
        }
        else {
          this._apiMongo.uploadFile(file.b64, file.ext).subscribe((res_upload: any) => {
            arrayUrlImg.push({
              ext: file.ext,
              type: file.type,
              url: this._env.url2 + res_upload.data.url
            });
            count++;
            if (count == files.length) resolve(arrayUrlImg);
          });
        }
      });
    });
  }

  async createQR() {
    let loading: any = await this._comp.presentLoading();

    let sectionsValue: any = await this.dataAllFormsValue(this.sections);
    let jsonForms = this.dataFormsOnlyValue();

    let dataJson = {
      sections: sectionsValue,
      producers: this.listProducers,
      portada: this.imgPortada
    };

    let strJsonForms = JSON.stringify(dataJson);
    this.idCert = sha256(new Date().getTime() + strJsonForms + this.user.publicKey);

    console.log('dataJson', dataJson);

    let body: any = {
      id: this.idCert,
      idcredential: this.idCert,
      url: "",//B64 cert
      mode: "mini",
      urltype: "img",//pdf o img o html
      validFrom: this._fun.dateStrtoTms(jsonForms.f_emision, null),//emision
      validTo: this._fun.dateStrtoTms(jsonForms.f_vencimineto, null),//Vencimiento
      data: dataJson
    };

    console.log('body', body);
    let token = await this._storage.get('TOKEN');
    console.log('MOSTRAR TOKEN');
    console.log('this.dataView', this.dataView);

    this.api.certificate(token, body, true).subscribe(async (res_cert: any) => {
      console.log('DATA RETURN', res_cert);
      if (this._fun.isInvalidResApi(res_cert.code)) {
        await this._fun.alert(env.MSG.TYPE_ERROR, 'ok', env.MSG.ERROR_TITLE, 'Cert Invalid');
        return;
      }

      let dataCred = {
        credential: res_cert.credential,
        hash: res_cert.hash,
        lacchainId: res_cert.lacchainId,
        trxid: res_cert.trxid,
        timestamp: res_cert.timestamp
      };

      let DNI_USER = this._auth.userData.data.idens[0].number;

      this.dataAssociateQR.trxid = res_cert.trxid;
      this.dataAssociateQR.indentUser = DNI_USER;

      let dataQR_DB = {
        dataCred,
        dataView: this.dataView,
        dataScreem: this.screenSectionsConfig,
        dataAssociateQR: this.dataAssociateQR
      };

      try {

      //DBERIA SER EL HASH DEL DNI Y DEL EMAIL(NO SE PODRIA CAMBIAR)
        console.log('dataQR_DB', dataQR_DB);

        //ASOCIAR QR A USUARIO

        let secret = sha256('RASTRAR');
        let key = sha256(this.dataAssociateQR.key + secret)


        let res_associateQR = await this._apiMongo.create(env.COLLECTION.associateQr, key, this.dataAssociateQR.trxid, this.dataAssociateQR, false);
        console.log('res_associateQR', res_associateQR);

        if (this.isEdit) {

          let res_deleteAssociateQR = await this._apiMongo.delete(env.COLLECTION.associateQr, key, this.screenData.dataAssociateQR.trxid);
          console.log('res_deleteAssociateQR', res_deleteAssociateQR);

          let res_deleteCredQRUser = await this._apiMongo.delete(env.COLLECTION.dataQrUser, this.screenData.table, this.screenData.key);
          console.log('res_deleteCredQRUser', res_deleteCredQRUser);
        }


        let res_saveCredQRUser = await this._apiMongo.create(env.COLLECTION.dataQrUser, DNI_USER, res_cert.trxid, dataQR_DB, true);
        console.log('res_saveCredQRUser', res_saveCredQRUser);
        this.confirm(true);
        loading.dismiss();

      } catch (error) {

        loading.dismiss();
        await this._fun.alert(env.MSG.TYPE_ERROR, 'ok', env.MSG.ERROR_TITLE, error);
      }



    }, async error => {
      loading.dismiss();
      await this._fun.alert(env.MSG.TYPE_ERROR, 'ok', env.MSG.ERROR_TITLE, error);
    })
  }

  async verQRCert(trxid, title) {
    const modal = await this._modal.create({
      backdropDismiss: false,
      component: GenerarCodeQRComponent,
      componentProps: {
        trxid,
        title
      }
    });
    modal.onDidDismiss().then(async (res: any) => {
      console.log('res', res);
      /*  if (this._fun.isVarInvalid(res.data)) return;
       if (!this._fun.isVarInvalid(res.data.list)) {
         console.log('this.registroForm', this.registroForm.value);
         this.registroForm.controls[field.code].setValue(res.data.list);
       } */
    });
    await modal.present();
  }

  nextSlide() {
    let sidebar = document.querySelector(".sidebar");
    console.log('sidebar', sidebar);
    sidebar.classList.toggle('close');
  }

  imgPortada = '';

  async imagesPred() {

    const modal = await this._modal.create({
      cssClass: 'style-list-select',
      backdropDismiss: false,
      component: SelectImagenComponent,
      componentProps: {
        /*   titleReg: 'objective_cert',
          listSelect: this.registroForm.controls[field.code].value */
      }
    });
    modal.onDidDismiss().then(async (res: any) => {
      console.log('res', res);
      if (this._fun.isVarInvalid(res.data)) return;
      this.imgPortada = res.data.img;

    });
    await modal.present();

  }

  async verDemo() {

    let dataForm: any = this.dataAllFormsValue(this.sections);
    console.log('PASO....1');

    let jsonForms = this.dataFormsOnlyValue();
    console.log('PASO....2');

    //Fechas en Timestamp
    jsonForms.f_emision = this._fun.dateStrtoTms(jsonForms.f_emision, null);
    jsonForms.f_vencimineto = this._fun.dateStrtoTms(jsonForms.f_vencimineto, null);

    //Data de productores
    jsonForms.producers = this.listProducers;

    //Foto de portada
    jsonForms.portada = this.imgPortada;

    console.log('MOSTRAR', { jsonForms, dataForm });

    const modal = await this._modal.create({
      component: DemoInicioComponent,
      cssClass: 'style-demo',
      componentProps: {
        data: { jsonForms, dataForm },

      }
    });

    modal.onDidDismiss().then(async (res: any) => {
      /*    console.log(res.data);
         if (this._fun.isVarInvalid(res.data)) return;
         if (!this._fun.isVarInvalid(res.data.confirm)) this.getList(); */
    });
    return await modal.present();

  }

  closeModal() {
    /*     this._modal.dismiss({ confirm: true, refresh: true }); */
    this._modal.dismiss({ confirm: false });
  }

  confirm(refresh) {
    this._modal.dismiss({ confirm: true, refresh });
  }



}
