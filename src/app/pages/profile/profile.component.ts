import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Funciones } from 'src/app/compartido/funciones';
import { AlertInputComponent } from 'src/app/components/alert-input/alert-input.component';
import { GenerarCodeQRComponent } from 'src/app/components/generar-code-qr/generar-code-qr.component';
import { AuthService } from 'src/app/services/auth.service';
import { ContractsService } from 'src/app/services/contracts.service';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  constructor(
    private _fun: Funciones,
    private _contractsService: ContractsService,
    private _auth: AuthService,
    public router: Router,
    private _mod: ModalController,
    private _modal: ModalController) { }

  ngOnInit() {
    this.getUser()
  }

  data: any;
  did_us = false;

  _env = env;
  user: any = {
    name: '',
    role: '',
    DID: '',
    email: '',
    doc_ident: '',
    name_ident: ''
  };

  getUser() {
    this._auth.getUser().subscribe(res => {
      if (this._fun.isVarInvalid(res)) return;
      console.log(res);
      this.data = res;
      this.isMaster()

      if (res.data.dids.length != 0) this.did_us = true;

      this.user.name = res.name;
      this.user.role = res.data.role.value,
        this.user.DID = this.did_us ? res.data.dids[0].address : 'DID pendiente de creación';
      this.user.email = res.data.email;
      this.user.doc_ident = res.data.idens[0].number;
      this.user.name_ident = res.data.idens[0].type_name;
    })
  }

  m_did = false;
  m_vc = false;
  owner_did = false;
  owner_vc = false;

  async isMaster() {
    try {
      if (!this._fun.isEmpty(this.data.data.dids)) {

        this._contractsService.isMaster(this.data.data.dids[0].address, env.ct.c_did)
          .subscribe((res_did: any) => {
            this.m_did = res_did.data;
            console.log('RES res_vc', res_did);
          });

        this._contractsService.isMaster(this.data.data.dids[0].address, env.ct.c_vc)
          .subscribe((res_vc: any) => {
            this.m_vc = res_vc.data;
            console.log('RES res_vc', res_vc);
          });

        this._contractsService.owner(env.ct.c_vc)
          .subscribe((owner: any) => {
            this.owner_did = owner.data;
            console.log('RES owner_did', owner);
          });

        this._contractsService.owner(env.ct.c_vc)
          .subscribe((owner: any) => {
            this.owner_vc = owner.data;
            console.log('RES owner_vc', owner);
          });

      }
    } catch (error) {
      await this._fun.alertError(error);
    }
  }


  compartir() {

  }

  copyText() {

  }

  async owner(ct, name_ct) {
    const modal = await this._mod.create({
      component: AlertInputComponent,
      cssClass: 'style-alert-input',
      componentProps: {
        buttonConfim: 'Si, transferir',
        textTitle: 'Alerta',
        subtitle: 'Una vez que se tranfiera la propiedad su usuario no tendra acceso al contrato. Esta acción irrevocable, esta seguro de tranferir propiedad del contrato de '+name_ct+' ?',
        field:{
          value:'',
          caption:'Ingresa dirección del nuevo propietario',
          placeholder:'x0a1a1...a1a1a1',
          type:'text'
        }
      }
    });

    modal.onDidDismiss().then(async (res: any) => {
      console.log(res.data);
      if (this._fun.isVarInvalid(res.data)) return;
      if (!this._fun.isVarInvalid(res.data.confirm)) {

        /* ************************* */
        //Validar conexión en MetaMask
        await this._contractsService.connectMT();
        //FALTA TERMINAR
        /*  let sing: any = await this._contractsService.tranfertowner(this.ct);
     
         let signData: any = sing.data;
     
         let cred = { address: this.address, pk: null };
         await this._contractsService.
           signData(signData, 'Add Master', cred, this.ct);
     
         await this._fun.alertSucc('Se actualizó privilegios de usuario correctamente'); */

        /* *************************** */

        this.isMaster();
      }
    });
    return await modal.present();

  }

  generarQR(data) {
    this._modal.create({
      cssClass: 'modal-qr',
      component: GenerarCodeQRComponent,
      componentProps: {
        codeQR: data.value,
        texto: data.text,
      }
    }).then((modal) => modal.present());
  }

}
