import { Injectable } from '@angular/core';
import Web3 from "web3";
import { Subject } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { Funciones } from '../compartido/funciones';

@Injectable({
  providedIn: 'root'
})
export class Web3jsService {

  private web3js: any;
  private accountStatusSource = new Subject<any>();
  accountStatus$ = this.accountStatusSource.asObservable();

  constructor(private fun: Funciones) { 
    this.initConnect();
  }

  async initConnect() {
    this.web3js = new Web3(new Web3.providers.HttpProvider(env.node));
    console.log('NODO CONECTADO');
  }

  async account() {
    return new Promise(async (resolve, reject) => {
      try {
        var xcuenta = this.web3js.eth.accounts.create(this.web3js.utils.randomHex(32));
        resolve(xcuenta);
      } catch (err) {
        resolve(null);
        await this.fun.alert(env.MSG.TYPE_ERROR, 'ok', env.MSG.ERROR_TITLE, err);
      }
    });
  }

  sign(message,privateKey){
      return this.web3js.eth.accounts.sign(message, privateKey);
  }
  
  singTx(txJSON, privateKey) {
    return new Promise(async (resolve, reject) => {
      this.web3js.eth.accounts.signTransaction(txJSON, privateKey).then(async function (raw) {
        if (!raw) {
          resolve(null);
          await this.fun.alert(env.MSG.TYPE_ERROR, 'ok', env.MSG.ERROR_TITLE, env.MSG.ERROR_GENERAL);
        }
        resolve(raw.rawTransaction);
      }).catch(async err => {
        resolve(null);
        await this.fun.alert(env.MSG.TYPE_ERROR, 'ok', env.MSG.ERROR_TITLE, err);

      });
    });
  }

  sendTx(rawTransaction) {
    return new Promise(async (resolve, reject) => {
      this.web3js.eth.sendSignedTransaction(rawTransaction).then(async function (receipt) {
        console.log('raw', receipt)
        if (!receipt) {
          resolve(null);
          await this.fun.alert(env.MSG.TYPE_ERROR, 'ok', env.MSG.ERROR_TITLE, env.MSG.ERROR_GENERAL);
         

        }
        resolve(receipt);
      }).catch(async err => {
       console.log('err',err);
       resolve(null);
        await this.fun.alert(env.MSG.TYPE_ERROR, 'ok', env.MSG.ERROR_TITLE, err);
        
      });
    });
  }

}
