import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
import { ApiMongoService } from './apiMongo.service';
import { Funciones } from '../compartido/funciones';

declare let window: any;

@Injectable({
  providedIn: 'root'
})

export class ContractsService {

  constructor(
    private _fun: Funciones,
    private _apiMongo: ApiMongoService,
    private _http: HttpClient
  ) { }

  dominio: any = env.url;
  ct = env.ct;

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${env.auth_token}`
  });

  getAccount() {
    const params = { operation: 'getAccount' };
    return this._http.get(env.url, { params }).toPromise();
  }

  addDid(body) {
    const URL = this.dominio.concat(`contract/${this.ct.c_did}/create`);
    return this._http.post(URL, body, { headers: this.headers }).toPromise();
  }


  getTransaction(tx) {
    const params = { operation: 'getTransaction', tx };
    const URL = this.dominio;
    return this._http.get(URL, { params }).toPromise();
  }


  statusDid(address, acction) {
    const body = {
      param1: address
    };
    const URL = this.dominio.concat(`contract/${this.ct.c_did}/${acction}`);
    console.log('URL', URL);
    console.log('body', body);
    return this._http.post(URL, body, { headers: this.headers }).toPromise();
  }

  statusVc(tx, acction) {
    const body = {
      param1: tx
    };
    const URL = this.dominio.concat(`contract/${this.ct.c_vc}/${acction}`);
    console.log('URL', URL);
    console.log('body', body);
    return this._http.post(URL, body, { headers: this.headers }).toPromise();
  }

  getCredential(data) {
    const params = {
      operacion: env.TIPO_OPERACION_GET_DID,
      contract: env.ct.contract,
      addressTo: data.addressTo
    };
    return this._http.get(env.url, { params: params });
  }


  createCredential(body) {
    const URL = this.dominio.concat(`contract/${this.ct.c_vc}/register`);
    console.log('URL', URL);
    console.log('body', body);
    return this._http.post(URL, body, { headers: this.headers }).toPromise();
  }

  deleteCredential(address, acction) {
    const body = {
      param1: address
    };
    const URL = this.dominio.concat(`contract/${this.ct.c_vc}/${acction}`);
    return this._http.post(URL, body, { headers: this.headers }).toPromise();
  }

  changeStatusMaster(address, sm, acction) {
    const URL = this.dominio.concat(`contract/${sm}/${acction}`);
    const body = { param1: address };
    console.log('URL', URL);
    console.log('body', body);
    return this._http.post(URL, body, { headers: this.headers }).toPromise();
  }

  isMaster(address, sm) {
    const URL = this.dominio.concat(`contract/${sm}/isMaster`);
    const params = { param1: address };
    console.log('URL', URL);
    console.log('params', params);
    return this._http.get(URL, { headers: this.headers, params: params });
  }

  owner(sm) {
    const URL = this.dominio.concat(`contract/${sm}/owner`);
    console.log('URL', URL);
    return this._http.get(URL, { headers: this.headers });
  }

  tranfertowner(sm) {
    const URL = this.dominio.concat(`contract/${sm}/transferOwner`);
    console.log('URL', URL);
    return this._http.get(URL, { headers: this.headers }).toPromise();
  }



  /* FUNCIONES */
  createDID(cred, name, key_table): Promise<any> {
    return new Promise(async (resolve, reject) => {
console.log('cred....1',{
  param1: cred.address,
  param2: name,
  param3: 1,
  param4: key_table
});

      try {
        //Agregar address a smart contract
        let d_sign: any = await this.addDid({
          param1: cred.address,
          param2: name,
          param3: 1,
          param4: key_table
        });

        console.log('d_sign',d_sign);
        
        //Firmar información
        let tx = await this.signData(d_sign.data, "Crear DID", cred, 'did')
        resolve(tx);
        if (this._fun.isVarInvalid(tx)) return;

      } catch (error) {
        await this._fun.alertError(error);
        resolve(false);
      }
    });
  }

  signData(sign_data, nameTx, cred, sm): Promise<any> {
    return new Promise(async (resolve, reject) => {

      let ct = env.ct.c_did;
      let tab_sm = env.TABLE_SIS.DIDRegistry;
      if (sm == 'vc') {
        ct = env.ct.c_vc;
        tab_sm = env.TABLE_SIS.VCRegistry;
      }

      try {
        //Enviar firma a la Blockchain con MetaMask y obtener el TX
        let tx: any = await this.sentTransMT(sign_data);
        console.log('TRANSACCION', tx);

        //Informacion de transacción
        let data_tx: any = await this.getTransaction(tx) || '';
        console.log('data_tx', data_tx);

        //Estructura de informacion de transancción que se enviara a BD
        let body_tx = {
          name: nameTx,
          txType: 1,
          from: data_tx.from,
          to: cred.address,
          contract: ct,
          hashTransaction: tx,
          pk: cred.privateKey,
          blockNumber: "1",
          hashBlock: "1",
          gasUsed: "1",
          gasAcumulated: "1"
        }

        //Guardar transancción en BD
        let saved_tx = await this._apiMongo.create(env.COLLECTION.tx, tab_sm, tx, body_tx, false);
        console.log('saved', saved_tx);
        resolve(tx);
      } catch (error) {
        await this._fun.alertError(error);
        resolve(false);
      }
    });
  }




  /* METAMASK */
  sentTransMT(data): Promise<any> {

    let params = [
      {
        from: window.ethereum.selectedAddress,
        to: data.to,
        chainId: 648529,
        gas: '0x1E8480',
        gasLimit: "0x1E8480",
        gasPrice: '0x0',
        value: '0x0',
        data: data.data,
      },
    ];
    console.log('params', params)
    return window.ethereum.request({ method: 'eth_sendTransaction', params });
  }

  connectMT(): Promise<any> {
    return window.ethereum.request({ method: 'eth_requestAccounts' });
  }


}
