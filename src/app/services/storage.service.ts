
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { environment as env } from 'src/environments/environment';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async validarAuth(): Promise<boolean> {
    let data = await this.get(env.TOKEN_KEY);
    console.log(data);
    if (data) return Promise.resolve(true);
    return Promise.resolve(false);
  }

  async get(name): Promise<any> {
    let item = await Storage.get({ key: name }) || null;
    let value = item.value;
    if (!value) value = null;
    if (typeof value != 'object') value = JSON.parse(value)
    return Promise.resolve(value);
  }

  async set(name, data) {
    await Storage.set({ key: name, value: JSON.stringify(data) });
  }

  async remove(key) {
    await Storage.remove({ key });
  }

}
