import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Certificado, Parameter, QR, User } from '../interface/interfaces';
import { environment as env } from 'src/environments/environment';
import { Funciones } from '../compartido/funciones';
import { StorageService } from './storage.service';
import { sha256 } from 'js-sha256';

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {

  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  users = new BehaviorSubject([]);
  parameters = new BehaviorSubject([]);
  certificados = new BehaviorSubject([]);

  qrs = new BehaviorSubject([]);

  constructor(
    private storage: StorageService,
    private fun: Funciones,
    private plt: Platform,
    private sqlitePorter: SQLitePorter,
    private sqlite: SQLite,
    private http: HttpClient) {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'rastrar_101221.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          console.log('this.database ', this.database);

          this.seedDatabase();
        })
    }).catch(async err => {
      await this.fun.alert(env.MSG.TYPE_ERROR, 'ok', env.MSG.ERROR_TITLE, 'Base de datos_' + err);
    });
  }

  // Create table
  createTable(nameTable, columsTable) {
    return new Promise((resolve, reject) => {
      let colums = 'key TEXT PRIMARY KEY,status TEXT, name TEXT,data TEXT';
      this.database.executeSql(`
    CREATE TABLE IF NOT EXISTS ${nameTable} (${colums})
    `, [])
        .then(() => {
          resolve(true);
        })
        .catch(e => {
          console.log("error " + JSON.stringify(e));
          resolve(false);
        });

    });

  }

  seedDatabase() {
    this.http.get('assets/db/createTables.sql', { responseType: 'text' })
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(_ => {
            this.loadUsers();
            this.loadQRs('PEND', null);
            this.dbReady.next(true);
          }).catch(async err => {
            console.log('ACA ES ES ERROR', err);
            await this.fun.alert(env.MSG.TYPE_ERROR, 'ok', env.MSG.ERROR_TITLE, err);
          });
      })
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getUsers(): Observable<User[]> {
    return this.users.asObservable();
  }

  getParameters(): Observable<Parameter[]> {
    return this.parameters.asObservable();
  }

  getCertificados(): Observable<Certificado[]> {
    return this.certificados.asObservable();
  }

  getQRs(): Observable<QR[]> {
    return this.qrs.asObservable();
  }

  loadUsers() {
    return this.database.executeSql('SELECT * FROM user', []).then(data => {
      let users: User[] = [];
      console.log('users', users);

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          /*
           users.push({
            id: data.rows.item(i).id,
            name: data.rows.item(i).name,
            role: data.rows.item(i).role,
            pin: data.rows.item(i).pin,
            publicKey: data.rows.item(i).publicKey,
            privateKey: data.rows.item(i).privateKey,
            metadata: data.rows.item(i).metadata,
            status: data.rows.item(i).status
          }) */
        }
      }
      this.users.next(users);
    });
  }

  addData(data: any, entity: string): Promise<boolean> {
    console.log('Entidad', entity);
    console.log('DATA INSERT', data);

    return new Promise((resolve, reject) => {
      var rows: any[] = [];
      if (Array.isArray(data)) rows = data;
      else rows.push(data);

      let row = rows[0];
      let keys = [];
      let values = [];
      let varValue = [];

      for (var key in row) {
        keys.push(key);
        varValue.push('?');
      }

      let sql1 = `INSERT or REPLACE INTO ${entity} (${keys.join()}) `;
      let sql2 = 'VALUES ';
      let aux = varValue.join();

      for (let index = 0; index < rows.length; index++) {
        let dt = rows[index];
        for (var key in rows[index]) {
          values.push(dt[key]);
        }
        sql2 += `(${aux})${(index == rows.length - 1) ? '; ' : ', '} `;
      }

      var SQL = sql1 + sql2;

      console.log('SQL', SQL);
      console.log('values', values);

      this.database.executeSql(SQL, values).then(data => {
        switch (entity) {
          case 'user': this.loadUsers(); break;
          case 'certificado': this.loadCertificados(null, null); break;
          case 'qr': this.loadQRs(null, null); break;
        }
        resolve(true);
      }).catch(async err => {
        console.log('ERROR MAPEADO AL GUARDAR', err);

        resolve(false);
        await this.fun.alert(env.MSG.TYPE_ERROR, 'ok', env.MSG.ERROR_TITLE, err.message);
      });
    });
  }

  getData(filter: any, entity: string, colums?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let values = [];
      let varValue = '';
      if (!filter) filter = [];

      for (var key in filter) {
        values.push(filter[key]);
        varValue += `and ${key} = ? `;
      }

      if (this.fun.isVarInvalid(colums)) colums = '*';

      let SQL = `SELECT ${colums} FROM ${entity} WHERE 1 = 1 ${varValue}`;
      console.log('SQL', SQL);
      console.log('values', values);
      let listItems = [];
      return this.database.executeSql(SQL, values).then(data => {
        if (!data) resolve(null);
        if (data.rows.length == 0) resolve(listItems);
        for (var i = 0; i < data.rows.length; i++) {
          listItems.push(data.rows.item(i));
          if (i == data.rows.length - 1) resolve(listItems);
        }

      }).catch(async err => {
        resolve(false);
        await this.fun.alert(env.MSG.TYPE_ERROR, 'ok', env.MSG.ERROR_TITLE, err.message);
      });
    });

  }

  updateData(data: any, condition: any, entity: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let values = [];
      let varValue = [];
      let valuesCondition = [];
      let varCondition = [];
      for (var key in data) {
        values.push(data[key]);
        varValue.push(`${key} = ?`);
      }

      let varConditional = " and ";
      if (condition.type == 'MULTIPLE') {

        varConditional = " or ";
        for (var key in condition.condition) {
          valuesCondition = condition.condition[key];
          for (let index = 0; index < valuesCondition.length; index++) {
            varCondition.push(`${key} = ?`);
          }
        }
      } else {
        for (var key in condition.condition) {
          valuesCondition.push(condition.condition[key]);
          varCondition.push(`${key} = ?`);
        }
      }

      let SQL = `UPDATE ${entity} SET ${varValue.join()} WHERE ${varCondition.join(varConditional)}`;

      this.database.executeSql(SQL, values.concat(valuesCondition)).then(data => {
        switch (entity) {
          case 'user': this.loadUsers(); break;
          case 'certificado': this.loadCertificados(null, null); break;
        }
        resolve(true);
      }).catch(async err => {
        resolve(false);
        await this.fun.alert(env.MSG.TYPE_ERROR, 'ok', env.MSG.ERROR_TITLE, err.message);
      });

    });
  }


  deleteData(condition: any, entity: string) {

    let valuesCondition = [];
    let varCondition = [];
    for (var key in condition) {
      valuesCondition.push(condition[key]);
      varCondition.push(`${key} = ?`);
    }
    let SQL = `DELETE FROM ${entity} WHERE 1 = 1 and ${varCondition.join(' and ')}`;
    return this.database.executeSql(SQL, valuesCondition).then(_ => {
      console.log('DATA eliminada');
      this.loadCertificados(null, null);
    })
  }

  /* *************** CERTIFICADOS ******************* */
  loadCertificados(estado, type) {

    console.log('MOSTRARRRR PK', this.storage.userSesion);

    /*   let qSesion = 'and emisor_did = "' + this.storage.userSesion.publicKey + '"'; */
    let qSesion = 'and emisor_ident = "' + this.storage.userSesion.idens[0].number + '"';

    if (this.storage.userSesion.publicKey == '') qSesion = '';

    let SQL = 'SELECT * FROM certificado WHERE 1 = 1 ' + qSesion;
    if (estado != null) SQL += ' and status ="' + estado + '"';
    if (type != null) SQL += ' and code ="' + type + '"';


    console.log('MOSTRAR SQL', SQL);

    return this.database.executeSql(SQL, []).then(data => {
      let certificados: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          certificados.push({
            id: data.rows.item(i).id,
            codeReg: data.rows.item(i).codeReg,
            code: data.rows.item(i).code,
            title: data.rows.item(i).title,
            data: data.rows.item(i).data,
            dataScreen: data.rows.item(i).dataScreen,
            frecord: data.rows.item(i).frecord,
            fsend: data.rows.item(i).fsend,
            status: data.rows.item(i).status,
            tx: data.rows.item(i).tx,
            emisor_did: data.rows.item(i).emisor_did,
            emisor_name: data.rows.item(i).emisor_name,
            emisor_role: data.rows.item(i).emisor_role,
            titular_name: data.rows.item(i).titular_name,
            contract_card: data.rows.item(i).contract_card,
            code_card: data.rows.item(i).code_card,
            certificateType: data.rows.item(i).certificateType,
            code_almc: data.rows.item(i).code_almc,
            f_emision: data.rows.item(i).f_emision,
            titular_adrx: data.rows.item(i).titular_adrx,
            img_cert: data.rows.item(i).img_cert,
            img_ipfs: data.rows.item(i).img_ipfs
          })
        }
      }
      this.certificados.next(certificados);
    });
  }


  loadQRs(estado, type) {

    console.log('MOSTRARRRR PKasasasasasasasasasasasa', this.storage.userSesion);

    /*   let qSesion = 'and emisor_did = "' + this.storage.userSesion.publicKey + '"'; */
    
    let qSesion = 'and emisor_ident = "' + sha256(this.storage.userSesion.email + this.storage.userSesion.idens[0].number) + '"';

    if (this.storage.userSesion.publicKey == '') qSesion = '';

    let SQL = 'SELECT * FROM qr WHERE 1 = 1 ' + qSesion;
    /*  
    if (estado != null) SQL += ' and status ="' + estado + '"';
    if (type != null) SQL += ' and code ="' + type + '"'; 
    */

    console.log('MOSTRAR SQL', SQL);

    return this.database.executeSql(SQL, []).then(data => {
      let regs: any[] = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          regs.push({
            id: data.rows.item(i).id,
            desc: data.rows.item(i).desc,
            objective_cert: data.rows.item(i).objective_cert,
            f_emision: data.rows.item(i).f_emision,
            f_vencimineto: data.rows.item(i).f_vencimineto,
            trxid: data.rows.item(i).trxid,
            imgTypeSreen: data.rows.item(i).imgTypeSreen,
            emisor_ident: data.rows.item(i).emisor_ident,
            dataCredential: data.rows.item(i).dataCredential,
            status: data.rows.item(i).status
          })
        }
      }
      this.qrs.next(regs);
    });
  }




}
