import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
import { sha256, sha224 } from 'js-sha256';
import { Platform } from '@ionic/angular';
import { Web3jsService } from './web3js.service';
import { Funciones } from '../compartido/funciones';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private storage: StorageService,
    private fun: Funciones,
    private web3js: Web3jsService,
    private plt: Platform,
    private _http: HttpClient
  ) { }

  dominio = env.url;
  cred_App = env.CREDENTIAL_APP;

  auth() {
    let secret_boleth = this.fun.makeid(50);
    let var_proof = "0x" + sha256(this.cred_App.secret_shib + '.' + secret_boleth);
    let singData: any = this.web3js.sign(var_proof, 'f10085866562b54e58ca1b61cccef6d8e7cd864738ea87cb02676e5a462b6070');

    var body = {
      client_id: this.cred_App.client_id,
      domain_key: this.cred_App.domain_key,
      api_key: this.cred_App.api_key,
      secret_boleth,
      client_proof: singData.signature,
      duration: 25000
    };

    const URL = this.dominio.concat('auth');
    return this._http.post(URL, body);
  }

  register(auth_token, data) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });

    var body = {
      param1: '0x' + data.hash_cert,
      param2: data.emisor,
      param3: data.titular,
      param4: data.title_cert,
      param5: data.venc_cert
    };

    const URL = this.dominio.concat(`contract/${env.CREDENTIAL_APP.contract}/register`);
    return this._http.post(URL, body, { headers });
  }


  genCertStamp(body) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.auth_token_stamp}`
    });
    console.log('BODY', body);

    const URL = this.dominio.concat('contract/stamp/');
    console.log('URl', URL);

    return this._http.post(URL, body, { headers })
  }


  certificate(auth_token, body, credStamp?) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${credStamp ? env.auth_token_stamp : auth_token}`
    });
    console.log('BODY', body);

    let URL = '';
    if (credStamp) URL = env.url_STAMP.concat('contract/stamp/');
    else URL = this.dominio.concat('certificate');

    console.log('URl', URL);

    return this._http.post(URL, body, { headers })

  }

  getIpfs(code) {
    const URL = 'https://ipfs.io/ipfs/' + code;
    console.log('URl', URL);
    return this._http.get(URL,)
  }

  presentarCert(code) {
    const URL = 'https://ipfs.io/ipfs/' + code;
    console.log('URl', URL);
    return this._http.get(URL,)
  }


}