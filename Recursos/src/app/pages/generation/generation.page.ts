import { Component, ElementRef, Input, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides, ModalController } from '@ionic/angular';
import { sha256 } from 'js-sha256';
import { Funciones } from 'src/app/compartido/funciones';
import { AddProducerComponent } from 'src/app/components/add-producer/add-producer.component';
import { DemoInicioComponent } from 'src/app/components/comp-demo/demo-inicio/demo-inicio.component';
import { GenerarCodeQRComponent } from 'src/app/components/generar-code-qr/generar-code-qr.component';
import { SelectImagenComponent } from 'src/app/components/select-imagen/select-imagen.component';
import { ApiService } from 'src/app/services/api.service';
import { ApiMongoService } from 'src/app/services/apiMongo.service';
import { DataService } from 'src/app/services/data-service.service';
import { DatabaseService } from 'src/app/services/database.service';
import { IonicComponentsService } from 'src/app/services/ionic-components.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-generation',
  templateUrl: './generation.page.html',
  styleUrls: ['./generation.page.scss'],
})
export class GenerationPage implements OnInit {

  @ViewChild('bar', { read: ElementRef }) bar: ElementRef;
  @ViewChild('slidesDatos', { static: false }) private slidesDatos: IonSlides;

  constructor(
    private _db: DatabaseService,
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

  ngOnInit() {
    this.registroForm = this.formBuilder.group({});
    this.id_param = this.route.snapshot.paramMap.get('id');//ID CERT
    this.initData();
  }

  ngAfterViewInit() {
    let a = 100 / this.numSlides;
    this.renderer.setStyle(this.bar.nativeElement, 'width', `${a}%`);
  }

  scan(data) {

  }

  selectChang(data, f, a) {

  }

  selectMulti(data, f, a) {

  }

  imagesCapture(data) {

  }

  sections = [];
  listProducers = [];
  dataSreen: any = {
    imagenUrl: ''
  };

  listCerts = [];

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
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
          console.log('CERTS',this.listCerts);
          
        }
      }
    }
  }

  async initData() {
    this.user = await this._storage.getLocalStorage('DATA') || { publicKey: '' };
    this._data.getDataGeneration().subscribe(async screenData => {

      let screen = screenData.sectionConfig;
      this.dataSreen = screenData.dataSreen;

      this.numSlides = screen.length + 1;
      for (let index = 0; index < screen.length; index++) {
        let sec: any = screen[index];
        let form = await this.createForm(sec.fields);
        sec.form = form;
        this.sections.push(sec);

        if (index == (screen.length - 1)) {
          console.log('this.sections', this.sections);
        }
      }

      console.log('screen', screen);
      return;

      if (this._fun.isVarInvalid(screen) || this.initForm) return;
      this.initForm = true;
      this.metadata = screen;
      console.log('this.metadata', this.metadata);

      /*  this.createForm(); */
      if (this._fun.isVarInvalid(this.id_param)) {
        this.isEdit = false;
        this.idCert = sha256(new Date().getTime() + this.metadata.code + this.user.publicKey);
      } else this.editData();
    });
  }

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
        console.log('listByApi VALUE', valueDefauld);

        regForm.addControl(field.code, new FormControl(valueDefauld, validators));
      } else if (field.type == 'checkbox' || field.type == 'select') {
        regForm.addControl(field.code, this.formBuilder.group({
          key: ['', Validators.required],
          value: ['']
        }));
      } else regForm.addControl(field.code, new FormControl(valueDefauld, validators));

      console.log(regForm.value);
      if (index == (fields.length - 1)) return regForm;

    }

  }

  async addProducers() {

    const modal = await this._modal.create({
      cssClass: 'style-list-select',
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
          q_unid:res.data.form.q_unid,
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

  async editData() {
    /* this.isEdit = true;
    this.loading = await this._comp.presentLoading();
    await this.db.getData({ id: this.id_param }, env.TABLE.CERT).then(res => {
      if (!res) this.loading.dismiss();

      this.idCert = res[0].id;
      let dataForm = JSON.parse(res[0].data);
      console.log('dataForm...........1', dataForm);
      dataForm.f_emision = this._fun.dateTmsToStr(dataForm.f_emision);
      dataForm.f_vencimiento = this._fun.dateTmsToStr(dataForm.f_vencimiento);
      console.log('dataForm...........2', dataForm);
      this.registroForm.patchValue(dataForm);
    });
    await this.db.getData({ id_cert: this.id_param, status: env.STATUS_REG.SAVED }, env.TABLE.IMG).then(res => {
      if (!res) this.loading.dismiss();
      console.log('IMAGES', res);
      this.photoPreview = res;
    });
    this.loading.dismiss(); */
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
    if (this.activeSlide == 1) this.titleSlide = 'Información comercial';
    else if (this.activeSlide == 2) this.titleSlide = 'Información de producto';
    else if (this.activeSlide == 3) this.titleSlide = 'Procedencia de Materia Prima';
    else if (this.activeSlide == 4) this.titleSlide = 'Cadena de suministro';
    else if (this.activeSlide == 5) this.titleSlide = 'Fotos y videos';
    else if (this.activeSlide == 6) this.titleSlide = 'Asociar QR';

    let a = this.activeSlide * 100 / this.numSlides;
    this.renderer.setStyle(this.bar.nativeElement, 'width', `${a}%`);
  }

  dataFormsValue() {
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

  async asociarQR() {
    let loading: any = await this._comp.presentLoading();
    /* Se debe validar que los nombres de los Fields no sean iguales entre cada 
    seccion por que se generaria un error, se chancarian, (validar al crear la patalla) */
    let jsonForms = this.dataFormsValue();

    //Fechas en Timestamp
    jsonForms.f_emision = this._fun.dateStrtoTms(jsonForms.f_emision);
    jsonForms.f_vencimineto = this._fun.dateStrtoTms(jsonForms.f_vencimineto);

    //Data de productores
    jsonForms.producers = this.listProducers;

    //Foto de portada
    jsonForms.portada = this.imgPortada;

    let strJsonForms = JSON.stringify(jsonForms);
    this.idCert = sha256(new Date().getTime() + strJsonForms + this.user.publicKey);

    console.log('jsonForms', jsonForms);

    let body: any = {
      id: this.idCert,//did(TOTAL) titular
      idcredential: this.idCert, //id credential
      url: "",//B64 cert
      mode: "mini",
      urltype: "img",//pdf o img o html
      validFrom: jsonForms.f_emision,//emision
      validTo: jsonForms.f_vencimineto,//Vencimiento
      data: jsonForms
    };

    let token = await this._storage.getLocalStorage('TOKEN');

    this.api.certificate(token, body, true).subscribe(async (res_cert: any) => {
      console.log('DATA RETURN', res_cert);
      jsonForms.tx = JSON.stringify(res_cert);
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

      let dataQR_DB = {
        id: res_cert.credential.verifiableCredential[0].credentialSubject.id,
        desc: res_cert.credential.verifiableCredential[0].credentialSubject.desc,
        objective_cert: res_cert.credential.verifiableCredential[0].credentialSubject.objective_cert,
        f_emision: res_cert.credential.verifiableCredential[0].credentialSubject.f_emision,
        f_vencimineto: res_cert.credential.verifiableCredential[0].credentialSubject.f_vencimineto,
        trxid: res_cert.trxid,
        imgTypeSreen: this.dataSreen.imagenUrl,
        dataCredential: JSON.stringify(dataCred),
        emisor_ident: sha256(this.user.email + this.user.idens[0].number),
        status: 1
      };

      this.saveQr(dataQR_DB);

      loading.dismiss();
      /*   */

    }, async error => {
      loading.dismiss();
      await this._fun.alert(env.MSG.TYPE_ERROR, 'ok', env.MSG.ERROR_TITLE, error);
    })
  }

  async saveQr(data) {
    try {
      let addCert = await this._db.addData(data, env.TABLE.QR);
      console.log('CREDENCIAL GUARDADA', addCert);
      this.verQRCert(data.trxid, data.objective_cert);
      this.router.navigate(['/gestion']);
    } catch (error) {
      await this._fun.alert(env.MSG.TYPE_ERROR, 'ok', env.MSG.ERROR_TITLE, error);
    }
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

    const modal = await this._modal.create({
      backdropDismiss: false,
      component: DemoInicioComponent,
      componentProps: {
        /*   titleReg: 'objective_cert',
          listSelect: this.registroForm.controls[field.code].value */
      }
    });
    modal.onDidDismiss().then(async (res: any) => {
      console.log('res', res);

    });
    await modal.present();

  }



}
