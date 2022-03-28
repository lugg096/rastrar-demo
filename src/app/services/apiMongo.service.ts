import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';
import { sha256 } from 'js-sha256';

@Injectable({
    providedIn: 'root'
})
export class ApiMongoService {

    constructor(
        private _http: HttpClient,
    ) { }
    
    corporationCode = '_STAMPING';
    dominio: any = env.url;

    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.auth_token}`
    });

    delete(collection, table, key) {
        const URL = this.dominio.concat(`db/${collection}/${table}/${key}`);
        console.log('URL DELETE',URL);
        
        return this._http.delete(URL).toPromise();
    }

    getkey(collection, table, key) {
        const URL = this.dominio.concat(`db/${collection}/${table}/${key}`);
        return this._http.get(URL).toPromise();
    }

    changeStatus(collection, table, key, status) {
        const URL = this.dominio.concat(`db/${collection}/${table}/${key}?status=${status}`);
        return this._http.post(URL, {}).toPromise();
    }

    create(collection, table, key, body, upsert) {
        const URL = this.dominio.concat(`db/${collection}/${table}/${key}/?upsert=${upsert}`);
        console.log('URL', URL);
        console.log('collection', collection);
        console.log('table', table);
        console.log('key', key);
        console.log('upsert', upsert);
        console.log('body', body);
        return this._http.post(URL, body).toPromise();
    }

    get(collection, table, item) {
        const URL = this.dominio.concat(`db/${collection}/${table}/${item}`);
        console.log('URL', URL);

        return this._http.get(URL).toPromise();
    }

    postGenerate(params, body) {
        const URL = this.dominio.concat(`${params}`);
        console.log('URL', URL);
        console.log('body', body);
        return this._http.post(URL, body, { headers: this.headers }).toPromise();
    }

    filter(collection, table, filter) {
        const URL = this.dominio.concat(`db/${collection}/${table}/filter`);
        console.log('URL', URL);

        console.log('filter',filter);
        return this._http.post(URL, filter).toPromise();
    }


    uploadFile(fileB64, ext) {
        const body: any = {
            hash: sha256(fileB64),
            ext: ext,
            type: "base64",
            content: fileB64,
        }
        const URL = this.dominio.concat(`upload`);
        return this._http.post(URL, body, { headers: this.headers });
    }

    _filter(collection, table, filter) {
        const URL = this.dominio.concat(`db/${collection}/${table}/filter`);
        console.log('URL', URL);

        return this._http.post(URL, filter);
    }

    _get(collection, table, item) {
        const URL = this.dominio.concat(`db/${collection}/${table}/${item}`);
        return this._http.get(URL);
    }

    _create(collection, table, key, body, upsert) {
        const URL = this.dominio.concat(`db/${collection}/${table}/${key}/?upsert=${upsert}`);
        console.log('URL', URL);
        console.log('collection', collection);
        console.log('table', table);
        console.log('key', key);
        console.log('upsert', upsert);
        console.log('body', body);
        return this._http.post(URL, body);
    }
}
