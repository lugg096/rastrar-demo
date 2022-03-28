import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { sha256 } from 'js-sha256';
import { Funciones } from 'src/app/compartido/funciones';
import { GenerarCodeQRComponent } from 'src/app/components/generar-code-qr/generar-code-qr.component';
import { PinAccessComponent } from 'src/app/components/pin-access/pin-access.component';
import { DataService } from 'src/app/services/data-service.service';
import { DatabaseService } from 'src/app/services/database.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment as env } from 'src/environments/environment';
@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.page.html',
  styleUrls: ['./gestion.page.scss'],
})
export class GestionPage implements OnInit {

  @ViewChild('completados', { read: ElementRef }) completados: ElementRef;
  @ViewChild('pendientes', { read: ElementRef }) pendientes: ElementRef;
  @ViewChild('bar', { read: ElementRef }) bar: ElementRef;

  constructor(
    private _storage: StorageService,
    private _data: DataService,
    private _modal: ModalController,
    public router: Router,
    private db: DatabaseService,
    private renderer: Renderer2,
    private fun: Funciones
  ) { }
  public env = env;
  filtro = env.STATUS_REG.SAVED;
  certificados = [];

  buscar = false;
  dataPrueba = [
    {
      code: "001",
      data: "{}",
      emisor: "0xAeF5F9e6e63F711310e6122Ca12DD85d36910D1D",
      frecord: "1617724458637000",
      fsend: "",
      status: env.STATUS_REG.SAVED,
      title: "Registro Sanitario Técnico",
      tx: "",
    },
    {
      code: "002",
      data: "{}",
      emisor: "0xAeF5F9e6e63F711310e6122Ca12DD85d36910D1D",
      frecord: "1617724458637000",
      fsend: "",
      status: env.STATUS_REG.SIGNED,
      title: "Registro Sanitario Técnico",
      tx: "",
    }
  ];

  optionFilter = [
    { key: 'titular_name', value: '', type: 'string' },
    { key: 'title', value: '', type: 'string' }
  ];
  nameFilter = '';

  /*  changeInput(value, index, type) {
     console.log('value',value);
     
     if (type == 'checkbox') {
       value = value.detail.checked;
     }
 
     this.optionFilter[index].value = value;
     this.filter();
   } */
  list = [];
  list_main = [];
  buscarCert(value) {
    this.list = this.list_main.filter(a => {
      let filter1 = true;
      let filter2 = true;
      filter1 = a['titular_name'].toLowerCase().indexOf(value.toLowerCase()) != -1;
      filter2 = a['title'].toLowerCase().indexOf(value.toLowerCase()) != -1;
      return filter1 || filter2;
    });
  }

  _env = env;
  arrayPrueba = [
    {
      dataCredential: {},
      desc: "Limon de exportación",
      emisor_ident: "",
      f_emision: 1640581200,
      f_vencimineto: 1640926800,
      id: "0x2cE3C9f3aA6Ff4761bE1f7849709f4a70F2B3a45",
      imgTypeSreen: "/files/0xdfc0EBba7Fc2f39F6A79983032C86FE457C9D070/8e1de7bfc2d59cb53ef1ee1d1b17b83b0d61901d8cb1acb443811ecc9df468c2.png/?token=721a685476003a8bd2a481592165a90791924c1572b0226f50d886beb768fabc",
      objective_cert: "Sku001 PIU_LIM",
      status: 1,
      trxid: '6e2d1c0bc9a644d5ce26037a3f5b26d8c629f1e5',
    }
  ]

  ngOnInit() {
    /* ; console.log('TIME', this.fun.dateTmsToStr(1626311642)); */
    this.db.getDatabaseState().subscribe(ready => {
      if (ready) {
        /*         this.getCerificados(this.filtro); */
        this.db.getQRs().subscribe((cert: any) => {
          console.log('CERTIFICADOS22222', cert);
          this.certificados = cert;
          /* .filter(c => c.status == this.filtro);
          this.buscar = false;
          this.nameFilter = ''; */
          this.list = this.certificados;
          this.list_main = this.certificados;
        })
      }
    })
  }

  async delete(item) {
    let confirm = await this.fun.alert(env.MSG.TYPE_ALERT, 'Si, eliminar', env.MSG.ALERT_TITLE, 'Desea eliminar información de certificado permanentemente?');
    if (!confirm) return;
    this.db.deleteData({ id: item.id }, env.TABLE.CERT) || [];
  }

  async prueba() {
    await this.fun.code(env.MSG.TYPE_ALERT, ' Ok ', 'Código', this.fun.genCodeId());
  }

  ionViewDidEnter() {
    console.log('this.storage.initSesion', this._storage.initSesion);
    if (!this._storage.initSesion) {
      console.log('ACABA DE INICIAR SESION');

      this.getCerificados(this.filtro);
    }


  }


  async verQRCert(data) {
    const modal = await this._modal.create({
      backdropDismiss: false,
      component: GenerarCodeQRComponent,
      componentProps: {
        trxid: data.trxid,
        title: data.objective_cert,

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


  filter(filter) {
    this.filtro = filter;
    this.getCerificados(filter);
    if (filter == env.STATUS_REG.SAVED) {
      this.renderer.removeClass(this.completados.nativeElement, 'select');
      this.renderer.addClass(this.pendientes.nativeElement, 'select');
    } else {
      this.renderer.removeClass(this.pendientes.nativeElement, 'select');
      this.renderer.addClass(this.completados.nativeElement, 'select');
    }
  }

  async refreshList(event) {
    await this.getCerificados(this.filtro);
    event.target.complete();
  }


  cancelBuscar() {
    this.buscar = false;
    this.list = this.list_main;
    this.nameFilter = '';
  }


  async getCerificados(estado) {
    return new Promise(async (resolve) => {
      /* this.certificados = await this.db.getData({ status: estado, emisor_did: this._storage.userSesion.publicKey }, env.TABLE.CERT) || []; */
      this.certificados = await this.db.getData({ /* status: estado, */ emisor_ident: sha256(this._storage.userSesion.email + this._storage.userSesion.idens[0].number) }, env.TABLE.QR) || [];


      this.buscar = false;
      this.nameFilter = '';
      this.list = this.certificados;
      this.list_main = this.certificados;
      console.log('this.certificados', this.certificados);
      resolve(true);
      /*  
      this.db.loadCertificados(estado, null).then((res: any) => {
         console.log('mostrar datos', res);
         resolve(res);
       }) 
       */
    })
  }

  async formCert(item) {
    console.log('MOSTRAR', item);
    /*     this.router.navigate(['/registro/' + item.id]); */

    let listScreen = await this._storage.getLocalStorage('SCREEN');
    let screen = listScreen.filter(s => s.key == item.code);
    console.log('screen filter', screen);

    this.screenTask(screen[0], item);
  }



  async screenTask(screen, item) {

    let list = screen.fields;
    console.log('LIST', list);
    /*   return; */

    let metadata =
    {
      code: screen.key,
      title: screen.name,
      icon: '',
      buttons: [
        {
          color: '#fff',
          background: '#1c1c24',
          width: '50',
          text: 'Terminar',
          type: 'confirm'// confirm |  cancel  
        }
      ],
      fields: [],
      code_almc: item.code_almc || '',
      certificateType: screen.certificateType
    };

    for (let index = 0; index < list.length; index++) {
      const fld = list[index];
      let options = [];

      if (fld.field.data.type.value == 'select' || fld.field.data.type.value == 'checkbox') {
        let listParams = await this.db.getData(null, fld.field.data.tableSelect.key) || [];
        console.log('listParams', listParams);
        options = listParams;
      }

      let f = {
        code: fld.field.key,//key
        caption: fld.field.name,// name
        value: fld.field.data.value,
        placeholder: fld.field.data.placeholder,//PLaceholder
        type: fld.field.data.type.value, // address | photos | select | textbox | input 
        inputtype: fld.field.data.inputtype.value, // type.value
        rows: null,
        width: fld.field.data.width,
        long: null,//Longitud de caracteres o números
        max: 0,
        min: 0,// Para valores numéricos| fotos o fechas.
        options: options,
        required: fld.required // requeride
      };

      metadata.fields.push(f);
      /* console.log('PUSH', metadata); */

      if (index == (list.length - 1)) {
        this._data.dataSendForm.next(metadata);
        this.router.navigate(['/registro/' + item.id]);
      }
    }

  }


  selectForm() {
    this.router.navigate(['/select-screen']);
  }

  async completeCert(cert) {
    let confirm = await this.fun.alert(env.MSG.TYPE_ALERT, 'Si, continuar', env.MSG.ALERT_TITLE, env.MSG.ALERT_UPLOAD);
    if (!confirm) return;

    if (cert.status == env.STATUS_REG.SAVED) {
      let data: any = await this.fun.accessPin();
      console.log('privateKey', data.privateKey);
      if (!this.fun.isVarInvalid(data.privateKey)) this.progress(cert, data.privateKey);
    } else {
      this.progress(cert);
    }
  }


  async progress(cert: any, privateKey?: any) {
    await this.fun.progress({ cert, privateKey });
  }

  verCert(item) {
    if (item.status != env.STATUS_REG.UPLOADED) this.formCert(item);
    else this.certificado(item);
  }

  verQR() {

  }

  certificado(item) {
    this._data.dataSend.next(item);
    this.router.navigate(['/certificado']);
  }

  goRegistro() {
    this.router.navigate(['/registro']);
  }

}
