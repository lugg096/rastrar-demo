import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { ApiMongoService } from './apiMongo.service';

@Injectable({
  providedIn: 'root'
})
export class EliminabledService {

  constructor(
    private _apiMongo: ApiMongoService,) { }


  role(roles) {
    roles.forEach(async r => {
      let table_key = env.TABLE_SIS.role;
      let res: any = await this._apiMongo.getkey(env.COLLECTION.general,table_key, r.key);
      let role = res.result[0][table_key][0];

      var body: any = {
        name: role.name,
        count: 0,
        eliminabled: false,
        process: role.data.process,
        conf_web:role.data.conf_web,
        conf_app:role.data.conf_app,
        acc_web: role.data.acc_web,
        acc_app: role.data.acc_app
      }

      this._apiMongo.create(env.COLLECTION.general,table_key, role.key, body, true);
    });

  }
}
